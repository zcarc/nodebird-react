import React, {useCallback} from 'react';
import {Form, Input, Button, List, Card, Icon} from 'antd';
import NicknameEditForm from '../containers/NicknameEditForm';
import {useDispatch, useSelector} from "react-redux";
import {
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWINGS_REQUEST,
    REMOVE_FOLLOWER_REQUEST,
    UNFOLLOW_USER_REQUEST
} from "../reducers/user";
import {LOAD_USER_POSTS_REQUEST} from "../reducers/post";
import PostCard from "../containers/PostCard";
import FollowList from '../components/FollowList';

const Profile = () => {
    console.log('### front/pages/Profile... ###');

    const dispatch = useDispatch();
    const {followingList, followerList, hasMoreFollower, hasMoreFollowing} = useSelector(state => state.user);
    const {mainPosts} = useSelector(state => state.post);


    // useEffect(() => {
    //     // 내가 로그인 했을 경우
    //     if(me){
    //         // 팔로워 목록
    //         dispatch({
    //             type: LOAD_FOLLOWERS_REQUEST,
    //             data: me.id,
    //         });
    //
    //         // 팔로잉 목록
    //         dispatch({
    //             type: LOAD_FOLLOWINGS_REQUEST,
    //             data: me.id,
    //         });
    //
    //         // 내가 쓴 게시글
    //         dispatch({
    //             type: LOAD_USER_POSTS_REQUEST,
    //             data: me.id,
    //         });
    //     }
    // }, [me && me.id]);

    const onUnfollow = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    const onRemoveFollower = useCallback(userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: userId,
        });
    }, []);

    const loadMoreFollowings = useCallback(() => {
       dispatch({
         type: LOAD_FOLLOWINGS_REQUEST,
           offset: followingList.length, // offset은 현재 3으로 지정되어 있어서 이렇게 설정한다.
       });
    }, [followingList.length]);

    const loadMoreFollowers = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            offset: followerList.length,
        });
    }, [followerList.length]);

    return (
        <div>
            <NicknameEditForm/>
            <FollowList
                header="팔로잉 목록"
                hasMore={hasMoreFollowing}
                onClickMore={loadMoreFollowings}
                data={followingList}
                onClickStop={onUnfollow}
            />
            <FollowList
                header="팔로워 목록"
                hasMore={hasMoreFollower}
                onClickMore={loadMoreFollowers}
                data={followerList}
                onClickStop={onRemoveFollower}
            />
            <div>
                {mainPosts.map(c => (
                    <PostCard key={+c.createdAt} post={c} />
                ))}
            </div>

        </div>
    );
};

Profile.getInitialProps = async (context) => {

    const state = context.store.getState();

    // _app.js에서 LOAD_USERS_REQUEST 요청을 먼저한다.
    // state.user.me는 LOAD_USERS_SUCCESS 가 되고나서 생성된다.

    // 팔로워 목록
    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
    });

    // 팔로잉 목록
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    });

    // 내가 쓴 게시글
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    });

    // LOAD_USERS_SUCCESS는 이쯤에서 실행된다.

    // 데이터가 null이면 본인이라고 간주를 한다.
    // 사가의 user, post의 action API 부분들의 매개변수의 기본값을 0으로 설정하면 본인이라고 간주한다.
};

export default Profile;