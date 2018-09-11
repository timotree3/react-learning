import Direction from '../../types/direction'

const initialState = [
    {
        distance: 4,
        direction: Direction.left
    }
]

const tail = (state = initialState, action) => {
    switch (action.type) {
        case 'TURN_SNAKE':
            return [
                {
                  distance: 0,
                  direction: action.direction.negated()
                },
                ...(
                    state[0].distance !== 0
                    ?
                        [state[0]]
                    :
                        []
                ),
                ...state.slice(1, state.length)
            ]

        case 'MOVE_SNAKE':
            return [
                {
                    distance: state[0].distance + (state.length > 1?1:0),
                    direction: state[0].direction
                },
                ...state.slice(1, state.length - 1),
                ...(
                    state.length > 1 && state[state.length - 1].distance !== 1
                    ?
                        [{
                            distance: state[state.length - 1].distance - 1,
                            direction: state[state.length - 1].direction
                        }]
                    :
                        []
                ),
            ]
        case 'GROW_SNAKE':
            return [
                ...state.slice(0, state.length - 1),
                {
                            distance: state[state.length - 1].distance + 1,
                            direction: state[state.length - 1].direction
                },
            ]
        default:
            return state
    }
}

export default tail
