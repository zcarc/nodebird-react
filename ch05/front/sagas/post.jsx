import { all } from 'redux-saga/effects';

export default function* postSaga() {
    console.log('postSaga()...');

    yield all([]);
}