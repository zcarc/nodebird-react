
const dummyUser = {
    nickname: '이현수',
    Post: [],
    Followings: [],
    Followers: [],
};

export const initialState = {
    isLoggedIn: false,
    user: null,
    signUpData: {},
};

// 액션의 이름들
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const INCREMENT_NUMBER; // 동기 요청

export const signUpAction = (data) => {
    return {
        type: SIGN_UP_REQUEST,
        data: data,
    };
    
};

export const signUpSuccess = {
    type: SIGN_UP_SUCCESS,
};

export const loginAction = {
    type: LOG_IN_REQUEST,
};

export const logoutAction = {
    type: LOG_OUT_REQUEST,
};

export const signUp = (data) => {
    return {
        type: SIGN_UP_REQUEST,
        data,
    }
};


export default (state = initialState, action) => {

    console.log('user reducer()...');

    switch(action.type) {

        case LOG_IN_REQUEST: {
            return {
                ...state,
                loginData: action.data,
                isLoading: true,
            };
        }

        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoggedIn: true,
                user: dummyUser,
                isLoading: false,
            }
        }

        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,

            };
        }

        case SIGN_UP_REQUEST: {
            return {
                ...state,
                signUpData: action.data,
            };
        }

        default: {
            return {
                ...state,
            };
        }

    };
};



// 이렇게 사용할 수도 있다.
// export default reducer;