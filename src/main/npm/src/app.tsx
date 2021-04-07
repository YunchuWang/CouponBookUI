import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
// @ts-ignore
import MyImage from './images/banner.jpg';
// @ts-ignore
import FavIcon from './images/favicon.ico';
import './styles/main.scss';

const App = () => {
    return (
        <div>
            <div className="test-style">
                This is placeholder for main app js.
            </div>
            <img src={MyImage} />
            <img src={FavIcon} />
        </div>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    syncHistoryWithStore(browserHistory);
    ReactDOM.render(<App />, document.getElementById('content'));
});