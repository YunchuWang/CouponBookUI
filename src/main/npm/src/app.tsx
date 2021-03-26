import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
        <div>
            <div style={{ backgroundColor: 'red', color: 'white' }}>
                This is placeholder for main app js.
            </div>
        </div>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('content'));
});