import { all, fork, takeLatest, put, delay } from 'redux-saga/effects';
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE } from '../reducers/post';


function* addPost() {

    try {
        yield delay(2000);
        yield put({
            type: ADD_POST_SUCCESS,
        });

    } catch (e) {

        yield put({
            type: ADD_POST_FAILURE,
            error: e,
        });
    }
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

export default function* postSaga() {
    console.log('postSaga()...');

    yield all([
        fork(watchAddPost),
    ]);
}