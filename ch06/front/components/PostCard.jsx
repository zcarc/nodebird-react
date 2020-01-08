import {useState, useCallback, useEffect} from 'react';
import {Button, Card, Icon, Avatar, Form, Input, List, Comment} from 'antd';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from "react-redux";
import {
    ADD_COMMENT_REQUEST,
    LIKE_POST_REQUEST,
    LOAD_COMMENTS_REQUEST,
    RETWEET_REQUEST,
    UNLIKE_POST_REQUEST
} from "../reducers/post";
import Link from 'next/link';
import PostImages from './PostImages';

const PostCard = ({post}) => {
    console.log(' ### front/components/PostCard.jsx... const PostCard = ({post})... post: ', post ,' ###');
    console.log(' ### front/components/PostCard.jsx... const PostCard = ({post})... post.id: ', post.id ,' ###');

    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const {me} = useSelector(state => state.user);
    const {commentAdded, isAddingComment} = useSelector(state => state.post);
    const dispatch = useDispatch();

    const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

    const onToggleComment = useCallback(() => {
        console.log(' ### front/components/PostCard.jsx... befre setCommentFormOpened... commentFormOpened: ', commentFormOpened ,' ###');
        setCommentFormOpened(prev => !prev);
        console.log(' ### front/components/PostCard.jsx... after setCommentFormOpened... commentFormOpened: ', commentFormOpened ,' ###');

        if(!commentFormOpened) {
            console.log(' ### front/components/PostCard.jsx... if(!commentFormOpened)... post.id: ', post.id ,' ###');
            dispatch({
                type: LOAD_COMMENTS_REQUEST,
                data: post.id,
            });
        }
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
                content: commentText,
            },
        });
    }, [me && me.id, commentText]); // 객체를 넣지 말고 객체의 값을 넣어줘야한다.

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true]);

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    const onToggleLike = useCallback(() => {

        if(!me) {
            return alert('로그인이 필요합니다.');
        }
        // post.Likers: 좋아요를 누른사람들의 아이디가 배열로 들어있다.
        // 좋아요를 누른 사람 중에 내 아이디가 있는지 확인
        if(liked) { // 좋아요 누른 상태
            dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            });
        } else { // 좋아요 안 누른 상태
            dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            })
        }
    }, [me && me.id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if(!me) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        })

    }, [me && me.id, post && post.id]);


    return (
        <div>
            <Card
                key={+post.createdAt}
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <Icon type="retweet" key="retweet" onClick={onRetweet}/>,
                    <Icon type="heart" key="heart" theme={liked ? "twoTone" : "outlined"} twoToneColor="#eb2f96" onClick={onToggleLike}/>, // Icon 기본 테마는 outlined인데 색을 주고 싶으면 twoTone으로 바꾸면 된다.
                    <Icon type="message" key="message" onClick={onToggleComment}/>,
                    <Icon type="ellipsis" key="ellipsis"/>,
                ]}
                extra={<Button>팔로우</Button>}
            >
                <Card.Meta
                    // <Link href={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>
                    // 이렇게 사용하면 동적인 처리를 프론트에서 못해서 익스프레스로 넘어가게 된다.
                    // 그렇게 되면 front/server.js 의 server.get(/user/:id) 부분이 실행되서 페이지가 새로 렌더링 된다.
                    // 그래서 프론트에서 처리할 수 있게 링크를 아래 코드로 바꿔줘야한다.

                    // pathname: pages 폴더 내에 있는 파일
                    // query: 프론트에서 동적으로 처리한 query 부분
                    // server.js에서 app.render()에서 3,4번째 인자와 똑같다.
                    avatar={(
                        <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
                            <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                        </Link>
                    )}
                    title={post.User.nickname}
                    description={(
                        <div>
                            {post.content.split(/(#[^\s]+)/g).map((v) => {
                                if (v.match(/#[^\s]+/)) {
                                    return (
                                        <Link href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }} as={`/hashtag/${v.slice(1)}`} key={v}>
                                            <a>{v}</a>
                                        </Link>
                                    );
                                }
                                return v;
                            })}
                        </div>
                    )}
                />
            </Card>

            {commentFormOpened && (
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
                                    // as를 붙여주면 URL에 querystring이 사라지게 할 수 있다.
                                    avatar={( // 중괄호 생략가능
                                        <Link href={{ pathname:'/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                                            <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                                        </Link>
                                    )}
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

