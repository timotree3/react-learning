import React from 'react';
import ReactDOM from 'react-dom';
const Clock = function() {
    let date = new Date();
    return (
        <span>{date.toLocaleTimeString()}</span>
    );
};
ReactDOM.render(
    <h1>It's <Clock/>!</h1>
    , document.getElementById('root'));
