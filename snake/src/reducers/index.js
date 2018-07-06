import { combineReducers } from 'redux'
import apple from './apple'
import score from './score'
import snake from './snake'

export default combineReducers({
    apple,
    score,
    snake
})