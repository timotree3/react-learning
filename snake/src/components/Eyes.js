import React from 'react'
import Direction from '../types/direction'

const Eyes = ({head}) => (
    <g transform={`rotate(${Direction.up.rotateTo(head.facing)} ${head.x} ${head.y})`}>
        <circle cx = {head.x - .25} cy = {head.y - .25} r = {.25} fill = "white" />
        {
            true
            ?
            <circle cx = {head.x - .25} cy = {head.y - .25} r = {.0675} fill = "black" />
            :
            <g>
            <line x1 = {head.x - .0625} y1 = {head.y - .0625} x2 = {head.x - .4375} y2 = {head.y - .4375} stroke = "black" strokeWidth = {.125} />
            <line x1 = {head.x - .0625} y1 = {head.y - .4375} x2 = {head.x - .4375} y2 = {head.y - .0625} stroke = "black" strokeWidth = {.125} />
            </g>
        }
        <circle cx = {head.x + .25} cy = {head.y - .25} r = {.25} fill = "white" />
        {
            true
            ?
            <circle cx = {head.x + .25} cy = {head.y - .25} r = {.0675} fill = "black" />
            :
            <g>
            <line x1 = {head.x + .0625} y1 = {head.y - .0625} x2 = {head.x + .4375} y2 = {head.y - .4375} stroke = "black" strokeWidth = {.125} />
            <line x1 = {head.x + .0625} y1 = {head.y - .4375} x2 = {head.x + .4375} y2 = {head.y - .0625} stroke = "black" strokeWidth = {.125} />
            </g>
        }
    </g>
)

export default Eyes
