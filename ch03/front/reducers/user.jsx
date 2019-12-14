
const dummyUser = {
    nickname: '이현수',
    Post: [],
    Followings: [],
    Followers: [],
};

export const initialState = {
    isLoggedIn: false,
    user: null,
};

export const LOG_IN = 'LOG_IN'; // 액션의 이름
export const LOG_OUT = 'LOG_OUT';

export const loginAction = {
    type: LOG_IN,
};

export const logoutAction = {
    type: LOG_OUT,
};


const reducer = (state = initialState, action) => {

    console.log('user reducer()...');

    switch(action.type) {

        case LOG_IN: {
            return {
                ...state,
                isLoggedIn: true,
                user: dummyUser,
                temp: 'temmmmmp',
            };
        }

        case LOG_OUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        }

        default: {
            return {
                ...state,
            };
        }

    };
};

export default reducer;

// 이렇게 사용할 수도 있다.
// export default = (state = initialState, action) => {};