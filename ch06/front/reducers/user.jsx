export const initialState = {
    isLoggingOut: false, // 로그아웃 시도 중
    isLoggingIn: false, // 로그인 시도 중
    logInErrorReason: '', // 로그인 실패 사유
    isSignedUp: false, // 회원가입 성공
    isSigningUp: false, // 회원가입 시도 중
    signUpErrorReason: '', // 회원가입 실패 사유
    me: null, // 내 정보
    followingList: [], // 팔로잉 리스트
    followerList: [], // 팔로워 리스트
    userInfo: null, // 남의 정보
    isEditingNickname: false, // 닉네임 변경 중
    editNicknameErrorReason: '', // 이름 변경 실패 사유

};

// 액션의 이름들

// 회원가입 액션
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

// 로그인 액션
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

// 사용자 정보 불러오는 액션
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

// 로그아웃 액션
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

// 팔로잉, 팔로워 목록들 불러오는 액션
export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

// 다른사람 팔로잉하는 액션
export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

// 다른사람 팔로잉 취소하는 액션
export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_REQUEST';

// 나를 팔로잉 하는 사람 삭제하는 액션
export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

// 닉네임 수정
export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST';
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';


// return을 생략할 때는 함수 내부를 () 소괄호로 묶어준다.
// export const signUpRequestAction = data => ({
//     type: SIGN_UP_REQUEST,
//     data,
// });


export default (state = initialState, action) => {
    console.log(`### front/reducers/user.jsx : action: ${JSON.stringify(action)} ###`);

    switch (action.type) {

        case LOG_IN_REQUEST: {
            return {
                ...state,
                isLoggingIn: true,
                logInErrorReason: '',
            };
        }

        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: true,
                me: action.data,
                isLoading: false,
            }
        }

        case LOG_IN_FAILURE: {
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: false,
                logInErrorReason: action.error,
                me: null,
            };
        }

        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggingOut: true,
                me: null,

            };
        }

        case LOG_OUT_SUCCESS: {
            return {
                ...state,
                isLoggingOut: false,
                me: null,
            };
        }

        case SIGN_UP_REQUEST: {
            return {
                ...state,
                isSigningUp: true,
                isSignedUp: false,
                signUpErrorReason: '',
            };
        }

        case SIGN_UP_SUCCESS: {
            return {
                ...state,
                isSigningUp: false,
                isSignedUp: true,
            };
        }

        case SIGN_UP_FAILURE: {
            return {
                ...state,
                isSigningUp: false,
                signUpErrorReason: action.error,
            };
        }

        case LOAD_USER_REQUEST: {
            return {
                ...state,
            };
        }

        case LOAD_USER_SUCCESS: {

            // 내 정보가 있다면 내 정보를 출력
            if(action.me) {
                return {
                    ...state,
                    me: action.data,
                };
            }

            // 다른사람 정보라면 다른사람 정보 출력
            return {
                ...state,
                userInfo: action.data,
            };
        }

        case LOAD_USER_FAILURE: {
            return {
                ...state,
            };
        }

        case FOLLOW_USER_REQUEST: {
            return {
                ...state,
            };
        }

        case FOLLOW_USER_SUCCESS: {

            return {
                ...state,
                me: {
                    ...state.me,
                    // 내가 어떤 사람을 팔로우 했다면, 팔로잉 목록에 내가 팔로잉한 사람 추가
                    Followings: [{ id: action.data }, ...state.me.Followings],
                }
            };
        }

        case FOLLOW_USER_FAILURE: {
            return {
                ...state,
            };
        }

        case UNFOLLOW_USER_REQUEST: {
            return {
                ...state,
            };
        }

        case UNFOLLOW_USER_SUCCESS: {

            return {
                ...state,
                me: {
                    ...state.me,
                    // 내가 어떤 사람을 언팔로우 했다면, 팔로잉 목록에 내가 팔로잉한 사람 삭제
                    Followings: state.me.Followings.filter(v =>  v.id !== action.data), // 팔로잉 목록에 내가 팔로잉한 사람 추가
                },
                followingList: state.followingList.filter(v =>  v.id !== action.data),
            };
        }

        case UNFOLLOW_USER_FAILURE: {
            return {
                ...state,
            };
        }

        // sagas/post 에서 아래 리듀서를 호출
        case ADD_POST_TO_ME: {
            return {
                ...state,
                me: {
                    ...state.me,
                    Posts: [{ id: action.data }, ...state.me.Posts], // 기존 게시글들에 새로 작성한 게시글을 추가
                },
            }
        }

        case LOAD_FOLLOWERS_REQUEST: {
            return {
                ...state,
            };
        }

        case LOAD_FOLLOWERS_SUCCESS: {

            return {
                ...state,
                followerList: action.data,
            };
        }

        case LOAD_FOLLOWERS_FAILURE: {
            return {
                ...state,
            };
        }

        case LOAD_FOLLOWINGS_REQUEST: {
            return {
                ...state,
            };
        }

        case LOAD_FOLLOWINGS_SUCCESS: {

            return {
                ...state,
                followingList: action.data,
            };
        }

        case LOAD_FOLLOWINGS_FAILURE: {
            return {
                ...state,
            };
        }

        case REMOVE_FOLLOWER_REQUEST: {
            return {
                ...state,
            };
        }

        case REMOVE_FOLLOWER_SUCCESS: {

            return {
                ...state,
                me: {
                    ...state.me,
                    Followers: state.me.Followers.filter(v => v.id !== action.data),
                },
                //followingList: state.me.followingList.filter(v => v.id !== action.data),
                followerList: state.followerList.filter(v => v.id !== action.data),
            };
        }

        case REMOVE_FOLLOWER_FAILURE: {
            return {
                ...state,
            };
        }

        case EDIT_NICKNAME_REQUEST: {
            return {
                ...state,
                isEditingNickname: true,
                editNicknameErrorReason: '',
            };
        }

        case EDIT_NICKNAME_SUCCESS: {

            return {
                ...state,
                isEditingNickname: false,
                me: {
                    ...state.me,
                    nickname: action.data,
                },
            };
        }

        case EDIT_NICKNAME_FAILURE: {
            return {
                ...state,
                isEditingNickname: false,
                editNicknameErrorReason: action.error,
            };
        }

        default: {
            return {
                ...state,
            };
        }

    }

};


// 이렇게 사용할 수도 있다.
// export default reducer;