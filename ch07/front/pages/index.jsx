import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';


const Home = () => {
    console.log('### front/pages/index... ###');

    const user = useSelector(state => state.user);
    console.log('### front/pages/index... useSelector(state => state.user): ', user, ' ###')


    // useState()가 useSelector()로 바뀌었다고 생각하면 된다.
    // useSelector()의 state는 리덕스에서 자동적으로 root reducer에 등록된 state들을 전달해준다.

    // 만약 user.jsx에 등록된 state가 변경되면
    // 현재 index.jsx의 컴포넌트가 re-rendering 된다.
    // useSelector()의 매개변수인 state는 전체 state를 의미한다.
    // 거기에서 reducers/index combineReducers()의 user를 가져온다는 의미이고
    const { me } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);

    console.log(`### pages/index.jsx mainPosts: ${JSON.stringify(mainPosts)} ###`);

    const dispatch = useDispatch();


    // 성능 최적화를 위해 아래와 같이 쪼갤수도 있다.
    // const user = useSelector(state => state.user.user);
    // const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    // const mainPosts = useSelect(state => state.post.mainPosts);
    return (
        <div>
            {me && <PostForm/>}

            {mainPosts.map((c) => {
                return (
                    <PostCard key={c} post={c}/>
                );
            })}
        </div>
    );
};

// front/pages/_app.js 에서 넣어주는 Component.getInitalProps(ctx); 의 "ctx"가 아래 함수의 매개변수로 전달된다.
Home.getInitialProps = async (context) => {

    // context key에 store는 redux의 것이다.
    // 이 안에는 dispatch, getState 등이 있다.
    // getState는 redux state 들을 가져올 수 있는 함수이다.
    // store.dispatch, store.getState를 사용하면
    // getInitialProps 함수 안에서 redux 작업을 할 수 있다.
    console.log('### front/pages/index... Home.getInitialProps()... Object.keys(context): ', Object.keys(context), ' ###');

    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST,
    });

};

export default Home;