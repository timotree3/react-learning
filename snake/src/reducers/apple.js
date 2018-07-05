const apple = (state = {}, action) => {
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