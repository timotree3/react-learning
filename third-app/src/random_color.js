import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
    render() {
        return (
            <Button/>
        );
    }
}
class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: {red: 0, green: 0, blue: 0}
        };
    }
    render() {
        return (
            <div style={{
                backgroundColor: `rgb(${this.state.color.red},${this.state.color.green},${this.state.color.blue})`,
                width: "100%",
                height: "100%"
            }}>
            <form onSubmit={(e)=>this.handlePress(e)}>
                <button type="submit">SUBMIT</button>
            </form>
            </div>
        );
    }
    handlePress(event) {
        event.preventDefault();
        let color = randomColor();
        console.log(color);
        console.log(`rgb(${this.state.color.red},${this.state.color.green},${this.state.color.blue})`);
        this.setState({color: color});
    }
}

const randint = function(max) {
    return Math.floor(Math.random()*(max+1));
}

const randomColor = function() {
    return {
        red: randint(255),
        green: randint(255),
        blue: randint(255)
    };
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
