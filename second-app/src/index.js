import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.animal = React.createRef();
        let newX = random(100);
        let newY = random(100);
        this.state = {
            "mouseDistance": Infinity,
            "crabsFound": 0,
            "crabLocation": new SubPosition(newX, newY)
        }
        document.addEventListener("mousemove", (e) => {
            let xPercent = 100*e.pageX/window.innerWidth;
            let yPercent = 100*e.pageY/window.innerHeight;
            // console.log(`Mouse moved! x: ${xPercent} y: ${yPercent}`);
            this.setState({
                ...this.state,
                "mouseDistance": this.state.crabLocation.distance(new SubPosition(xPercent, yPercent))
            });
        });
    }

    render() {


        return (
            <div>
                <h1>{this.state.crabsFound} rustacean{(this.state.crabsFound === 1)?"":"s"} found</h1>
                <ProximityIndicator proximity={this.state.mouseDistance}/>
                <Rustacean moveMe={(e) => this.newCrab()} height={60} position={this.state.crabLocation}/>
            </div>
        );
    }

    newCrab() {
        console.log("NEW CRAB!!!!");
        let newX = random(100);
        let newY = random(100);
        this.setState({
            ...this.state,
            "crabsFound": this.state.crabsFound+1,
            "crabLocation": new SubPosition(newX, newY)
        });
    }
}

const random = function(max) {
    return Math.random()*max;
}

class SubPosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(other) {
        let vw = window.innerWidth;
        let vh = window.innerHeight;
        let distanceX = this.normalizedX(vw, vh) - other.normalizedX(vw, vh);
        let distanceY = this.y - other.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }

    normalizedX(parentWidth, parentHeight) {
        return this.x * parentHeight/parentWidth;
    }
}

class Rustacean extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "display": false
        }
    }

    render() {
        let height = this.props.height;
        let width = this.props.height * 1.5;
        return (
            <div onClick={(e) => this.show()} style={{
                "position":"absolute",
                "left": `${this.props.position.x}vw`,
                "top": `${this.props.position.y}vh`, 
                "marginLeft": `${-(width/2)}px`,
                "marginTop": `${-(height/2)}px`,
                "cursor": "pointer",
                "opacity": this.state.display?1:0
            }}>
                <img src="/rustacean.svg" alt="rustacean" style={{"height": `${height}px`, "width": `${width}px`}}/>
            </div>
        );
    }

    show() {
        if (this.display) {
            return;
        }
        this.setState({
            ...this.state,
            display: true
        });
        setTimeout(
            () => {
                this.props.moveMe();
                this.setState({
                    ...this.state,
                    "display": false
                })
            }, 1500
        );
    }
}

class ProximityIndicator extends React.Component {
    render() {
        return (
            <h1>{Math.round(this.props.proximity)}</h1>
        );
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
