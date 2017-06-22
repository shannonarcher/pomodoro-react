import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const DEFAULT_REST_TIME = 5;
const DEFAULT_SESSION_TIME = 25;

class Pomodoro extends React.Component {
    constructor() {
        super();
        this.state = {
            running: false,
            startTime: 0,
            currentTime: 0,
            sessionTime: DEFAULT_SESSION_TIME,
            restTime: DEFAULT_REST_TIME
        };
    }

    run() {
        this.setState({ 
            running: true,
            startTime: Date.now()
        });
        this.tick();
    }

    tick() {
        setTimeout(() => {
            // update clock
            console.log("hello");
            this.updateClock();
            this.tick();
        }, 1000);
    }

    updateClock() {
        let currentTime = Math.round(((this.state.sessionTime * 60000 + this.state.startTime) - Date.now()) / 1000);
        
        if (currentTime < 0) {
            currentTime = 0;
        }

        this.setState({
            currentTime: currentTime
        });
    }

    render() {
        return (
            <div className="pomodoro">
                <h1>Pomodoro Clock</h1>

                {this.state.currentTime}

                <h2>Set session time (minutes):</h2>
                <NumberInput 
                    value={this.state.sessionTime}
                    setValue={m => this.setState({ sessionTime: m })}></NumberInput>

                <h2>Set rest time (minutes):</h2>
                <NumberInput 
                    value={this.state.restTime}
                    setValue={m => this.setState({ restTime: m })}></NumberInput>

                <button onClick={() => this.run()}>Start Session</button>
            </div>
        )
    }
}

class NumberInput extends React.Component {
    render() {
        return (
            <div className="minutes-input">
                {this.props.value}
                <button onClick={() => this.props.setValue(this.props.value+1)}>+</button>
                <button onClick={() => this.props.setValue(this.props.value-1)}>-</button>
            </div>
        );
    }
}

ReactDOM.render(
    <Pomodoro />,
    document.getElementById('root')
);