import {all, fork, takeLatest, put, delay, call} from 'redux-saga/effects';
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_COMMENTS_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  LOAD_COMMENTS_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_SUCCESS,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  RETWEET_REQUEST,
  REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE, REMOVE_POST_REQUEST
} from '../reducers/post';
import axios from 'axios';
import {ADD_POST_TO_ME, REMOVE_POST_OF_ME} from "../reducers/user";


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
    yield put({ // post reducer의 데이터를 수정
      type: ADD_POST_SUCCESS,
      data: result.data,
    });

    yield put({ // user reducer의 데이터를 수정
      type: ADD_POST_TO_ME,
      data: result.data.id,
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

function loadHashtagPostsAPI(tag) {

  // 로그인하지 않은 사용자로 메인 페이지 게시글을 볼 수 있으니
  // withCredentials 설정을 하지 않아도 된다.
  return axios.get(`/hashtag/${encodeURIComponent(tag)}`);
}

function* loadHashtagPosts(action) {

  try {

    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });

  } catch (e) {
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function loadUserPostsAPI(id = 0) {

  // 로그인하지 않은 사용자도 메인 페이지 게시글을 볼 수 있으니
  // withCredentials 설정을 하지 않아도 된다.
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {

  try {

    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });

  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content },{
        withCredentials: true, // 로그인한 사용자만 작성
      });
}

// 사가 post.jsx의 addComment(action) 이 부분의 action은
// PostCard.jsx의 ADD_COMMENT_REQUEST를 dispatch하는 메서드의 action을 아래 함수의 매개변수가 넘겨받는다.
function* addComment(action) {

  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

// 사가 post.jsx의 loadComments(action) 이 부분의 action은
// PostCard.jsx의 ADD_COMMENT_REQUEST를 dispatch하는 메서드의 action을 아래 함수의 매개변수가 넘겨받는다.
function* loadComments(action) {

  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data,
      },
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

function uploadImagesAPI(formData) {
  console.log('### front/sagas/post uploadImagesAPI... formData: ', formData ,' ###');

  return axios.post('/post/images', formData, {
    withCredentials: true,
  });
}

// 사가 post.jsx의 uploadImages(action) 이 부분의 action은
// PostCard.jsx의 ADD_COMMENT_REQUEST를 dispatch하는 메서드의 action을 아래 함수의 매개변수가 넘겨받는다.
function* uploadImages(action) {
  console.log('### front/sagas/post *uploadImages... action: ', action ,' ###');

  try {
    // 이미지 업로드가 완료되면 서버는
    // 이미지가 어디에 저장되어 있는지 주소를 보내준다.
    // 그래서 이미지 미리보기도 하고
    // 게시글 작성버튼을 누를 때 그 이미지 주소를 게시글과 같이 업로드 한다.
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data, // 서버쪽에 저장된 이미지 주소를 받는다.
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  console.log('### front/sagas/post *watchUploadImages... ###');
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function likePostAPI(postId) {
  console.log('### front/sagas/post likePostAPI... postId: ', postId ,' ###');

  return axios.post(`/post/${postId}/like`, {}, {
    withCredentials: true,
  });
}

function* likePost(action) {
  console.log('### front/sagas/post *likePost... action: ', action ,' ###');

  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
       postId: action.data,
       userId: result.data.userId, // 서버에서 좋아요 누른 사람 아이디를 보내줌
      },
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLikePost() {
  console.log('### front/sagas/post *watchLikePost... ###');
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unLikePostAPI(postId) {
  console.log('### front/sagas/post unLikePostAPI... postId: ', postId ,' ###');

  return axios.delete(`/post/${postId}/like`, {
    withCredentials: true,
  });
}

function* unLikePost(action) {
  console.log('### front/sagas/post *unLikePost... action: ', action ,' ###');

  try {
    const result = yield call(unLikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId, // 서버에서 좋아요 누른 사람 아이디를 보내줌
      },
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikePost() {
  console.log('### front/sagas/post *watchUnlikePost... ###');
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}

function retweetAPI(postId) {
  console.log('### front/sagas/post retweetAPI... postId: ', postId ,' ###');

  // 데이터가 없어도 두번째 인자에 빈 객체를 보내줘야한다.
  return axios.post(`/post/${postId}/retweet`, {}, {
    withCredentials: true,
  });
}

function* retweet(action) {
  console.log('### front/sagas/post *retweet... action: ', action ,' ###');

  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data, // 리트윗한 게시글의 데이터가 들어있음.
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: RETWEET_FAILURE,
      error: e,
    });
    alert(e.response && e.response.data);
  }
}

function* watchRetweet() {
  console.log('### front/sagas/post *watchRetweet... ###');
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function removePostAPI(postId) {
  console.log('### front/sagas/post removePostAPI... postId: ', postId ,' ###');

  return axios.delete(`/post/${postId}`,  {
    withCredentials: true,
  });
}

function* removePost(action) {
  console.log('### front/sagas/post *removePost... action: ', action ,' ###');

  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });

    // 게시글 삭제 시, 짹짹 삭제 (user reducer)
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });

  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchRemovePost() {
  console.log('### front/sagas/post *watchRemovePost... ###');
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

export default function* postSaga() {
  console.log('### front/sagas/post... ###');

  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchRetweet),
    fork(watchRemovePost),
  ]);
}
