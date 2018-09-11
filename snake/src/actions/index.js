export const turnSnake = (direction) => ({
    type: 'TURN_SNAKE',
    direction
})

export const moveSnake = () => ({
    type: 'MOVE_SNAKE'
})

// export const killSnake = () => ({
//     type: 'KILL_SNAKE'
// })

export const growSnake = () => ({
    type: 'GROW_SNAKE'
})

export const moveApple = (x, y) => ({
    type: 'MOVE_APPLE',
    x,
    y
})

export const gainPoints = (amount) => ({
    type: 'GAIN_POINTS',
    amount
})
