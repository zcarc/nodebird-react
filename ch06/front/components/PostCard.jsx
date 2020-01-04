import {useState, useCallback, useEffect} from 'react';
import {Button, Card, Icon, Avatar, Form, Input, List, Comment} from 'antd';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from "react-redux";
import {ADD_COMMENT_REQUEST} from "../reducers/post";
import Link from 'next/link';

const PostCard = ({post}) => {
    console.log('PostCard component...');
    console.log('post: ', post);

    const [commentFormOpended, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const {me} = useSelector(state => state.user);
    const {commentAdded, isAddingComment} = useSelector(state => state.post);
    const dispatch = useDispatch();

    const onToggleComment = useCallback(() => {
        setCommentFormOpened(prev => !prev);
    }, []);

    const onSubmitComment = useCallback((e) => {
        e.preventDefault();

        if (!me) {
            return alert('로그인이 필요합니다.');
        }

        return dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {
                postId: post.id,
            },
        });
    }, [me && me.id]); // 객체를 넣지 말고 객체의 값을 넣어줘야한다.

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true]);

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);


    return (
        <div>
            <Card
                key={+post.createdAt}
                cover={post.img && <img alt="example" src={post.img}/>}
                actions={[
                    <Icon type="retweet" key="retweet"/>,
                    <Icon type="heart" key="heart"/>,
                    <Icon type="message" key="message" onClick={onToggleComment}/>,
                    <Icon type="ellipsis" key="ellipsis"/>,
                ]}
                extra={<Button>팔로우</Button>}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={(
                        <div>
                            {post.content.split(/(#[^\s]+)/g).map((v) => {
                                if (v.match(/#[^\s]+/)) {
                                    return (
                                        <Link href={`/hashtag/${v.slice(1)}`} key={v}>{v}</Link>
                                    );
                                }
                                return v;
                            })}
                        </div>
                    )}
                />
            </Card>

            {commentFormOpended && (
                <>
                    <Form onSubmit={onSubmitComment}>

                        <Form.Item>
                            <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={isAddingComment}>삐약</Button>
                    </Form>

                    <List
                        header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments || []}
                        renderItem={item => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />

                </>
            )}

        </div>
    );
};

PostCard.protoTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string,
        createdAt: PropTypes.object,
    }),
};

export default PostCard;