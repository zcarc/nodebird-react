import {all, fork, takeLatest, takeEvery, call, put, take} from 'redux-saga/effects';
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

function* watchHello() {

    console.log('watchHello()...');

    yield takeEvery(HELLO_SAGA, function* () {
        yield put({
           type: 'BYE_SAGA'
        });
    });

}

// function* watchHello() {
//
//     while(true) {
//         yield take(HELLO_SAGA);
//         console.log(1);
//         console.log(2);
//         console.log(3);
//         console.log(4);
//     }
// }

function* watchLogin() {

    console.log('watchLogin()...');

    while(true) {
        yield take(LOG_IN);

        yield put({
            type: LOG_IN_SUCCESS,
        });
    }

}


export default function* userSaga() {
    console.log('userSaga()...');

    yield all([
        watchLogin(),
        watchHello(),
    ]);

}

