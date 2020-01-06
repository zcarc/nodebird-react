import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';


const Home = () => {
    console.log('Index() component...');


    // useState()가 useSelector()로 바뀌었다고 생각하면 된다.
    // useSelector()의 state는 리덕스에서 자동적으로 root reducer에 등록된 state들을 전달해준다.

    // 만약 user.jsx에 등록된 state가 변경되면
    // 현재 index.jsx의 컴포넌트가 re-rendering 된다.
    const { me } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);

    console.log(`### pages/index.jsx mainPosts: ${JSON.stringify(mainPosts)} ###`);

    const dispatch = useDispatch();


    useEffect( () => {

        dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
        });

    }, []);


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

export default Home;