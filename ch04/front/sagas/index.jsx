import { all, call } from 'redux-saga/effects';
import user from './user';
import post from './post';

// 리듀서와 마찬가지로 user,post를 불러온다.
export default function* rootSaga() {

    yield all([
        call(user),
        call(post),
    ]);

}