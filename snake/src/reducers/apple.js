const apple = (state = {x: 1, y: 1}, action) => {
    switch (action.type) {
        case 'MOVE_APPLE':
            return {
                x: action.x,
                y: action.y
            }
        default:
            return state
    }
}

export default apple