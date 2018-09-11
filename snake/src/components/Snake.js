import React from 'react'
import Eyes from './Eyes'

const getNodes = (head, stretches) => (
    stretches.reduce(
        (state, stretch) => {
            let location = {...state.location}
            let nodes = [...state.nodes]
            for (let steps = 0; steps < stretch.distance; steps++) {
                let offset = stretch.direction.toOffset()
                location.x += offset.x
                location.y += offset.y
                nodes.push({...location})
            }
            return {
                nodes,
                location
            }
        },
        {location: head, nodes: []}
    ).nodes
)

const Snake = ({head, tail, node_size}) => (
    <g>
        {[
            {x: head.x, y: head.y},
            ...getNodes(head, tail)
        ].map(
            (location, i) => (
                <circle key = {i} cx = {location.x} cy = {location.y} r = {.75} fill = "darkgreen" />
            )
        )}
        <Eyes head = {head} />
    </g>
)

export default Snake
