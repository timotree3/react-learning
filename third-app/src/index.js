import React from 'react';
import ReactDOM from 'react-dom';

const MAZE_SIZE = 12;
const WALL_RATIO = 0.3;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "path": null,
            "grid": initialGrid([
                ...edges(MAZE_SIZE),
                ...withinEdges(1, MAZE_SIZE-1)
            ], MAZE_SIZE)
        }
    }

    render() {
        return (
            <div>
                <Maze size = {MAZE_SIZE} rows = {this.state.grid} path = {this.state.path}/>
                <button onClick = {(e) => this.pathfind()}>FIND PATH</button>
            </div>
        );
    }

    pathfind() {
        let unvisited = this.state.grid
        .map(
            (row, y) => row.map(
                (item) => Object.assign({}, item)
            ).filter(
                (item, x) => x !== 1 || y !== 1
            )
        ).reduce(
            (acc, val) => acc.concat(val),
            []
        );
        console.log(unvisited);
    }
}

const edges = (size) => {
    let list = [];
    for (let x = 0; x < size; x++) {
        list.push(new Coordinate(x, 0));
        list.push(new Coordinate(x, size-1));
    }
    for (let y = 0; y < size; y++) {
        list.push(new Coordinate(0, y));
        list.push(new Coordinate(size-1, y));
    }
    return list;
}

const withinEdges = (lower, upper) => {
    let list = [];
    for (let x = lower; x < upper; x++) {
        for (let y = lower; y < upper; y++) {
            if (Math.random() <= WALL_RATIO) {
                list.push(new Coordinate(x, y));
            }
        }
    }
    return list;
}

const initialGrid = (walls, size) => {
    let rows = [];
    for (let y = 0; y < size; y++) {
        rows.push([]);
        for (let x = 0; x < size; x++) {
            rows[y].push(new Node());
        }
    }
    console.log("checking walls");
    console.log(rows);
    for (let i = 0; i < walls.length; i++) {
        console.log(`checking wall at x: ${walls[i].y}, y: ${walls[i].x}`);
        rows[walls[i].y][walls[i].x].type = "wall";
    }
    rows[1][1].type = "start";
    rows[MAZE_SIZE-2][MAZE_SIZE-2].type = "end";
    return rows;
}

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Maze extends React.Component {
    render() {
        return (
            <table border = "1">
                <tbody>
                    {this.props.rows.map(
                        (row, i) => <MazeRow key = {i} items = {row}/>
                    )}
                </tbody>
            </table>
        );
    }
}

class MazeRow extends React.Component {
    render() {
        return (
            <tr>
                {this.props.items.map(
                    (item, i) => 
                    <td key = {i}>
                        <MazeCell type = {item.type}/>
                    </td>
                )}
            </tr>
        );
    }
}

class MazeCell extends React.Component {
    render() {
        console.log(this.props.type);
        let color;
        switch (this.props.type) {
            case "wall":
                color = "grey";
                break;
            case "way":
                color = "white";
                break;
            case "start":
                color = "green";
                break;
            case "end":
                color = "red";
                break;
            default:
                color = "salmon"
        }
        return (
            <div style = {{
                "backgroundColor": color,
                "width": "50px",
                "height": "50px",
            }}>
            </div>
        );
    }
}

class Node {
    constructor() {
        this.type = "way";
        this.visited = false;
        this.distance = Infinity;
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
