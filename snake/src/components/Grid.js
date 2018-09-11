import React, { Component } from 'react'
import Snake from './Snake'
import Apple from './Apple'
import Direction from '../types/direction'

const CELL_SIZE = 20;
const GRID_SIZE = 30;


class Grid extends Component {
    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            const direction = Direction.from_arrow(e.key)
            if(direction !== null) {
                this.props.onSnakeTurn(direction)
                e.preventDefault()
            }
        })
        setInterval(() => {
            this.props.onSnakeMove()
        }, 60)
    }

    componentDidUpdate({apple: prevApple, snake: prevSnake}) {
        const {apple, snake, onSnakeEat} = this.props
        if (snake.x === apple.x && snake.y === apple.y) {
            onSnakeEat()
        }
        // if (snake.x )
    }

    render() {
        const {apple, snake} = this.props
        return <svg viewBox = {[0, 0, GRID_SIZE, GRID_SIZE]} style = {{width: CELL_SIZE*GRID_SIZE, background: "lightgray"}}>
            <g transform="translate(0.5 0.5)">
                <Apple x = {apple.x} y = {apple.y} />
                <Snake snake = {snake} />
            </g>
        </svg>
    }
}

export default Grid
