import {all, fork, takeLatest, takeEvery, call, put, take, delay} from 'redux-saga/effects';
import {
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE
} from '../reducers/user';
import axios from 'axios';



function loginAPI() {
    console.log('loginAPI()...');
    // 서버에 요청을 보내는 부분

    return axios.post('./login');
}

function* login() {
    console.log('login()...');

    try {
        // yield call(loginAPI);

        yield delay(2000);
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
        // yield call(signUpAPI);
        yield delay(2000);
        throw new Error('에러에러에러');
        yield put({ // put은 dispatch 동일
            type: SIGN_UP_SUCCESS,
        });

    } catch (e) { // loginAPI 실패
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE,
            error: e
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

