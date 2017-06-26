import React from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

export class PomodoroNumberInput extends React.Component {
    render() {
        return (
            <div className="number-input">
                <FloatingActionButton
                    mini={true}
                    onClick={() => this.props.setValue(this.props.value-1)}>
                    <FontIcon className="material-icons">remove</FontIcon>
                </FloatingActionButton>
                <span className="number-input__value">{this.props.value}</span>
                <FloatingActionButton
                    mini={true}
                    onClick={() => this.props.setValue(this.props.value+1)}>
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>
            </div>
        );
    }
};