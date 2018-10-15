import { connect } from 'react-redux'
import Grid from '../components/Grid'
import { turnSnake , moveSnake, gainPoints, moveApple, growSnake, killSnake } from '../actions'

const mapStateToProps = state => ({
    apple: state.apple,
    snake: state.snake
})

const mapDispatchToProps = dispatch => ({
    onSnakeTurn: direction => {
        dispatch(turnSnake(direction))
    }, onSnakeMove: () => {
        dispatch(moveSnake())
    }, onSnakeEat: () => {
        dispatch(gainPoints(10))
        dispatch(moveApple(Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)))
        dispatch(growSnake())
    }, onSnakeDie: () => {
        dispatch(killSnake())
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Grid)
