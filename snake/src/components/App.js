import React, { Component } from 'react'

const GRID_SIZE = 900
const GRID_SLOTS = 30
const SLOT_SIZE = GRID_SIZE/GRID_SLOTS
const NODE_SIZE = SLOT_SIZE*1.2


class App extends Component {
    render() {
        return (
            <Game />
        );
    }
}

export default App
