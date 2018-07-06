import React from 'react'

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
            location => (
                <circle cx = {location.x * node_size * 1.5} cy = {location.y * node_size * 1.5} r = {node_size} fill = "lime" />
            )
        )}
    </g>
)

export default Snake