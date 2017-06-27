import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

import {translate} from '../pd-translate/pd-translate.service';
import {PomodoroNumberInput} from '../pd-number-input/pd-number-input.component';

const startIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
const pauseIcon = <FontIcon className="material-icons">pause</FontIcon>
const resetIcon = <FontIcon className="material-icons">restore</FontIcon>

const DEFAULT_REST_TIME = 5;
const DEFAULT_SESSION_TIME = 25;

class PomodoroMain extends React.Component {
    constructor(props) {
        super();

        this.state = {
            resting: false,
            running: false,
            startTime: 0,
            pauseTime: 0,
            sessionNo: 1,
            currentTime: {
                minutes: '00',
                seconds: '00'  
            },
            timeAtRun: {
                sessionTime: 0,
                restTime: 0
            },
            sessionTime: DEFAULT_SESSION_TIME,
            restTime: DEFAULT_REST_TIME
        };

        this.t = props.t;

        Notification.requestPermission();
    }

    run() {
        if (this.state.running) {
            return;
        }

        let diff = 0;
        if (this.state.startTime !== 0 && this.state.pauseTime !== 0) {
            diff = this.state.pauseTime - this.state.startTime;
        }
        this.setState({ 
            running: true,
            startTime: Date.now() - diff,
            timeAtRun: {
                sessionTime: this.state.sessionTime,
                restTime: this.state.restTime
            }
        });
        
        this.tick();
    }

    pause() {
        this.setState({
            running: false,
            pauseTime: Date.now()
        });
    }

    reset() {
        this.setState({
            running: false,
            resting: false,
            startTime: Date.now(),
            pauseTime: 0
        });

        setTimeout(() => {
            this.updateClock();
        }, 10);
    }

    tick() {
        setTimeout(() => {
            if (this.state.running) {
                this.updateClock();
                this.tick();
            }
        }, 100);
    }

    updateClock() {
        let totalTime = this.state.timeAtRun.sessionTime + this.state.timeAtRun.restTime;
        let diffMs = (totalTime * 60000 + this.state.startTime) - Date.now();
        let currentTime = Math.round(diffMs / 1000);

        if (currentTime < this.state.timeAtRun.restTime * 60 && !this.state.resting) {
            this.setState({ resting: true });
            this.notify(this.t("NOTIFICATIONS.REST"));
        }
        
        if (!this.state.resting) {
            currentTime -= this.state.timeAtRun.restTime * 60;
            if (currentTime < 0) {
                currentTime = 0;
            }
        }

        if (currentTime < 0 && this.state.resting) {
            currentTime = 0;
            this.reset();
            this.setState({ sessionNo: this.state.sessionNo + 1 });
            this.notify(this.t("NOTIFICATIONS.COMPLETE", { n: this.state.sessionNo }));
        }

        this.setState({
            currentTime: {
                minutes: ('0' + Math.floor(currentTime / 60)).substr(-2),
                seconds: ('0' + currentTime % 60).substr(-2)
            }
        });

        this.setDocumentTitle(this.state.currentTime.minutes, this.state.currentTime.seconds);
    }

    notify(message) {
        // notify here
        if (!("Notification" in window)) {
            return;
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            new Notification(this.t("NOTIFICATIONS.TITLE"), {
                body: message,
                icon: 'img/pomodoro.png'
            });
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    new Notification(this.t("NOTIFICATIONS.TITLE"), {
                        body: message,
                        icon: 'img/pomodoro.png'
                    });
                }
            });
        }
    }

    setDocumentTitle(m, s) {
        if (m && s) {
            document.title = `(${m}:${s}) ` + this.t("APP.PAGE_TITLE");
        } else {
            document.title = this.t("APP.PAGE_TITLE");
        }
    }

    render() {
        return (
            <div className="pomodoro">
                <Paper zDepth={1}>
                    <AppBar
                        title={<span>{this.t("APP.TITLE")}</span>}
                        iconElementRight={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><FontIcon className="material-icons">more_vert</FontIcon></IconButton>
                                }
                                targetOrigin={{horizontal:'right', vertical:'top'}}
                                anchorOrigin={{horizontal:'right', vertical:'top'}}
                            >
                                <MenuItem onTouchTap={() => window.location.href = this.t("APP.POMODORO_LINK")} primaryText={this.t("APP.WHATS_POMODORO")} />
                            </IconMenu>
                        }
                    />

                    <div className="center-text padding-bottom-15px">
                        <div className="timer">{this.state.currentTime.minutes}:{this.state.currentTime.seconds}</div>

                        <h2>{this.t("SET_SESSION_TIME")}</h2>
                        <PomodoroNumberInput 
                            value={this.state.sessionTime}
                            setValue={m => this.setState({ sessionTime: 0.2 })}></PomodoroNumberInput>

                        <h2>{this.t("SET_REST_TIME")}</h2>
                        <PomodoroNumberInput 
                            value={this.state.restTime}
                            setValue={m => this.setState({ restTime: 0.2 })}></PomodoroNumberInput>
                    </div>

                    <BottomNavigation>
                        <BottomNavigationItem
                            label={this.t("ACTIONS.START")}
                            icon={startIcon}
                            onTouchTap={() => this.run()} 
                        />
                        <BottomNavigationItem
                            label={this.t("ACTIONS.PAUSE")}
                            icon={pauseIcon}
                            onTouchTap={() => this.pause()} 
                        />
                        <BottomNavigationItem
                            label={this.t("ACTIONS.RESET")}
                            icon={resetIcon}
                            onTouchTap={() => this.reset()} 
                        />
                    </BottomNavigation>
                </Paper>
            </div>
        )
    }
};

export default translate(PomodoroMain);