import React from 'react'

const getNodes = stretches => {
    stretches.reduce(
        (state, stretch) => {
            let location = {...state.location}
            let nodes = [...state.nodes]
            for (steps = 0; steps < stretch.distance; steps++) {
                offset = stretch.direction.toOffset()
                location.x += offset.x
                location.y += offset.y
                nodes.push({...location})
            }
            return {
                nodes,
                location
            }
        }
    ).nodes
}

const Snake = (head, tail, node_size) => (
    <g>
        {[
            {x: head.x, y: head.y},
            ...getNodes(tail)
        ].map(
            location => (
                <circle cx = {location.x} cy = {location.y} r = {node_size} />
            )
        )}
    </g>
)

