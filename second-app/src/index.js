import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.animal = React.createRef();
        document.addEventListener("mousemove", (e) => {});
    }

    render() {


        return (
            <div>
                {/* <ProximityIndicator proximity={Infinity}/> */}
                <Rustacean height={60} position={{"x":5, "y":78}}/>
            </div>
        );
    }
}

class Rustacean extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let height = this.props.height;
        let width = this.props.height * 1.5;
        return (
            <div style={{
                "position":"absolute", 
                "top": `${this.props.position.y}vh`, 
                "left": `${this.props.position.x}vw`,
                "marginTop": `${-(height/2)}px`,
                "marginLeft": `${-(width/2)}px`
            }}>
                <img src="/rustacean.svg" alt="rustacean" style={{"height": `${height}px`, "width": `${width}px`}}/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
