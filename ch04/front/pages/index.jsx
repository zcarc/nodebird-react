import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN, LOG_OUT, loginAction, logoutAction } from '../reducers/user';

// const dummy = {
//     isLoggedIn: true,
//     imagePaths: [],
//     mainPosts: [{
//         User: {
//             id: 1,
//             nickname: '이현수',
//         },
//         content: '첫 번째 게시글',
//         img: 'https://img.jakpost.net/c/2019/12/08/2019_12_08_83319_1575794264._large.jpg',
//     }],
// };

const Home = () => {
    console.log('Index() component...');

    const dispatch = useDispatch();

    // useState()가 useSelector()로 바뀌었다고 생각하면 된다.
    // useSelector()의 state는 리덕스에서 자동적으로 root reducer에 등록된 state들을 전달해준다.

    // 만약 user.jsx에 등록된 state가 변경되면
    // 현재 index.jsx의 컴포넌트가 re-rendering 된다.
    const { user, isLoggedIn } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);


    // 성능 최적화를 위해 아래와 같이 쪼갤수도 있다.
    // const user = useSelector(state => state.user.user);
    // const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    // const mainPosts = useSelect(state => state.post.mainPosts);


    return (
        <div>
            {user ? <div>로그인 했습니다: { user.nickname }</div> : <div>로그아웃 했습니다.</div>}
            {isLoggedIn && <PostForm />}

                {mainPosts.map( (c) => {
                    return (
                      <PostCard key={c} post={c} />  
                    );
                })}
        </div>
    );
};

export default Home;