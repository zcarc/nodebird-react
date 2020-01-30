import {all, fork, takeLatest, takeEvery, call, put, take, delay} from 'redux-saga/effects';
import {
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    LOAD_USER_FAILURE,
    LOAD_USER_SUCCESS,
    LOAD_USER_REQUEST,
    LOG_OUT_SUCCESS,
    LOG_OUT_FAILURE,
    LOG_OUT_REQUEST,
    FOLLOW_USER_FAILURE,
    FOLLOW_USER_REQUEST,
    FOLLOW_USER_SUCCESS,
    UNFOLLOW_USER_REQUEST,
    UNFOLLOW_USER_FAILURE,
    UNFOLLOW_USER_SUCCESS,
    LOAD_FOLLOWERS_SUCCESS,
    LOAD_FOLLOWERS_FAILURE,
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWINGS_SUCCESS,
    LOAD_FOLLOWINGS_FAILURE,
    LOAD_FOLLOWINGS_REQUEST,
    REMOVE_FOLLOWER_SUCCESS,
    REMOVE_FOLLOWER_FAILURE,
    REMOVE_FOLLOWER_REQUEST,
    EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE, EDIT_NICKNAME_REQUEST
} from '../reducers/user';
import axios from 'axios';


function logInAPI(loginData) {
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
        const result = yield call(logInAPI, action.data);
        console.log('### front/sagas/user.jsx... const result = yield call(loginAPI, action.data): ', result, ' ###');

        yield put({ // put은 dispatch 동일
            type: LOG_IN_SUCCESS,
            data: result.data, // axios의 반환값은 result.data에 사용자 정보가 들어있다.
        });

    } catch (e) { // loginAPI 실패

        console.error('### front/sagas/user... LOG_IN_FAILURE... e:', e, ' ###');
        // console.dir(e);

        yield put({
            type: LOG_IN_FAILURE,
            reason: e.response && e.response.data,
        });
    }

}

function* watchLogIn() {
    console.log(`### front/sagas/user.jsx... *watchLogIn()... ###`);

    yield takeEvery(LOG_IN_REQUEST, login);
}

function logOutAPI() {
    console.log(`### front/sagas/user.jsx... logOutAPI(logOutData)... ###`);

    // 서버에 요청을 보내는 부분
    return axios.post('/user/logout', {} , {
        // 쿠키를 다른 서버로 보낼려면 설정
        withCredentials: true,
    });
}

function* logOut(action) {
    console.log(`### front/sagas/user.jsx... *logOut(action)... action : ${JSON.stringify(action)} ###`);

    try {
        yield call(logOutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        });

    } catch (e) { // loginAPI 실패
        console.error(e);
        yield put({
            type: LOG_OUT_FAILURE,
            error: e
        });
    }

}

function* watchLogout() {
    console.log(`### front/sagas/user.jsx... *watchSignUp()...  ###`);

    yield takeEvery(LOG_OUT_REQUEST, logOut);
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
    return axios.get(userId ? `/user/${userId || 0}` : '/user/', { // userId가 있으면 다른사람 정보 불러오고 없다면 내 정보 불러오기
        // 클라이언트에서 백엔드 서버로 요청을 보낼 때는 브라우저가 쿠키를 동봉해준다.
        // 그래서 이 부분을 추가해주면 브라우저가 쿠키를 같이 보내준다.
        // 하지만 서버 사이드 렌더링일 경우는, 브라우저가 없다.
        // 이 경우에는 개발자가 직접 넣어줘야한다.
        withCredentials: true,
    });
}

function* loadUser(action) {
    console.log(`### front/sagas/user.jsx... *loadUser(action)... action : ${JSON.stringify(action)} ###`);

    try {
        // yield call(loadUserAPI);
        const result = yield call(loadUserAPI, action.data);
        console.log('### front/sagas/user.jsx... *loadUser(action)... const result = yield call(loadUserAPI, action.data): ', result, ' ###');

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


function followAPI(userId) {
    console.log(`### front/sagas/user.jsx... followAPI(userId)... userId : ${JSON.stringify(userId)} ###`);

    // 서버에 요청을 보내는 부분
    return axios.post(`/user/${userId}/follow`, {}, { // userId가 있으면 다른사람 정보 불러오고 없다면 내 정보 불러오기
        withCredentials: true,
    });
}

function* follow(action) {
    console.log(`### front/sagas/user.jsx... *follow(action)... action : ${JSON.stringify(action)} ###`);

    try {
        const result = yield call(followAPI, action.data);
        console.log(`### front/sagas/user.jsx... *follow(action)... const result = yield call(followAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: FOLLOW_USER_SUCCESS,
            data: result.data,
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: FOLLOW_USER_FAILURE,
            error: e
        });
    }

}

function* watchFollow() {
    console.log(`### front/sagas/user.jsx... *watchFollow()... ###`);

    yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unFollowAPI(userId) {
    console.log(`### front/sagas/user.jsx... unFollowAPI(userId)... userId : ${JSON.stringify(userId)} ###`);

    // 서버에 요청을 보내는 부분
    return axios.delete(`/user/${userId}/follow`,  { // userId가 있으면 다른사람 정보 불러오고 없다면 내 정보 불러오기
        withCredentials: true,
    });
}

function* unFollow(action) {
    console.log(`### front/sagas/user.jsx... *unFollow(action)... action : ${JSON.stringify(action)} ###`);

    try {
        const result = yield call(unFollowAPI, action.data);
        console.log(`### front/sagas/user.jsx... *unFollow(action)... const result = yield call(unFollowAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: UNFOLLOW_USER_SUCCESS,
            data: result.data,
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: UNFOLLOW_USER_FAILURE,
            error: e
        });
    }

}

function* watchUnFollow() {
    console.log(`### front/sagas/user.jsx... *watchUnFollow()... ###`);

    yield takeEvery(UNFOLLOW_USER_REQUEST, unFollow);
}

// 매개변수 userId가 null인 경우 기본 값이 적용이 안된다.
// undefiend인 경우에만 기본값이 적용된다.
function loadFollowersAPI(userId, offset = 0, limit = 3) {
    console.log(`### front/sagas/user.jsx... loadFollowersAPI(userId)... userId : ${JSON.stringify(userId)} ###`);

    return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,  {
        withCredentials: true,
    });
}

function* loadFollowers(action) {
    console.log(`### front/sagas/user.jsx... *loadFollowers(action)... action : ${JSON.stringify(action)} ###`);

    try {
        const result = yield call(loadFollowersAPI, action.data, action.offset);
        console.log(`### front/sagas/user.jsx... *loadFollowers(action)... const result = yield call(loadFollowersAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: e
        });
    }

}

function* watchLoadFollowers() {
    console.log(`### front/sagas/user.jsx... *watchLoadFollowers()... ###`);

    yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}


function loadFollowingsAPI(userId, offset = 0, limit = 3) {
    console.log(`### front/sagas/user.jsx... loadFollowingsAPI(userId)... userId : ${JSON.stringify(userId)} ###`);

    // 값이 없다면 (null 이라면) 0을 넣어준다.
    return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`,  {
        withCredentials: true,
    });
}

function* loadFollowings(action) {
    console.log(`### front/sagas/user.jsx... *loadFollowings(action)... action : ${JSON.stringify(action)} ###`);

    try {
        const result = yield call(loadFollowingsAPI, action.data, action.offset);
        console.log(`### front/sagas/user.jsx... *loadFollowings(action)... const result = yield call(loadFollowingsAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: e
        });
    }

}

function* watchLoadFollowings() {
    console.log(`### front/sagas/user.jsx... *watchLoadFollowings()... ###`);

    yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
    console.log(`### front/sagas/user.jsx... removeFollowerAPI(userId)... userId : ${JSON.stringify(userId)} ###`);

    return axios.delete(`/user/${userId}/follower`,  {
        withCredentials: true,
    });
}

function* removeFollower(action) {
    console.log(`### front/sagas/user.jsx... *removeFollower(action)... action : ${JSON.stringify(action)} ###`);

    try {
        const result = yield call(removeFollowerAPI, action.data);
        console.log(`### front/sagas/user.jsx... *removeFollower(action)... const result = yield call(removeFollowerAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: e
        });
    }

}

function* watchRemoveFollower() {
    console.log(`### front/sagas/user.jsx... *watchRemoveFollower()... ###`);

    yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
    console.log(`### front/sagas/user.jsx... editNicknameAPI(userId)... nickname : ${JSON.stringify(nickname)} ###`);

    // 전체 수정은 put
    // 부분 수정은 patch
    return axios.patch(`/user/nickname`, {nickname},  {
        withCredentials: true,
    });
}

function* editNickname(action) {
    console.log(`### front/sagas/user.jsx... *editNickname(action)... action : ${JSON.stringify(action)} ###`);

    try {
        const result = yield call(editNicknameAPI, action.data);
        console.log(`### front/sagas/user.jsx... *editNickname(action)... const result = yield call(editNicknameAPI, action.data): ${JSON.stringify(result)} ###`);

        yield put({
            type: EDIT_NICKNAME_SUCCESS,
            data: result.data,
        });

    } catch (e) {
        console.error(e);
        yield put({
            type: EDIT_NICKNAME_FAILURE,
            error: e
        });
    }

}

function* watchEditNickname() {
    console.log(`### front/sagas/user.jsx... *watchEditNickname()... ###`);

    yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
    console.log(`### front/sagas/user... ###`);

    yield all([
        fork(watchLogIn),
        fork(watchLogout),
        fork(watchSignUp),
        fork(watchLoadUser),
        fork(watchFollow),
        fork(watchUnFollow),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
        fork(watchEditNickname),
    ]);

}

