import { combineReducers } from "redux";
import { head } from './head';
import { tail } from './tail';

export default combineReducers({
    head,
    tail
})