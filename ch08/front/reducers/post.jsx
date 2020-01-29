import produce from 'immer';

export const initialState = {

    mainPosts: [], // 화면에 보일 포스트들

    imagePaths: [], // 미리보기 이미지 경로
    addPostErrorReason: '', // 포스트 업로드 실패 사유
    isAddingPost: false, // 포스트 업로드 중
    postAdded: false, // 게시글 작성 성공

    isAddingComment: false,
    addCommentErrorReason: '',
    commentAdded: false,
    singlePost: null,
};


// 메인 포스트 로딩 액션
export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

// 해쉬태그 검색 시 결과 로딩 액션
export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

// 사용자가 어떤 게시글을 썼는지 로딩하는 액션
export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

// 이미지 업로드 액션
export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

// 이미지 업로드 취소 액션
// 비동기가 필요하지 않아서 동기 액션 사용
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

// 게시글 작성 액션
export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

// 포스트 좋아요 액션
export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

// 포스트 좋아요 취소 액션
export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

// 게시글 댓글 작성 액션
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

// 게시글 댓글 불러오는 액션
export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

// 리트윗 액션
export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

// 게시글 삭제 액션
export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

// 개별 게시글 불러오는 액션
export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';



const reducer = (state = initialState, action) => {
    console.log(`### front/reducers/post... reducer()... action: ${JSON.stringify(action)} ###`);

    // immer 사용
    return produce(state, (draft) => {

        // -draft
        // immmer에서 draft가 바뀐 부분을 체크해서
        // state에 불변성 적용해서 변경해준다.
        // draft를 state라고 생각하고 변경해주면 된다.
        // draft를 사용하면 장점이 불변성을 지키면서 코드를 작성하지 않아도
        // 알아서 불변성을 지킬 수 있게 변환해준다.

        switch(action.type) {

            case UPLOAD_IMAGES_REQUEST: {
                break;
            }

            // case UPLOAD_IMAGES_REQUEST: {
            //
            //     return {
            //         ...state
            //     };
            // }

            case UPLOAD_IMAGES_SUCCESS: {

                // 대입을 하면 불변성이 깨지는데 immer를 사용하면 알아서 유지해준다.
                // draft는 state라고 생각하면 된다.

                action.data.forEach((p) => {
                    draft.imagePaths.push(p);
                });
                break;

            }

            // case UPLOAD_IMAGES_SUCCESS: {

                // imagePaths: 이미지 미리보기 할 수 있는 경로 + 새로운 action.data 를 합쳐준다.
                // 처음에 하나만 올렸다가 몇 개 더 올리게 돼도 기존 이미지들돠 합쳐주기 때문에
                // 여러개의 이미지를 따로따로 올릴 수 있게 된다.
                // return {
                //     ...state,
                //     imagePaths: [...state.imagePaths, ...action.data],
                // };
            // }

            case UPLOAD_IMAGES_FAILURE: {
                break;
            }

            // case UPLOAD_IMAGES_FAILURE: {
            //     return {
            //         ...state,
            //     };
            // }

            case REMOVE_IMAGE: {
                const index = draft.imagePaths.findIndex((v, i) => i === action.index);
                draft.imagePaths.splice(index, 1);
                break;
            }

            // case REMOVE_IMAGE: {
            //     return {
            //         ...state,
            //         imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
            //     }
            // }

            case ADD_POST_REQUEST: {
                draft.isAddingPost = true;
                draft.addingPostErrorReason = '';
                draft.postAdded = false;
                break;
            }

            // case ADD_POST_REQUEST: {
            //
            //     return {
            //         ...state,
            //         isAddingPost: true,
            //         addPostErrorReason: '',
            //         postAdded: false,
            //     };
            // }

            case ADD_POST_SUCCESS: {
                draft.isAddingPost = false;
                draft.mainPosts.unshift(action.data);
                draft.postAdded = true;
                draft.imagePaths = [];
                break;
            }

            // case ADD_POST_SUCCESS: {
            //
            //     return {
            //         ...state,
            //         isAddingPost: false,
            //         mainPosts: [action.data, ...state.mainPosts], // 게시글 작성이 성공하면 기존 게시글 앞에 더미 포스트가 추가된다.
            //         postAdded: true,
            //         imagePaths: [], // 게시글 작성이 성공되는 순간, 이미지 미리보기 지우기
            //     };
            // }

            case ADD_POST_FAILURE: {

                return {
                    ...state,
                    isAddingPost: false,
                    addPostErrorReason: action.error,
                };
            }

            case ADD_COMMENT_REQUEST: {

                return {
                    ...state,
                    isAddingComment: true,
                    addCommentErrorReason: '',
                    commentAdded: false,
                };
            }

            case ADD_COMMENT_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Comments.push(action.data.comment);
                draft.isAddingComment = false;
                draft.commentAdded = true;
                break;
            }

            // case ADD_COMMENT_SUCCESS: {
            //     const postIndex = state.mainPosts.findIndex( v => v.id === action.data.postId);
            //     const post = state.mainPosts[postIndex];
            //     const Comments = [...post.Comments, action.data.comment];
            //     const mainPosts = [...state.mainPosts];
            //     mainPosts[postIndex] = { ...post, Comments };
            //
            //     console.log('mainPosts[postIndex]: ', mainPosts[postIndex]);
            //
            //     return {
            //         ...state,
            //         isAddingComment: false,
            //         mainPosts,
            //         commentAdded: true,
            //     };
            // }

            case ADD_COMMENT_FAILURE: {

                return {
                    ...state,
                    isAddingComment: false,
                    addCommentErrorReason: action.error,
                };
            }

            case LOAD_MAIN_POSTS_REQUEST:
            case LOAD_HASHTAG_POSTS_REQUEST:
            case LOAD_USER_POSTS_REQUEST: {
                draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
                draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
                break;
            }

            // case LOAD_MAIN_POSTS_REQUEST:
            // case LOAD_HASHTAG_POSTS_REQUEST:
            // case LOAD_USER_POSTS_REQUEST: {
            //
            //     // mainPosts
            //     // 다른 페이지에서 다시 해당 페이지로 온다면
            //     // 기존 데이터를 삭제하고 새로 로딩해줘야한다.
            //     // lastId가 0이면 새로 불러오고 아니면 그대로 유지
            //
            //     // hasMorePost
            //     // action.lastId가 처음이면('0' 이면) 스크롤을 활성화
            //     // 불러오고 있는 중이라면 스크롤을 유지
            //     return {
            //         ...state,
            //         mainPosts: action.lastId === 0 ? [] : state.mainPosts,
            //         hasMorePost: action.lastId ? state.hasMorePost : true,
            //     };
            // }

            case LOAD_COMMENTS_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Comments = action.data.comment;
                break;
            }

            // case LOAD_COMMENTS_SUCCESS: {
            //     const postIndex = state.mainPosts.findIndex( v => v.id === action.data.postId);
            //     const post = state.mainPosts[postIndex];
            //
            //     const Comments = action.data.comments; // 이 부분을 배열로 만들어서 에러가 있었다.
            //     const mainPosts = [...state.mainPosts];
            //
            //     console.log(`### front/reducers/post.jsx... LOAD_COMMENTS_SUCCESS... mainPosts: ${JSON.stringify(mainPosts)}  ###`);
            //     console.log(`### front/reducers/post.jsx... LOAD_COMMENTS_SUCCESS... action.data: ${JSON.stringify(action.data)}  ###`);
            //
            //     mainPosts[postIndex] = { ...post, Comments };
            //
            //     return {
            //         ...state,
            //         mainPosts,
            //     };
            // }

            case LOAD_MAIN_POSTS_SUCCESS:
            case LOAD_HASHTAG_POSTS_SUCCESS:
            case LOAD_USER_POSTS_SUCCESS: {

                return {
                    ...state,
                    mainPosts: state.mainPosts.concat(action.data),
                    hasMorePost: action.data.length === 10,
                };
            }

            case LOAD_MAIN_POSTS_FAILURE:
            case LOAD_HASHTAG_POSTS_FAILURE:
            case LOAD_USER_POSTS_FAILURE: {

                return {
                    ...state,
                };
            }

            case LIKE_POST_REQUEST: {

                return {
                    ...state,
                };
            }

            case LIKE_POST_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
                break;
            }

            // case LIKE_POST_SUCCESS: {
            //
            //     // 바뀔 객체만 새로 만들어준다.
            //     const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
            //     // 내가 좋아요한 게시글이 몇번째에 있는지 확인
            //     const post = state.mainPosts[postIndex];
            //     // 좋아요 누른 사람 목록에 내 이름을 추가
            //     console.log(`### front/reducers/post... LIKE_POST_SUCCESS... before Likers: ${JSON.stringify(Likers)} ###`);
            //     const Likers = [{ id: action.data.userId }, ...post.Likers];
            //     console.log(`### front/reducers/post... LIKE_POST_SUCCESS... after Likers: ${JSON.stringify(Likers)} ###`);
            //
            //     const mainPosts = [...state.mainPosts];
            //     // 불변성 지키면서 다시 복원
            //     mainPosts[postIndex] = {...post, Likers};
            //
            //     return {
            //         ...state,
            //         mainPosts,
            //     };
            // }

            case LIKE_POST_FAILURE: {

                return {
                    ...state,
                };
            }

            case UNLIKE_POST_REQUEST: {

                return {
                    ...state,
                };
            }

            case UNLIKE_POST_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(v => v.id === action.data.userId);
                draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
                break;
            }

            // case UNLIKE_POST_SUCCESS: {
            //
            //     // 바뀔 객체만 새로 만들어준다.
            //     const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
            //     // 내가 좋아요한 게시글이 몇번째에 있는지 확인
            //     const post = state.mainPosts[postIndex];
            //     // 좋아요 누른 사람 목록에 내 이름을 제외
            //     console.log(`### front/reducers/post... UNLIKE_POST_SUCCESS... before Likers: ${JSON.stringify(Likers)} ###`);
            //     const Likers = post.Likers.filter(v => v.id !== action.data.userId);
            //     console.log(`### front/reducers/post... UNLIKE_POST_SUCCESS... after Likers: ${JSON.stringify(Likers)} ###`);
            //
            //     const mainPosts = [...state.mainPosts];
            //     // 불변성 지키면서 다시 복원
            //     mainPosts[postIndex] = {...post, Likers};
            //
            //     return {
            //         ...state,
            //         mainPosts,
            //     };
            // }

            case UNLIKE_POST_FAILURE: {

                return {
                    ...state,
                };
            }

            case RETWEET_REQUEST: {

                return {
                    ...state,
                };
            }

            case RETWEET_SUCCESS: {
                // RetweetWithPrevPost로 게시글 가져온게 action.data에 들어있다.
                // 그 부분을 기존 게시글 제일 앞에 붙여주면 된다.
                return {
                    ...state,
                    mainPosts: [action.data, ...state.mainPosts],
                };
            }

            case RETWEET_FAILURE: {

                return {
                    ...state,
                };
            }

            case REMOVE_POST_REQUEST: {

                return {
                    ...state,
                };
            }

            case REMOVE_POST_SUCCESS: {
                // RetweetWithPrevPost로 게시글 가져온게 action.data에 들어있다.
                // 그 부분을 기존 게시글 제일 앞에 붙여주면 된다.
                return {
                    ...state,
                    mainPosts: state.mainPosts.filter(v => v.id !== action.data),
                };
            }

            case REMOVE_POST_FAILURE: {

                return {
                    ...state,
                };
            }

            case LOAD_POST_SUCCESS: {
                draft.singlePost = action.data;
                break;
            }

            default: {
                return {
                    ...state,
                };
            }
        }

    });


};

export default reducer;

// action도 자주 쓰이니 export 해주는게 좋다.