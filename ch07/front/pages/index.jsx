import React, {useCallback, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import {LOAD_MAIN_POSTS_REQUEST} from '../reducers/post';


const Home = () => {
    console.log('### front/pages/index... ###');

    const user = useSelector(state => state.user);
    console.log('### front/pages/index... useSelector(state => state.user): ', user, ' ###')


    // useState()가 useSelector()로 바뀌었다고 생각하면 된다.
    // useSelector()의 state는 리덕스에서 자동적으로 root reducer에 등록된 state들을 전달해준다.

    // 만약 user.jsx에 등록된 state가 변경되면
    // 현재 index.jsx의 컴포넌트가 re-rendering 된다.
    // useSelector()의 매개변수인 state는 전체 state를 의미한다.
    // 거기에서 reducers/index combineReducers()의 user를 가져온다는 의미이고
    const {me} = useSelector(state => state.user);
    const {mainPosts, hasMorePost} = useSelector(state => state.post);

    console.log(`### pages/index.jsx mainPosts: ${JSON.stringify(mainPosts)} ###`);

    const dispatch = useDispatch();

    // 요청을 보냈던 lastId 들을 기록
    const countRef = useRef([]);


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
                const lastId = mainPosts[mainPosts.length - 1].id;

                // 한번 보낸 lastId 는 다시 요청이 가지 않게 설정
                if(!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_MAIN_POSTS_REQUEST,

                        // 스크롤을 내리는 도중 누군가 새롤운 게시글을 작성했을 수도 있으므로
                        // 특정 게시글 전에 작성된 게시글들만 가져온다.
                        lastId,
                    });

                    // lastId 를 countRef 에 기록
                    // 한번 요청을 보낸 lastId 들이 countRef 에 기록되어 있기 때문에
                    // 만약 다음에 요청을 보낼 때 그 lastId 는 서버로 또 안가게 해주면 된다.
                    countRef.current.push(lastId);
                }

            }


        }

    }, [hasMorePost, mainPosts.length]);

    // 스크롤을 감지하려면 window에 addEventListner를 추가해야한다.
    // 컴포넌트가 처음 실행될 때 addEventListener 를 달아주고
    // 컴포넌트가 사라질 때 removeEventListener 를 달아준다.
    useEffect(() => {
        console.log('addEventListener');
        window.addEventListener('scroll', onScroll);

        // return이 있는 경우 다음 컴포넌트가 실행되기전에 한번 실행해준다.
        return () => {
            console.log('return removeEventListener');
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length]);


    // 성능 최적화를 위해 아래와 같이 쪼갤수도 있다.
    // const user = useSelector(state => state.user.user);
    // const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    // const mainPosts = useSelect(state => state.post.mainPosts);
    return (
        <div>
            {me && <PostForm/>}

            {mainPosts.map((c) => {
                return (
                    <PostCard key={c} post={c}/>
                );
            })}
        </div>
    );
};

// front/pages/_app.js 에서 넣어주는 Component.getInitalProps(ctx); 의 "ctx"가 아래 함수의 매개변수로 전달된다.
Home.getInitialProps = async (context) => {

    // context key에 store는 redux의 것이다.
    // 이 안에는 dispatch, getState 등이 있다.
    // getState는 redux state 들을 가져올 수 있는 함수이다.
    // store.dispatch, store.getState를 사용하면
    // getInitialProps 함수 안에서 redux 작업을 할 수 있다.
    console.log('### front/pages/index... Home.getInitialProps()... Object.keys(context): ', Object.keys(context), ' ###');

    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST,
    });

};

export default Home;