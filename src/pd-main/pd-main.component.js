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
import {PomodoroClockService} from '../pd-clock/pd-clock.service.js';

const startIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
const pauseIcon = <FontIcon className="material-icons">pause</FontIcon>
const resetIcon = <FontIcon className="material-icons">restore</FontIcon>

const DEFAULT_REST_TIME = 5;
const DEFAULT_SESSION_TIME = 25;

class PomodoroMain extends React.Component {
    constructor(props) {
        super();
        
        this.clock = new PomodoroClockService(DEFAULT_SESSION_TIME, DEFAULT_REST_TIME);

        this.state = {
            notifiedRest: false,
            minutes: '00',
            seconds: '00',
            sessionNo: 1
        };

        this.t = props.t;

        Notification.requestPermission();
    }

    run() {
        this.clock.run();        
        this.tick();
    }

    pause() {
        this.clock.pause();
    }

    reset() {
        this.clock.reset();
        this.setState({ notifiedRest: false });

        setTimeout(() => {
            this.updateClock();
        }, 10);
    }

    tick() {
        setTimeout(() => {
            if (this.clock.running) {
                this.updateClock();
                this.tick();
            }
        }, 100);
    }

    set sessionTime(m) {
        this.setState({
            sessionTime: m
        });
        this.clock.sessionTime = m;
    }
    
    set restTime(m) {
        this.setState({
            restTime: m
        });
        this.clock.restTime = m;
    }

    updateClock() {
        if (this.clock.resting && !this.state.notifiedRest) {
            this.setState({ notifiedRest: true });
            this.notify(this.t("NOTIFICATIONS.REST"));
        }

        if (this.clock.finished) {
            this.setState({ 
                sessionNo: this.state.sessionNo + 1 
            });
            this.notify(this.t("NOTIFICATIONS.COMPLETE", { n: this.state.sessionNo }));
            this.reset();
        }

        this.setState({
            minutes: this.clock.minutes,
            seconds: this.clock.seconds
        });
        this.setDocumentTitle(this.clock.minutes, this.clock.seconds);
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
                        <div className="timer">{this.state.minutes}:{this.state.seconds}</div>

                        <h2>{this.t("SET_SESSION_TIME")}</h2>
                        <PomodoroNumberInput 
                            value={this.clock.sessionTime}
                            setValue={m => this.sessionTime = m }></PomodoroNumberInput>

                        <h2>{this.t("SET_REST_TIME")}</h2>
                        <PomodoroNumberInput 
                            value={this.clock.restTime}
                            setValue={m => this.restTime = m }></PomodoroNumberInput>
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