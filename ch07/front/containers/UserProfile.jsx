import {Card, Avatar, Button} from 'antd';
import {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {LOG_OUT_REQUEST} from '../reducers/user';
import Link from 'next/link';


const UserProfile = () => {
    console.log('### front/components/UserProfile... ###');

    const {me} = useSelector(state => state.user);
    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch({
            type: LOG_OUT_REQUEST,
        })
    }, []);

    return (

        <Card
            actions={[
                // <div key="twit">짹짹<br />{me.Posts.length}</div>
                // <div key="following">팔로잉<br />{me.Followings.length}</div>
                // <div key="followers">팔로워<br />{me.Followers.length}</div>

                // key 값은 제일 상위에 있어야한다.
                <Link href="/profile" key="twit">
                    <a>
                        <div>짹짹<br/>{me.Posts.length}</div>
                    </a>
                </Link>,

                <Link href="/profile" key="following">
                    <a>
                        <div>팔로잉<br/>{me.Followings.length}</div>
                    </a>
                </Link>,

                <Link href="/profile" key="followers">
                    <a>
                        <div>팔로워<br/>{me.Followers.length}</div>
                    </a>
                </Link>,
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