 import React, { useEffect } from 'react';
 import PropTypes from 'prop-types';
 import {useDispatch, useSelector} from "react-redux";
 import { LOAD_HASHTAG_POSTS_REQUEST } from "../reducers/post";
 import PostCard from "../components/PostCard";

 // _app.js의 <Component {...pageProps}/>
 const Hashtag = ({ tag }) => {
     console.log(`### front/pages/hashtag.jsx tag: ${JSON.stringify(tag)} ###`);

     const dispatch = useDispatch();
     const { mainPosts } = useSelector(state => state.post);

     useEffect(() => {
        dispatch({
           type: LOAD_HASHTAG_POSTS_REQUEST,
           data: tag,
        });
     }, []);

     return (
         <div>
             {mainPosts.map(c => (
                 <PostCard key={+c.created} post={c}></PostCard>
             ))}
         </div>
     );
 };

 Hashtag.propTypes = {
     tag: PropTypes.string.isRequired,
 };

 // server.js에서 보내준 query가 context가 포함되어 hashtag.jsx가 실행될 때 포함되어 있다.
 Hashtag.getInitialProps = async(context) => {

     // context.query.tag는 server.js의 4번째 인자
    console.log('hashtag getInitialProps ', context.query.tag);

    // _app.js 의 pageProps로 반환된다.
    return { tag: context.query.tag };
 };

 export default Hashtag;