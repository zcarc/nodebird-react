import React, { useEffect } from 'react';
import { Button, Card, Icon, Avatar } from 'antd';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN, LOG_OUT, loginAction, logoutAction } from '../reducers/user';

const dummy = {
    isLoggedIn: true,
    imagePaths: [],
    mainPosts: [{
        User: {
            id: 1,
            nickname: '이현수',
        },
        content: '첫 번째 게시글',
        img: 'https://img.jakpost.net/c/2019/12/08/2019_12_08_83319_1575794264._large.jpg',
    }],
};

const Home = () => {
    console.log('Index() component...');

    const dispatch = useDispatch();

    // useState()가 useSelector()로 바뀌었다고 생각하면 된다.
    const {isLoggedIn, user} = useSelector(state => state.user);
    console.log('useSelector(state => state.user):', useSelector(state => state.user));

    useEffect(() => {
        
        // dispatch()에 들어가는 객체가 action 인데
        // 이것은 dispatch()를 여러번 선언해서 action을 넣어줄 수 있다. 
        dispatch({
            type: LOG_IN,
            data: {
                nickname: '이현수',
            },
        });

        dispatch({
            type: LOG_OUT,
        });


        // user.jsx의 action 객체를 import해서 사용한다.
        dispatch(loginAction);

        // dispatch(logoutAction);


    }, []);

    return (
        <div>
            { user ? <div>로그인 했습니다: { user.nickname }</div> : <div>로그아웃 했습니다.</div>}
            {dummy.isLoggedIn && <PostForm />}

                {dummy.mainPosts.map( (c) => {
                    return (
                      <PostCard key={c} post={c} />  
                    );
                })}
        </div>
    );
};

export default Home;