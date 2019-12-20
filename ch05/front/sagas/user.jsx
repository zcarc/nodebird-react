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



function loginAPI(loginData) {
    console.log('loginAPI()...');
    // 서버에 요청을 보내는 부분

    return axios.post('./login', loginData);
}

function* login() {
    console.log('login()...');

    try {
        yield call(loginAPI, action.data);
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

function signUpAPI(signUpData) {
    console.log('signUpAPI()...');

    // 서버에 요청을 보내는 부분
    return axios.post('http://localhost:8080/api/user/', signUpData);
}

function* signUp(action) {
    console.log('signUp()...');

    try {
        yield call(signUpAPI, action.data); // call()의 두번째 인자는 첫번째 인자 signUpAPI의 매개변수가 받는다.
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

