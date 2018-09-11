import React from 'react'
import Eyes from './Eyes'

const getNodes = ({x, y, extensions}) => {
    console.log("extensions", extensions);
    let nodes = [{x, y}];
    let currentX = x;
    let currentY = y;
    for (let direction of extensions) {
        let offset = direction.toOffset();
        currentX += offset.x;
        currentY += offset.y;
        nodes.push({x: currentX, y: currentY});
    }
    return nodes;
}

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
        <Eyes head = {{x: snake.x, y: snake.y, facing: snake.moving}} />
    </g>
)

export default Snake
