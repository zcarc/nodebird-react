import React from 'react';
import {Button} from "antd";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";

const FollowButton = ({ post, onUnfollow, onFollow}) => {
    const { me } = useSelector(state => state.user);
    return !me || post.User.id === me.id
        ? null
        // 남의 게시글의 작성자를 내가 팔로잉하고 있다면
        : me.Followings && me.Followings.find(v => v.id === post.User.id)
            ? <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
            : <Button onClick={onFollow(post.User.id)}>팔로우</Button>;
};

FollowButton.propTypes = {
    me: PropTypes.object,
    post: PropTypes.object.isRequired,
    onUnfollow: PropTypes.func.isRequired,
    onFollow: PropTypes.func.isRequired,
};

export default FollowButton;