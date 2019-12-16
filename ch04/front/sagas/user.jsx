import {all, fork, takeLatest, call, put, take} from 'redux-saga/effects';
import {LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE} from '../reducers/user';

const HELLO_SAGA = 'HELLO_SAGA';

function loginAPI() {
    // 서버에 요청을 보내는 부분
}

function* login() {

    try {
        yield call(loginAPI);
        yield put({ // put은 dispatch 동일
            type: LOG_IN_SUCCESS,
        });

    } catch (e) { // loginAPI 실패
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE,
        });
    }

}

function* watchLogin() {

    while(true) {
        yield take(LOG_IN);

        yield put({
            type: LOG_IN_SUCCESS,
        });
    }

}

function* watchSignUp() {
}


export default function* userSaga() {
    console.log('userSaga()...');

    yield all([
        watchLogin(),
        watchSignUp(),
    ]);

}

