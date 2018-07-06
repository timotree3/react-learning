import React from 'react'

const Apple = ({x, y, size}) => (
    <circle cx = {x * size * 1.5} cy = {y * size * 1.5} r = {size} color = "brown" />
)

export default Apple