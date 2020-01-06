import {all, fork, takeLatest, takeEvery, call, put, take, delay} from 'redux-saga/effects';
import {
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE, LOAD_USER_FAILURE, LOAD_USER_SUCCESS, LOAD_USER_REQUEST
} from '../reducers/user';
import axios from 'axios';


function loginAPI(loginData) {
    console.log(`### front/sagas/user.jsx... loginAPI(loginData)... loginData : ${JSON.stringify(loginData)} ###`);
    // 서버에 요청을 보내는 부분

    // 세번째 인자에 withCredentials를 추가해야 프론트와 백엔드 간에 쿠키를 주고 받을 수 있다.
    return axios.post('/user/login', loginData ,{ 
        withCredentials: true,
    });
}

function* login(action) {
    console.log(`### front/sagas/user.jsx... *login(action)... signUpData : ${JSON.stringify(action)} ###`);

    try {

        // 서버 routes/user 에서 passport.login()의 리턴된 값을 할당한다.
        const result = yield call(loginAPI, action.data);

        console.log('### front/sagas/user.jsx... const result = yield call(loginAPI, action.data): ', result, ' ###');

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
    console.log(`### front/sagas/user.jsx... *watchLogin()... ###`);

    yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
    console.log(`### front/sagas/user.jsx... signUpAPI(signUpData)... signUpData : ${JSON.stringify(signUpData)} ###`);

    // 서버에 요청을 보내는 부분
    return axios.post('/user/', signUpData);
}

function* signUp(action) {
    console.log(`### front/sagas/user.jsx... *signUp(action)... action : ${JSON.stringify(action)} ###`);

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
    console.log(`### front/sagas/user.jsx... *watchSignUp()...  ###`);

    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function loadUserAPI(userId) {
    console.log(`### front/sagas/user.jsx... loadUserAPI(userId)... userId : ${JSON.stringify(userId)} ###`);

    // 서버에 요청을 보내는 부분
    return axios.get(userId ? `/user/${userId}` : /user/, { // userId가 있으면 다른사람 정보 불러오고 없다면 내 정보 불러오기
        withCredentials: true,
    });
}

function* loadUser(action) {
    console.log(`### front/sagas/user.jsx... *loadUser(action)... action : ${JSON.stringify(action)} ###`);

    try {
        // yield call(loadUserAPI);
        const result = yield call(loadUserAPI, action.data);
        console.log(`### front/sagas/user.jsx... *loadUser(action)... const result = yield call(loadUserAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
            me: !action.data, // action.data == userId (없다면 true)
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_USER_FAILURE,
            error: e
        });
    }

}

function* watchLoadUser() {
    console.log(`### front/sagas/user.jsx... *watchLoadUser()... ###`);

    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}


export default function* userSaga() {
    console.log(`### front/sagas/user.jsx... userSaga()... ###`);

    yield all([
        fork(watchLogin),
        fork(watchSignUp),
        fork(watchLoadUser),
    ]);

}

