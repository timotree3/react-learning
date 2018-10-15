import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.indicator = React.createRef();
        let newX = random(100);
        let newY = random(100);
        this.state = {
            "initiateBlink": true,
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
            if (this.state.initiateBlink) {
                this.setState({
                    ...this.state,
                    "initiateBlink": false
                });
                this.indicator.current.blink();
            }
        });
    }

    render() {


        return (
            <div>
                <h1>{this.state.crabsFound} rustacean{(this.state.crabsFound === 1)?"":"s"} found</h1>
                <ProximityIndicator proximity={this.state.mouseDistance} ref={this.indicator}/>
                <Rustacean moveMe={(e) => this.newCrab()} height={60} position={this.state.crabLocation}/>
            </div>
        );
    }

    newCrab() {
        console.log("NEW CRAB!!!!");
        let newX = random(100);
        let newY = random(100);
        this.indicator.current.stopBlinking();
        this.setState({
            ...this.state,
            "initiateBlink": true,
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
    constructor(props) {
        super(props);
        this.state = {
            "timer": null,
            "display": false,
            "color": "grey"
        };
    }

    stopBlinking() {
        clearTimeout(this.state.timer);
    }

    blink() {
        this.stopBlinking();
        console.log("blink");
        let color = "grey";
        let delayScale = 50;
        let proximity = this.props.proximity;
        if (proximity <= 30) {
            color = "yellow";
            delayScale = 30;
        }
        if (proximity <= 15) {
            color = "orange";
            delayScale = 15;
        }
        if (proximity <= 5) {
            color = "red";
            delayScale = 5;
        }
        let timer = setTimeout(
            () => {
                let timer = setTimeout(
                    () => {
                        this.blink();
                    }, 70
                );
                this.setState({
                    ...this.state,
                    "timer": timer,
                    "display": false
                });

            }, (delayScale*35)-70
        );
        this.setState({
            ...this.state,
            "timer": timer,
            "display": true,
            "color": color
        });
    }

    render() {
        return (
            <div style = {{"width": "100px", "height": "100px", "backgroundColor": this.state.color, "opacity": (this.state.display)?1:0}}></div>
        );
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
