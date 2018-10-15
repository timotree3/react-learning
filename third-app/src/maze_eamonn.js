import React from 'react';
import ReactDOM from 'react-dom';
import arr from './maze_data_eamonn';

console.log(arr);

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

    static equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}

const MAZE_SIZE = 41;
// const WALL_RATIO = 0.3;
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
            ], this.size),
            "message": ""
        }
    }

    render() {
        return (
            <div>
                <Maze size = {this.size} rows = {this.state.grid}/>
                <button onClick = {(e) => this.pathFind()}>FIND PATH</button>
                <h1>{this.state.message}</h1>
            </div>
        );
    }

    pathFind() {
        this.setState({
            ...this.state,
            "message": "finding path..."
        });
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
        let {updatedGrid, found} = findPath(grid, unvisited_locations, START, END);
        let message;
        if (found) {
            message = "";
        } else {
            message = "no path found";
        }
        this.setState({
            ...this.state,
            "grid": updatedGrid,
            message
        });
    }
}

const findPath = (grid, unvisited_locations, start, end) => {
    let current = start.in(grid);
    while (!Coord.equal(current.location, end)) {
        let neighbors = current.location
        .neighbors()
        .map(
            (coord) => coord.in(grid),
        )
        .filter(
            (node) => !node.visited && node.type !== "wall"
        );
        for (let i = 0; i < neighbors.length; i++) {
            neighbors[i].distance = Math.min(
                neighbors[i].distance,
                current.distance + 1
            );
        }
        current.visited = true;
        unvisited_locations = unvisited_locations.filter(
            (coords) => !Coord.equal(coords, current.location)
        )
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
            return {"updatedGrid": grid, "found": false};
        }
    }
    // we found the shortest path!
    // retrace our steps
    console.log("there is a path");
    let path = [];
    while (!Coord.equal(current.location, START)) {
        path.unshift(current.location);
        current.location.in(grid).type = "path";
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

    return {"updatedGrid": grid, "found": true};
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
    // for (let x = 0; x < size; x++) {
    //     list.push(new Coord(x, 0));
    //     list.push(new Coord(x, size-1));
    // }
    // for (let y = 0; y < size; y++) {
    //     list.push(new Coord(0, y));
    //     list.push(new Coord(size-1, y));
    // }
    return list;
}

// const withinEdges = (lower, upper) => {
//     let list = [];
//     for (let x = lower; x < upper; x++) {
//         for (let y = lower; y < upper; y++) {
//             if (Math.random() <= WALL_RATIO) {
//                 list.push(new Coord(x, y));
//             }
//         }
//     }
//     return list;
// }

// EAMONN

const withinEdges = () => {
    let list = [];
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr.length; x++) {
            if (!arr[y][x]) {
                list.push(new Coord(x , y));
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
                "width": "10px",
                "height": "10px",
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
