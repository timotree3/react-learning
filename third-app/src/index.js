import React from 'react';
import ReactDOM from 'react-dom';

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    offset(x, y) {
        return new Coord(this.x - x, this.y - y);
    }

    neighbors() {
        return [
            this.offset(0, -1),
            this.offset(-1, 0),
            this.offset(+1, 0),
            this.offset(0, +1)
        ];
    }

    in(array) {
        return array[this.y][this.x];
    }
}

const MAZE_SIZE = 12;
const WALL_RATIO = 0.3;
const START = new Coord(1, 1);
const END = new Coord(MAZE_SIZE-2, MAZE_SIZE-2);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.size = MAZE_SIZE;
        this.state = {
            "grid": initialGrid([
                ...edges(this.size),
                ...withinEdges(1, this.size-1)
            ], this.size)
        }
    }

    render() {
        return (
            <div>
                <Maze size = {this.size} rows = {this.state.grid}/>
                <button onClick = {(e) => console.log(this.pathfind())}>FIND PATH</button>
            </div>
        );
    }

    pathfind() {
        let grid = [];
        START.in(this.state.grid).type = "start";
        START.in(this.state.grid).distance = 0;
        END.in(this.state.grid).type = "end";
        let unvisited_locations = [];
        for (let y = 0; y < this.size; y++) {
            grid.push([]);
            for (let x = 0; x < this.size; x++) {
                const coord = new Coord(x, y);
                const node = Object.assign({}, coord.in(this.state.grid));
                grid[y].push(node);
                if (!node.visited && node.type !== "wall") {
                    unvisited_locations.push(coord);
                }
            }
        }
        let current = START.in(grid);
        while (current.location !== END) {
            console.log(current);
            let neighbors = current.location
            .neighbors()
            .map(
                (coord) => coord.in(grid),
            )
            .filter(
                (node) => !node.visited && node.type !== "wall"
            );
            for (let neighbor of neighbors) {
                neighbor.distance = Math.min(
                    neighbor.distance,
                    current.distance + 1
                );
            }
            current.visited = true;
            console.log("before");
            console.log(unvisited_locations);
            unvisited_locations = unvisited_locations.filter(
                (coords) => {
                    console.log(`${coords} !== ${current.location}`);
                    return !(coords.x === current.location.x && coords.y === current.location.y);
                }
            )
            console.log("after");
            console.log(unvisited_locations);
            const fake_node = new Node(new Coord(-1, -1));
            current = unvisited_locations
            .map(
                (coords) => coords.in(grid)
            ).reduce(
                closestNode,
                fake_node
            );
            if (current === fake_node) {
                // there is no path
                console.log("there is no path");
                this.setState({
                    ...this.state,
                    "grid": grid
                });
                return null;
            }
            // console.log("STOP");
            // return;
        }
        // we found the shortest path!
        // retrace our steps
        let path = [];
        while (current.location !== START) {
            path.unshift(current.location);
            let neighbors = current.location
            .neighbors()
            .map(
                (coord) => coord.in(grid),
            )
            current = neighbors.reduce(
                closestNode,
                neighbors[0]
            );
        }

        return path;
        
    }
}

const closestNode = (a, b) => {
    if (a.distance > b.distance) {
        return b;
    } else {
        return a;
    }
}

const edges = (size) => {
    let list = [];
    for (let x = 0; x < size; x++) {
        list.push(new Coord(x, 0));
        list.push(new Coord(x, size-1));
    }
    for (let y = 0; y < size; y++) {
        list.push(new Coord(0, y));
        list.push(new Coord(size-1, y));
    }
    return list;
}

const withinEdges = (lower, upper) => {
    let list = [];
    for (let x = lower; x < upper; x++) {
        for (let y = lower; y < upper; y++) {
            if (Math.random() <= WALL_RATIO) {
                list.push(new Coord(x, y));
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
            rows[y].push(new Node(new Coord(x, y)));
        }
    }
    console.log("checking walls");
    console.log(rows);
    for (let i = 0; i < walls.length; i++) {
        console.log(`checking wall at x: ${walls[i].y}, y: ${walls[i].x}`);
        walls[i].in(rows).type = "wall";
    }
    return rows;
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
            case "path":
                color = "black";
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
    constructor(coords) {
        this.type = "way";
        this.visited = false;
        this.distance = Infinity;
        this.location = coords;
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
