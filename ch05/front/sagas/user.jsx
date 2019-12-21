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

axios.defaults.baseURL = 'http://localhost:8080/api';



function loginAPI(loginData) {
    console.log('loginAPI()...');
    // 서버에 요청을 보내는 부분

    // 세번째 인자에 withCredentials를 추가해야 프론트와 백엔드 간에 쿠키를 주고 받을 수 있다.
    return axios.post('/user/login', loginData ,{ 
        withCredentials: true,
    });
}

function* login(action) {
    console.log('login()...');

    try {

        // 서버 routes/user 에서 passport.login()의 리턴된 값을 할당한다.
        const result = yield call(loginAPI, action.data);

        console.log('### result.data: ', result.data, ' ###');

        yield put({ // put은 dispatch 동일
            type: LOG_IN_SUCCESS,
            data: result.data, // axios의 반환값은 result.data에 사용자 정보가 들어있다.
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
    return axios.post('/user/', signUpData);
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

