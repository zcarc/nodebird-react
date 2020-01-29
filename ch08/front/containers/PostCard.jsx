import {useState, useCallback, useEffect} from 'react';
import {Button, Card, Icon, Avatar, Form, Input, List, Comment, Popover} from 'antd';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from "react-redux";
import {
    ADD_COMMENT_REQUEST,
    LIKE_POST_REQUEST,
    LOAD_COMMENTS_REQUEST, REMOVE_POST_REQUEST,
    RETWEET_REQUEST,
    UNLIKE_POST_REQUEST
} from "../reducers/post";
import Link from 'next/link';
import PostImages from '../components/PostImages';
import PostCardContent from '../components/PostCardContent';
import {FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST} from "../reducers/user";
import styled from "styled-components";

const CardWrapper = styled.div`
    margin-bottom: 20px;
`;

const PostCard = ({post}) => {
    console.log(' ### front/components/PostCard.jsx... const PostCard = ({post})... post: ', post, ' ###');
    console.log(' ### front/components/PostCard.jsx... const PostCard = ({post})... post.id: ', post.id, ' ###');

    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const {me} = useSelector(state => state.user);
    const {commentAdded, isAddingComment} = useSelector(state => state.post);
    const dispatch = useDispatch();

    const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

    const onToggleComment = useCallback(() => {
        console.log(' ### front/components/PostCard.jsx... befre setCommentFormOpened... commentFormOpened: ', commentFormOpened, ' ###');
        setCommentFormOpened(prev => !prev);
        console.log(' ### front/components/PostCard.jsx... after setCommentFormOpened... commentFormOpened: ', commentFormOpened, ' ###');

        if (!commentFormOpened) {
            console.log(' ### front/components/PostCard.jsx... if(!commentFormOpened)... post.id: ', post.id, ' ###');
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

        if (!me) {
            return alert('로그인이 필요합니다.');
        }
        // post.Likers: 좋아요를 누른사람들의 아이디가 배열로 들어있다.
        // 좋아요를 누른 사람 중에 내 아이디가 있는지 확인
        if (liked) { // 좋아요 누른 상태
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
        if (!me) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        })

    }, [me && me.id, post && post.id]);

    const onFollow = useCallback( (userId) => () => {
        dispatch({
            type: FOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    const onUnfollow = useCallback( (userId) => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    // 게시글 삭제
    const onRemovePost = useCallback(userId => () => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: userId,
        });

    }, []);


    return (
        <CardWrapper>
            <Card
                cover={post.Images && post.Images[0] && <PostImages images={post.Images}/>}
                actions={[
                    <Icon type="retweet" key="retweet" onClick={onRetweet}/>,
                    <Icon type="heart" key="heart" theme={liked ? "twoTone" : "outlined"} twoToneColor="#eb2f96"
                          onClick={onToggleLike}/>, // Icon 기본 테마는 outlined인데 색을 주고 싶으면 twoTone으로 바꾸면 된다.
                    <Icon type="message" key="message" onClick={onToggleComment}/>,
                    <Popover
                        key="ellipsis"
                        content={(
                            <Button.Group>
                                {me && post.UserId === me.id
                                    ? (
                                        <>
                                            <Button>수정</Button>
                                            <Button type="danger" onClick={onRemovePost(post.id)}>삭제</Button>
                                        </>
                                    )
                                    : <Button>신고</Button>}
                            </Button.Group>
                        )}
                    >
                        <Icon type="ellipsis" key="ellipsis"/>
                    </Popover>

                ]}
                // 리트윗한 게시글인 경우 출력
                title={post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null}

                // 팔로우 <-> 언팔로우
                // 로그인을 안했거나 자기의 게시글이면
                extra={ !me || post.User.id === me.id
                    ? null
                    // 남의 게시글의 작성자를 내가 팔로잉하고 있다면
                    : me.Followings && me.Followings.find(v => v.id === post.User.id)
                        ? <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
                        : <Button onClick={onFollow(post.User.id)}>팔로우</Button>


                }
            >

                {/*원래 게시글, 리트윗한 게시글 분기처리*/}
                {post.RetweetId && post.Retweet
                    // 리트윗 게시글
                    ? (
                        <Card
                            cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
                        >
                            <Card.Meta
                                avatar={(
                                    <Link href={{pathname: '/user', query: {id: post.Retweet.User.id}}}
                                          as={`/user/${post.Retweet.User.id}`}>
                                        <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                                    </Link>
                                )}
                                title={post.Retweet.User.nickname}
                                // 컴포넌트로 만든 이유: 리트윗 한 경우, 하지 않은 경우의 중복 제거(서로 내용이 같아서 컴포넌트로 만듦)
                                description={<PostCardContent postData={post.Retweet.content}/>}
                            />
                        </Card>
                    )
                    // 원래 게시글
                    : (
                        <Card.Meta
                            // <Link href={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>
                            // 이렇게 사용하면 동적인 처리를 프론트에서 못해서 익스프레스로 넘어가게 된다.
                            // 그렇게 되면 front/server.js 의 server.get(/user/:id) 부분이 실행되서 페이지가 새로 렌더링 된다.
                            // 그래서 프론트에서 처리할 수 있게 링크를 아래 코드로 바꿔줘야한다.

                            // pathname: pages 폴더 내에 있는 파일
                            // query: 프론트에서 동적으로 처리한 query 부분
                            // server.js에서 app.render()에서 3,4번째 인자와 똑같다.
                            avatar={(
                                <Link href={{pathname: '/user', query: {id: post.User.id}}}
                                      as={`/user/${post.User.id}`}>
                                    <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                                </Link>
                            )}
                            title={post.User.nickname}
                            description={<PostCardContent postData={post.content}/>}
                        />
                    )

                }
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
                                        <Link href={{pathname: '/user', query: {id: item.User.id}}}
                                              as={`/user/${item.User.id}`}>
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


        </CardWrapper>
    );
};

PostCard.protoTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string,
        createdAt: PropTypes.string,
    }).isRequired,
};

export default PostCard;

