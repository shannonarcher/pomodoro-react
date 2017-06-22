import React from 'react';

export class PomodoroNumberInput extends React.Component {
    render() {
        return (
            <div className="number-input">
                {this.props.value}
                <button onClick={() => this.props.setValue(this.props.value+1)}>+</button>
                <button onClick={() => this.props.setValue(this.props.value-1)}>-</button>
            </div>
        );
    }
};