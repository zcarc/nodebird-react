import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {LOAD_POST_REQUEST} from "../reducers/post";
import Helmet from "react-helmet";

// 서버사이드 렌더링의 효과를 보여주기 위해서 만든 예제
// 기존에는 10개씩 가져오는 페이지가 있었다면
// 이번에는 1개씩 가져오는 페이지를 만들어본다.

const Post = ({id}) => {
    const {singlePost} = useSelector(state => state.post);
    console.log('## front/pages/post... singlePost: ', singlePost, ' ###');

    return (
        <>
            <Helmet
                title={`${singlePost.User.nickname}님의 글`}
                desciprtion={singlePost.content}
                meta={[{// 메타 태그는 여러개가 될 수 있기 때문에 배열로 넣어준다.
                    name: 'description', content: singlePost.content,
                }, {
                    property: 'og:title', content: `${singlePost.User.nickname}님의 게시글`,
                }, {
                    property: 'og:description', content: singlePost.content,
                }, {
                    property: 'og:image', content: singlePost.Images[0] && `http://localhost:8080/${singlePost.Images[0].src}`,
                }, {
                    property: 'og:url', content: `http://localhost:3000/post/${id}`,
                }]}
            />
            <div>{singlePost.content}</div>
            <div>{singlePost.User.nickname}</div>
            <div>
                {singlePost.Images[0] && <img src={`http://localhost:8080/${singlePost.Images[0].src}`}/>}
            </div>
        </>
    );
};

Post.getInitialProps = async (context) => {

    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.query.id,
    });

    return {id: parseInt(context.query.id, 10)};
};

Post.propTypes = {
    id: PropTypes.number.isRequired,
};

export default Post;