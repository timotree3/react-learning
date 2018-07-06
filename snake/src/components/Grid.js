import React from 'react'
import Snake from './Snake'
import Apple from './Apple'

const CELL_SIZE = 30;
const GRID_SIZE = 30;

const Grid = (apple, snake, onSnakeTurn) => (
    <svg>
        <Apple x = {apple.x} y = {apple.y} size = {CELL_SIZE} />
        <Snake head = {snake.head} tail = {snake.tail} node_size = {CELL_SIZE} />
    </svg>
)

export default Grid