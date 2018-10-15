import Direction from '../types/direction'

const initialState = {
    alive: true,
    x: 3,
    y: 3,
    moving: Direction.right,
    growing: Direction.left,
    extensions: [
        Direction.left,
        Direction.left,
        Direction.left,
    ],
}

const snake = (state = initialState, action) => {
    switch (action.type) {
        case 'TURN_SNAKE':
            return {
                ...state,
                moving: (
                    Direction.equals(action.direction, state.extensions[0])
                    ?
                    state.moving
                    :
                    action.direction
                ),
            }
        case 'MOVE_SNAKE':
            const {x, y} = state.moving.toOffset();
            return {
                ...state,
                x: state.x + x,
                y: state.y + y,
                growing: state.extensions[state.extensions.length-1],
                extensions: [
                    state.moving.negated(),
                    ...state.extensions.slice(0, -1),
                ],
            }
        case 'GROW_SNAKE':
            return {
                ...state,
                extensions: [
                    ...state.extensions,
                    state.growing,
                ],
            }
        case 'KILL_SNAKE':
            return {
                ...state,
                alive: false,
            }
        default:
            return state
    }
}

export default snake
