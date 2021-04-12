import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/main.scss';

const App = () => {
    return (
        <div>
            <div style={{ backgroundColor: 'red', color: 'white' }}>
                This is placeholder for main appError js.
            </div>
        </div>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('content'));
});