import React from 'react';
import ReactDOM from 'react-dom';

// for tap events
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {PomodoroMain} from './pd-main/pd-main.component';

import './index.css';

ReactDOM.render(
    <MuiThemeProvider>
        <PomodoroMain />
    </MuiThemeProvider>,
    document.getElementById('root')
);