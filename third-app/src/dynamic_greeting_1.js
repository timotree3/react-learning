import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
    render() {
        return (
            <Greeting Name={prompt("What is your name?")}/>
        );
    }
}
class Greeting extends React.Component {
    render() {
        return (
            <h1 class = "greeting">Hello, {this.props.Name}!</h1>
        );
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
