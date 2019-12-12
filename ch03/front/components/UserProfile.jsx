
import { Card, Avatar } from 'antd';

const dummy = {
    nickname: '이현수',
    Post: [],
    Followings: [],
    Followers: [],
    isLoggedIn: false,
};

const UserProfile = () => {

    console.log('UserProfile component...');

    return (

        <Card actions={[
            <div key="twit">짹짹<br />{dummy.Post.length}</div>,
            <div key="following">팔로잉<br />{dummy.Followings.length}</div>,
            <div key="follower">팔로워<br />{dummy.Followers.length}</div>,
        ]}>

            <Card.Meta avatar={<Avatar>{dummy.nickname[0]}</Avatar>}
                title={dummy.nickname}
            />
        </Card>
    );
};

export default UserProfile;