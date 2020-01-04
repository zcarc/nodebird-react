import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';

axios.defaults.baseURL = 'http://localhost:8080/api';

// 리듀서와 마찬가지로 user,post를 불러온다.
export default function* rootSaga() {
  console.log('rootSaga()...');

  yield all([
    call(user),
    call(post),
  ]);
}
