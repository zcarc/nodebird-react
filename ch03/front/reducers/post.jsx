export const initialState = {

    mainPosts: [{
        User: {
            id: 1,
            nickname: '이현수',
        },
        content: '첫 번째 게시글',
        img: 'https://img.jakpost.net/c/2019/12/08/2019_12_08_83319_1575794264._large.jpg',
    }],

    imagePaths: [],
    
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