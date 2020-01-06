export const initialState = {

    mainPosts: [], // 화면에 보일 포스트들

    imagePaths: [], // 미리보기 이미지 경로
    addPostErrorReason: '', // 포스트 업로드 실패 사유
    isAddingPost: false, // 포스트 업로드 중
    postAdded: false, // 게시글 작성 성공

    isAddingComment: false,
    addCommentErrorReason: '',
    commentAdded: false,
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



const reducer = (state = initialState, action) => {

    console.log(`### post reducer()... action: ${JSON.stringify(action)} ###`);

    switch(action.type) {

        case UPLOAD_IMAGES_REQUEST: {

            return {
                ...state,
            };
        }

        case UPLOAD_IMAGES_SUCCESS: {

            // imagePaths: 이미지 미리보기 할 수 있는 경로 + 새로운 action.data 를 합쳐준다.
            // 처음에 하나만 올렸다가 몇 개 더 올리게 돼도 기존 이미지들돠 합쳐주기 때문에
            // 여러개의 이미지를 따로따로 올릴 수 있게 된다.
            return {
                ...state,
                imagePaths: [...state.imagePaths, ...action.data],
            };
        }

        case UPLOAD_IMAGES_FAILURE: {

            return {
                ...state,
            };
        }

        case ADD_POST_REQUEST: {

            return {
                ...state,
                isAddingPost: true,
                addPostErrorReason: '',
                postAdded: false,
            };
        }

        case ADD_POST_SUCCESS: {

            return {
                ...state,
                isAddingPost: false,
                mainPosts: [action.data, ...state.mainPosts], // 게시글 작성이 성공하면 기존 게시글 앞에 더미 포스트가 추가된다.
                postAdded: true,
            };
        }

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
            const postIndex = state.mainPosts.findIndex( v => v.id === action.data.postId);
            const post = state.mainPosts[postIndex];
            const Comments = [...post.Comments, action.data.comment];
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = { ...post, Comments };

            console.log('mainPosts[postIndex]: ', mainPosts[postIndex]);

            return {
                ...state,
                isAddingComment: false,
                mainPosts,
                commentAdded: true,
            };
        }

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

            return {
                ...state,
                mainPosts: [],
            };
        }

        case LOAD_COMMENTS_SUCCESS: {
            const postIndex = state.mainPosts.findIndex( v => v.id === action.data.postId);
            const post = state.mainPosts[postIndex];
            const Comments = action.data.comments; // 이 부분을 배열로 만들어서 에러가 있었다.
            const mainPosts = [...state.mainPosts];

            console.log(`### front/reducers/post.jsx... LOAD_COMMENTS_SUCCESS... mainPosts: ${JSON.stringify(mainPosts)}  ###`);
            console.log(`### front/reducers/post.jsx... LOAD_COMMENTS_SUCCESS... action.data: ${JSON.stringify(action.data)}  ###`);

            mainPosts[postIndex] = { ...post, Comments };

            return {
                ...state,
                mainPosts,
            };
        }

        case LOAD_MAIN_POSTS_SUCCESS:
        case LOAD_HASHTAG_POSTS_SUCCESS:
        case LOAD_USER_POSTS_SUCCESS: {

            return {
                ...state,
                mainPosts: action.data,
            };
        }

        case LOAD_MAIN_POSTS_FAILURE:
        case LOAD_HASHTAG_POSTS_FAILURE:
        case LOAD_USER_POSTS_FAILURE: {

            return {
                ...state,
            };
        }

        default: {
            return {
                ...state,
            };
        }
    }
};

export default reducer;

// action도 자주 쓰이니 export 해주는게 좋다.