import { Card, Avatar, Button } from 'antd';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';


const UserProfile = () => {
    console.log('UserProfile component...');

    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch({
            type: LOG_OUT_REQUEST,
        })
    }, []);

    return (

        <Card
            actions={[

                <div key="twit">짹짹<br />{me.Posts.length}</div>,

                <div key="following">팔로잉<br />{me.Followings.length}</div>,
                <div key="followers">팔로워<br />{me.Followers.length}</div>,
            ]}
        >

            <Card.Meta 
                avatar={<Avatar>{me.nickname[0]}</Avatar>}
                title={me.nickname}
            />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;