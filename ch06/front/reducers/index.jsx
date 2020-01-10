import { combineReducers } from 'redux';
import user from './user';
import post from './post';

console.log(`### front/reducers/index ###`);

const rootReducer = combineReducers({
    user,
    post,
}) ;

export default rootReducer;