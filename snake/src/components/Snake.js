import React from 'react'
import Eyes from './Eyes'
import getNodes from '../util/getnodes'

const Snake = ({snake, node_size}) => (
    <g>
        {[
            {x: snake.x, y: snake.y},
            ...getNodes(snake)
        ].map(
            (location, i) => (
                <circle key = {i} cx = {location.x} cy = {location.y} r = {.75} fill = "darkgreen" />
            )
        )}
        <Eyes head = {{x: snake.x, y: snake.y, facing: snake.moving, alive: snake.alive}} />
    </g>
)

export default Snake
