export const initialState = {
    isLoggedIn: false,
    user: {},
};

export const LOG_IN = 'LOG_IN'; // 액션의 이름
export const LOG_OUT = 'LOG_OUT';

export const loginAction = {
    type: LOG_IN,
    data: {
        nickname: 'hsLee',
    },
};

export const logoutAction = {
    type: LOG_OUT,
};


const reducer = (state = initialState, action) => {

    console.log('user reducer()...');
    console.log('user state: ', state);

    switch(action.type) {

        case LOG_IN: {
            return {
                ...state,
                isLoggedIn: true,
                user: action.data,
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