import React, { Component } from 'react'
import Snake from './Snake'
import Apple from './Apple'
import Direction from '../types/direction'
import getNodes from '../util/getnodes'

const CELL_SIZE = 20;
const GRID_SIZE = 30;


class Grid extends Component {
    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            const direction = Direction.from_arrow(e.key)
            if(direction !== null && this.props.snake.alive) {
                this.props.onSnakeTurn(direction)
                e.preventDefault()
            }
        })
        this.interval = setInterval(() => {
            this.props.onSnakeMove()
        }, 60)
    }

    componentDidUpdate({apple: prevApple, snake: prevSnake}) {
        const {apple, snake, onSnakeEat, onSnakeDie} = this.props
        if (snake.x !== prevSnake.x || snake.y !== prevSnake.y) {
            if (snake.x === apple.x && snake.y === apple.y) {
                onSnakeEat()
            }
            for (let node of getNodes(snake).slice(1)) {
                if (node.x === snake.x && node.y === snake.y) {
                    onSnakeDie()
                    clearInterval(this.interval)
                }
            }
        }
    }

    render() {
        const {apple, snake} = this.props
        return <svg viewBox = {[0, 0, GRID_SIZE, GRID_SIZE]} style = {{width: CELL_SIZE*GRID_SIZE, background: "lightgray"}}>
            <g transform="translate(0.5 0.5)">
                <Snake snake = {snake} />
                <Apple x = {apple.x} y = {apple.y} />
            </g>
        </svg>
    }
}

export default Grid
