import {Direction} from '../../types/direction'

const initialState = {
    x: 3,
    y: 3,
    facing: Direction.right
}

const head = (state = initialState, action) => {
    switch (action.type) {
        case 'TURN_SNAKE':
            return {
                ...state,
                facing: action.direction
            }
        case 'MOVE_SNAKE':
            const {x, y} = state.facing.toOffset();
            return {
                ...state,
                x: state.x + x,
                y: state.y + y,
            }
    }
}