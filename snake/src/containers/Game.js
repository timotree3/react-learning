import { connect } from 'react-redux'
import Grid from '../components/Grid'
import { turnSnake } from '../actions'

const mapStateToProps = state => ({
    apple: state.apple,
    snake: state.snake
})

const mapDispatchToProps = state => ({
    onSnakeTurn: direction => {
        dispatch(turnSnake(direction))
    } 
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Grid)