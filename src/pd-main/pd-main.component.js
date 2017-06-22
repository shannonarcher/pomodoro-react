import React from 'react';
import {PomodoroNumberInput} from '../pd-number-input/pd-number-input.component.js';

const DEFAULT_REST_TIME = 5;
const DEFAULT_SESSION_TIME = 25;

export class PomodoroMain extends React.Component {
    constructor() {
        super();
        this.state = {
            resting: false,
            running: false,
            startTime: 0,
            currentTime: {
             minutes: '00',
             seconds: '00'  
            },
            sessionTime: DEFAULT_SESSION_TIME,
            restTime: DEFAULT_REST_TIME
        };
    }

    run() {
        this.setState({ 
            running: true,
            startTime: Date.now()
        });
        this.updateClock();
        this.tick();
    }

    pause() {
        this.setState({
            running: false
        });
    }

    reset() {
        this.setState({
            startTime: Date.now()
        });
        this.updateClock();
    }

    tick() {
        setTimeout(() => {
            if (this.state.running) {
                this.updateClock();
                this.tick();
            }
        }, 1000);
    }

    updateClock() {
        let totalTime = this.state.sessionTime + this.state.restTime;
        let diffMs = (totalTime * 60000 + this.state.startTime) - Date.now();
        let currentTime = Math.round(diffMs / 1000);

        let resting = false;
        if (currentTime < this.state.restTime * 60) {
            resting = true;
        }
        
        currentTime -= this.state.restTime * 60;
        if (currentTime < 0) {
            currentTime = 0;
        }

        this.setState({
            resting: resting,
            currentTime: {
                minutes: ('0' + Math.floor(currentTime / 60)).substr(-2),
                seconds: ('0' + currentTime % 60).substr(-2)
            }
        });
    }

    render() {
        return (
            <div className="pomodoro">
                <h1>Pomodoro Clock</h1>

                {this.state.currentTime.minutes}:{this.state.currentTime.seconds}

                <h2>Set session time (minutes):</h2>
                <PomodoroNumberInput 
                    value={this.state.sessionTime}
                    setValue={m => this.setState({ sessionTime: m })}></PomodoroNumberInput>

                <h2>Set rest time (minutes):</h2>
                <PomodoroNumberInput 
                    value={this.state.restTime}
                    setValue={m => this.setState({ restTime: m })}></PomodoroNumberInput>

                {this.state.running && <button onClick={() => this.pause()}>Stop Session</button>}
                {!this.state.running && <button onClick={() => this.run()}>Start Session</button>}
                <button onClick={() => this.reset()}>Reset Session</button>
            </div>
        )
    }
};