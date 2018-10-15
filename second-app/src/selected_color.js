import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
    render() {
        return (
            <Form/>
        );
    }
}
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedColor: {red: 0, green: 0, blue: 0},
            wipColor: {red: 0, green: 0, blue: 0}
        };
    }
    render() {
        return (
            <div style={{
                backgroundColor: `rgb(${this.state.displayedColor.red},${this.state.displayedColor.green},${this.state.displayedColor.blue})`,
                width: "100%",
                height: "100%"
            }}>
            <form onSubmit={(e)=>this.handleSubmit(e)}>
                <table>
                    <tbody>
                    <tr>
                        <td><label htmlFor="red">RED</label></td>
                        <td><label htmlFor="green">GREEN</label></td>
                        <td><label htmlFor="blue">BLUE</label></td>
                    </tr>
                    <tr>
                        <td><input value={this.state.wipColor.red} name="red" type="text" onChange={(e) => this.handleNew(e, "red")}/></td>
                        <td><input value={this.state.wipColor.green} name="green" type="text" onChange={(e) => this.handleNew(e, "green")}/></td>
                        <td><input value={this.state.wipColor.blue} name="blue" type="text" onChange={(e) => this.handleNew(e, "blue")}/></td>
                        <td><button type="submit">SUBMIT</button></td>
                    </tr>
                    </tbody>
                </table>
            </form>
            </div>
        );
    }
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.wipColor);
        console.log(`rgb(${this.state.wipColor.red},${this.state.wipColor.green},${this.state.wipColor.blue})`);
        this.setState({displayedColor: this.state.wipColor});
    }
    handleNew(event, channel) {
        let value = event.target.value;
        if (value === "") {
            value = "0";
        } else if (value.length > 1 && value.charAt(0) === "0") {
            value = value.substring(1);
        }
        let obj = {...this.state.wipColor};
        obj[channel] = value;
        this.setState({wipColor: obj});
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
