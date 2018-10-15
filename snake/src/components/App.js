import React, { Component } from 'react'
import Score from '../containers/Score'
import Game from '../containers/Game'

class App extends Component {
    render() {
        return (
            <div>
                <Score />
                <Game />
            </div>
        );
    }
}

export default App
