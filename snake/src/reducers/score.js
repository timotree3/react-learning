const score = (state = 0, action) => {
    switch (action.type) {
        case 'GAIN_POINTS':
            return state + action.amount
        default:
            return state
    }
}

export default score