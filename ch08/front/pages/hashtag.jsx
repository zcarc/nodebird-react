import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from "react-redux";
import {LOAD_HASHTAG_POSTS_REQUEST, LOAD_MAIN_POSTS_REQUEST} from "../reducers/post";
import PostCard from "../containers/PostCard";

// _app.js의 <Component {...pageProps}/>
const Hashtag = ({tag}) => {
    console.log(`### front/pages/hashtag.jsx tag: ${JSON.stringify(tag)} ###`);

    const dispatch = useDispatch();
    const {mainPosts, hasMorePost} = useSelector(state => state.post);

    // 클라이언트 사이드 렌더링인 경우
    // useEffect(() => {
    //     dispatch({
    //         type: LOAD_HASHTAG_POSTS_REQUEST,
    //         data: tag,
    //     });
    // }, [tag]);


    const onScroll = useCallback(() => {

        // window.scrollY: 스크롤 내린 거리
        // document.documentElement.clientHeight: 화면 높이
        // document.documentElement.scrollHeight: 전체 화면 높이
        console.log('window.scrollY: , ', window.scrollY);
        console.log('document.documentElement.clientHeight: , ', document.documentElement.clientHeight);
        console.log('window.scrollY + document.documentElement.clientHeight: , ', window.scrollY + document.documentElement.clientHeight);
        console.log('document.documentElement.scrollHeight: , ', document.documentElement.scrollHeight);

        // 브라우저 스크롤을 내렸을 때 마지막까지 내리기 전 -300 값인 경우
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {

            // 더 불러올 게시글들이 있다면 불러오고
            // 다 불러왔으면 요청하지 않는다.
            if(hasMorePost) {
                dispatch({
                    type: LOAD_HASHTAG_POSTS_REQUEST,

                    // 스크롤을 내리는 도중 누군가 새롤운 게시글을 작성했을 수도 있으므로
                    // 특정 게시글 전에 작성된 게시글들만 가져온다.
                    lastId: mainPosts[mainPosts.length - 1].id,
                    data: tag,
                });
            }


        }

    }, [hasMorePost, mainPosts.length]);


    // 스크롤을 감지하려면 window에 addEventListner를 추가해야한다.
    // 컴포넌트가 처음 실행될 때 addEventListener 를 달아주고
    // 컴포넌트가 사라질 때 removeEventListener 를 달아준다.
    useEffect(() => {
        console.log('### front/pages/hashtag... useEffect... addEventListener... ###');
        window.addEventListener('scroll', onScroll);

        // return이 있는 경우 다음 컴포넌트가 실행되기전에 한번 실행해준다.
        return () => {
            console.log('### front/pages/hashtag... useEffect... return removeEventListener... ###');
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length]);

    return (
        <div>
            {mainPosts.map(c => (
                <PostCard key={c.id} post={c} />
            ))}
        </div>
    );
};

Hashtag.propTypes = {
    tag: PropTypes.string.isRequired,
};

// server.js에서 보내준 query가 context가 포함되어 hashtag.jsx가 실행될 때 포함되어 있다.
Hashtag.getInitialProps = async (context) => {

    // context.query.tag는 server.js의 4번째 인자
    const tag = context.query.tag;
    console.log('hashtag getInitialProps ', tag);

    // 서버 사이드 렌더링인 경우
    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: tag,
    });

    // _app.js 의 pageProps로 반환된다.
    return {tag};
};

export default Hashtag;