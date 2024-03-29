import {all, fork, takeLatest, put, delay, call} from 'redux-saga/effects';
import {
  ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_REQUEST, LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE
} from '../reducers/post';
import axios from 'axios';


function addPostAPI(postData) { // postData에는 게시글들이 들어있다.
  console.log(`addPostAPI: ${postData}`);


  // 여기서 /post로 불러와지는 이유는 axios 모듈로 불러오는 모듈을 공유해서 캐싱을 하기 때문에 
  // index에 정의한 axios.defaults.baseURL 이 부분이 기본적으로 설정되어 있다. (index가 아닌 user에 정의해도 똑같이 캐싱된다.)

  return axios.post('/post', postData, { // 로그인한 사람만 게시글  쓸 수 있게 쿠키 인증을 받아야한다.
    withCredentials: true,
  });
}

function* addPost(action) {
  console.log(`addPost... action: ${action}`);
  

  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
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


function loadMainPostsAPI() {

  // 로그인하지 않은 사용자로 메인 페이지 게시글을 볼 수 있으니
  // withCredentials 설정을 하지 않아도 된다.
  return axios.get('/posts');
}

function* loadMainPosts() {

  try {

    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });

  } catch (e) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
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
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
  ]);
}
