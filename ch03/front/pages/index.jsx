import React from 'react';
import { Button, Card, Icon, Avatar } from 'antd';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

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

    return (
        <div>
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