import {all, fork, takeLatest, takeEvery, call, put, take, delay} from 'redux-saga/effects';
import {LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE} from '../reducers/user';
import axios from 'axios';

function* watchLogin() {
    console.log('watchLogin()...');

    yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI() {
    console.log('signUpAPI()...');

    // 서버에 요청을 보내는 부분

    return axios.post('./login');
}

function* signUp() {
    console.log('signUp()...');

    try {
        yield call(signUpAPI);
        yield put({ // put은 dispatch 동일
            type: SIGN_UP_SUCCESS,
        });

    } catch (e) { // loginAPI 실패
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE,
        });
    }

}

function* watchSignUp() {
    console.log('watchSignUp()...');

    yield takeEvery(SIGN_UP_REQUEST, signUp);
}


export default function* userSaga() {
    console.log('userSaga()...');

    yield all([
        fork(watchLogin),
        fork(watchSignUp),
    ]);

}

