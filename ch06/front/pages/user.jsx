import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import PostCard from "../components/PostCard";
import {Avatar, Card} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {LOAD_USER_REQUEST} from "../reducers/user";
import {LOAD_USER_POSTS_REQUEST} from "../reducers/post";


const User = ({ id }) => {
    console.log('### front/pages/user.jsx... const User = ({ id })... { id }: ', id, ' ###');

    const dispatch = useDispatch();

    // post reducer
    const { mainPosts } = useSelector(state => state.post);
    console.log('### front/pages/user.jsx... const { mainPosts } = useSelector(state => state.post)... { mainPosts }: ', { mainPosts }, ' ###');

    const { userInfo } = useSelector(state => state.user);

    useEffect(() => {
        dispatch({
            type: LOAD_USER_REQUEST,
            data: id,
        });

        dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            data: id,
        });
    }, []);

    return (
        <div>
            { userInfo
                ? <Card
                    actions={[
                        <div key="twit">
                            짹짹
                            <br />
                            {userInfo.Posts}
                        </div>,
                        <div key="following">
                            팔로잉
                            <br />
                            {userInfo.Followings}
                        </div>,
                        <div key="follower">
                        팔로워
                        <br />
                        {userInfo.Followers}
                        </div>
                        ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
            </Card>
                : null
            }
            {mainPosts.map(c => (
                <PostCard key={+c.createdAt} post={c} />
            ))}
        </div>
    );


};

User.propTypes = {
  id: PropTypes.number.isRequired,
};

User.getInitialProps = async(context) => {
    console.log('### front/pages/user.jsx... User.getInitialProps = async(context)... context.query.id: ', context.query.id, ' ###');

    return { id: parseInt(context.query.id, 10)};
};

export default User;