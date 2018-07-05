import React from 'react';
import ReactDOM from 'react-dom';

const GRID_SIZE = 900;
const GRID_SLOTS = 30;
const SLOT_SIZE = GRID_SIZE/GRID_SLOTS;
const NODE_SIZE = SLOT_SIZE*1.2;

class Game extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            head: new Vector(3, 3),
            stretches: [new Stretch(Direction.right(), 1)]
        }
    }

    step() {
        this.setState({
            head: this.state.head.added(this.state.stretches[0].direction.toOffset().scaled(-1)),
            stretches: [stretches[0].extended(), ...stretches.slice(1)],
        });
        if(this.stretches[this.stretches.length-1].shrink()){
            this.stretches.pop();
        }
    }

    turn(heading) {
        if (this.stretches[0].distance === 0) {
            this.stretches[0].direction = heading;
        } else {
            this.stretches.unshift(new Stretch(heading, 0));
        }
    }

    render() {
        let apple = (<Apple x = {SLOT_SIZE*3} y = {SLOT_SIZE*3}/>);
        let stretches = [];
        return (
            <svg>
                {apple}
                <Snake start = {this.head} stretches = {this.stretches}/>
            </svg>
        );
    }
}

class Apple extends React.Component {
    render() {
        return (
            <circle
                cx = {this.props.x}
                cy = {this.props.y}
                r = {SLOT_SIZE}
                fill = "red"
            />
        )
    }
}

class Snake extends React.Component {
    render() {
        let start = this.props.start;
        let tail = [];
        for (let stretch of this.props.stretches) {
            tail.push(<Stretch start = {start} direction = {stretch.direction} distance = {stretch.direction}/>);
            start = stretch.end(start);
        }

        return (
            <g>
                <Head x = {this.props.start.x*SLOT_SIZE} y = {this.props.start.y*SLOT_SIZE} direction = {this.props.stretches[0].direction.negate()}/>
                {tail}
            </g>
        )
    }
}

class Node extends React.Component {
    render() {
        return (
            <circle
                cx = {this.props.x}
                cy = {this.props.y}
                r = {size}
                fill = "green"
            />
        );
    }
}

class Head extends React.Component {
    render() {
        switch (this.props.direction) {

        }
        return (
            <Node x = {this.props.x} y = {this.props.y}/>
        )
    }
}

class Direction {
    constructor(value) {
        this.value = value;
    }

    static from_arrow(keyCode) {
        switch(keyCode) {
            case 38: // UP
                return new Direction(-2);
            case 37: // LEFT
                return new Direction(-1);
            case 39: // RIGHT
                return new Direction(1);
            case 40: // DOWN
                return new Direction(2);
        }
    }

    negate() {
        return new Direction(-this.value);
    }

    toOffset() {
        if (this.code === -1 || this.code === 1) {
            return new Vector(this.code, 0);
        }
        return new Vector(0, this.code<<1)
    }

    static up() {
        return new Direction(-2);
    }

    static left() {
        return new Direction(-1);
    }

    static right() {
        return new Direction(0);
    }

    static down() {
        return new Direction(1);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    scaled(scalar) {
        let v = new Vector(this.x, this.y);
        v.scale(scalar);
        return v;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    added(vector) {
        let v = new Vector(this.x, this.y);
        v.add(vector);
        return v;
    }

    normalized() {
        return new Vector(Math.sign(this.x), Math.sign(this.y));
    }

    static from_direction(direction, magnitude) {
        return direction.toOffset().scale(magnitude);
    }

    on_grid() {
        return {
            x: this.x * SLOT_SIZE,
            y: this.y * SLOT_SIZE
        }
    }
}

class Stretch {
    constructor(direction, distance) {
        this.direction = direction;
        this.distance = distance;
    }

    extended() {
        return new Stretch(this.direction, this.distance + 1);
    }

    shrunk() {
        return new Stretch(this.direction, this.distance - 1);
    }

    end(start) {
        return start.added(Vector.from_direction(this.direction, this.distance));
    }
}

ReactDOM.render(
    <Game/>
    , document.getElementById('root'));
