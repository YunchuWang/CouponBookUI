import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    const buttonText = 'Click Me!';
    return (
        <div>
            <label className="label" htmlFor="some">Enter here:</label>
            <input id="some" type="text"/>
            <button style={{ backgroundColor: 'red', color: 'white' }}>
                {buttonText}
            </button>
        </div>
    );
};

ReactDOM.render(
    <App />,
    document.querySelector('#root')
); 