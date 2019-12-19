import {
  all, fork, takeLatest, put, delay,
} from 'redux-saga/effects';
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST,
} from '../reducers/post';

function addPostAPI() {

}

function* addPost() {
  try {
    yield delay(2000);
    yield put({
      type: ADD_POST_SUCCESS,
    });
  } catch (e) {
    console.error(e);

    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function addCommentAPI() {

}

// 사가 post.jsx의 addComment(action) 이 부분의 action은
// PostCard.jsx의 ADD_COMMENT_REQUEST를 dispatch하는 메서드의 action이 아래 함수의 매개변수로 넘겨받는다.
function* addComment(action) {
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
      },
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  console.log('postSaga()...');

  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
  ]);
}
