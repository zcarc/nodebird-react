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

// 이 함수 표현식은 return이 있는데
// return을 생략해도 return이 동작하는 함수로 바꿀 수 있다.
// export const signUp = (data) => {
//     return {
//         type: SIGN_UP_REQUEST,
//         data,
//     }
// };


// return을 생략할 때는 함수 내부를 () 소괄호로 묶어준다.
export const signUp = data => ({
    type: SIGN_UP_REQUEST,
    data,
});


export default (state = initialState, action) => {

    console.log('user reducer()...');

    switch (action.type) {

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

    }
    ;
};


// 이렇게 사용할 수도 있다.
// export default reducer;