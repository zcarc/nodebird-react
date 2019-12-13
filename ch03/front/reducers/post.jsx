export const initialState = {
    mainPosts: [],
};

const ADD_POST = 'ADD_POST';
const ADD_DUMMY = 'ADD_DUMMY';

const addPost = {
    type: ADD_POST,
};

const addDummy = {
    type: ADD_DUMMY,
    data: {
        content: 'Hello',
        UserId: 1,
        User: {
            nickname: '이현수',
        },
    },
};

const reducer = (state = initialState, action) => {

    console.log('post reducer()...');

    switch(action.type) {

        case ADD_POST: {
            return {
                ...state,
            };

        }
        case ADD_DUMMY: {
            return {
                ...state,
                mainPosts: [action.data, ...state.mainPosts],
            };
        }

        default: {
            return {
                ...state,
            };
        }
    }
}

export default reducer;

// action도 자주 쓰이니 export 해주는게 좋다.