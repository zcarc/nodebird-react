import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga'; // next에서 사용하는 redux-saga
import AppLayout from '../components/AppLayout';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../reducers'
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../sagas";
import {LOAD_USER_REQUEST} from "../reducers/user";
import axios from 'axios';


const NodeBird = ({Component, store, pageProps}) => {

    console.log('### front/pages/_app.jsx... const NodeBird = ({Component, store, pageProps})... ###');
    // console.log(`### front/pages/_app.jsx... NodeBird... pageProps: ${JSON.stringify(pageProps)} ###`);

    return (
        <Provider store={store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css"/>
                <link rel="stylesheet" type="text/css" charset="UTF-8"
                      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
                <link rel="stylesheet" type="text/css"
                      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
            </Head>
            {/* AppLayout props에 Component가 주입된다. ( 메인으로 접속 시 AppLayout props에 index.jsx가 들어감 )*/}
            <AppLayout>
                <Component {...pageProps}/>
            </AppLayout>
        </Provider>
    );
};

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
};

// getInitialProps는 next가 알아서 실행해준다.
// context : next에서 받아온다.
// getInitialProps는 next의 라이프사이클 componentDidMount 보다 먼저 실행
// 주로 서버 작업을 할 때 사용
// 클라이언트 사이드 렌더링 또는 서버 사이드 렌더링인 두 경우 모두 실행된다.
// 서버사이드 렌더링 시 중요
NodeBird.getInitialProps = async (context) => {
    console.log('### front/pages/_app.jsx... NodeBird.getInitialProps = async(context) ###');
    // console.log('### front/pages/_app.jsx... NodeBird.getInitialProps = async(context)... context: ', context ,' ###');
    const {ctx, Component} = context;
    let pageProps = {};


    // 서버 사이드 렌더링 시에는 클라이언트 사이드 렌더링과 다르게 브라우저가 없기 때문에
    // 백엔드 서버로 axios 요청을 보낼 때 기본값으로 쿠키를 넣어서 보내줘야한다.
    // ctx의 req는 서버 사이드 렌더링 환경일 때만 req가 존재한다.
    // 클라이언트 사이드 렌더링인 경우에는 req가 undefined가 된다.
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
    console.log(`### front/pages/_app.jsx... getInitialProps... ctx.req.headers.cookie:`, cookie ,` ###`);

    // getInitialProps()가 클라이언트일 경우와 서버일 경우 둘 다 실행되기 때문에
    // 클라이언트일 경우에는 쿠키를 직접 보낼 필요가 없어서 분기처리를 해주는게 좋다.
    if(ctx.isServer && cookie) { // 서버 사이드 렌더링 이고 쿠키도 존재한다면

        // front/sagas/index... axios.defaults.baseURL 처럼 axios.defaults.headers.Cookie를 사용하면 모든 axios에 적용된다.
        axios.defaults.headers.Cookie = cookie;
    }

    // 이 부분이 await Component.getInitialProps(ctx) 로직보다 위에 호출되어야해서 먼저 호출한다.
    // 호출 순서를 원하는대로 정해주어야 한다.
    const state = ctx.store.getState();
    console.log(`### front/pages/_app.jsx... getInitialProps... ctx.store.getState():`, state ,` ###`);

    if(!state.user.me) {
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }

    // Nodebird의 Component와 같다.
    // <Component/> : pages 폴더의 파일들
    // 해당 파일이 getInitialProps를 사용한다면 true
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    console.log(`### front/pages/_app.jsx... pageProps = await Component.getInitialProps(ctx)... pageProps: ${JSON.stringify(pageProps)} ###`);
    // 컴포넌트의 props.
    // NodeBird의 파라미터로 받고 해당 <Component/>의 파라미터로 전달된다.
    return {pageProps};
};

const configureStore = (initialState, options) => {

    console.log('### front/pages/_app.jsx... configureStore... ###');
    // console.log('options: ', options);
    // console.log('options.isServer: ', options.isServer);

    const sagaMiddleware = createSagaMiddleware();
    // const middlewares = [sagaMiddleware];

    // 리덕스 사가 에러 찾아내는 커스텀 미들웨어
    // type: @@redux-saga (서버쪽에서 이 액션을 실행해줘서 서버사이드 렌더링이 가능하다.)
    const middlewares = [sagaMiddleware, (store) => (next) => (action) => {
        console.log('middlewares action: ', action);
        next(action);
    }];

    // enhance: 향상시키다
    // 리덕스의 기능을 향상시키는 것으로 생각하면 된다.
    // 방법은 applyMiddleware()들을 적용하면 된다.
    // compose(): middleware 끼리 합성을 하게 만드는 함수
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : compose(
            applyMiddleware(...middlewares),
            !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
            // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
        );

    // createStore()에 첫번째 인자에 root reducer를 넣어준다.
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);

    return store;

};

// 서버 사이드 렌더링 (SSR)
// withRedux는 configureStore 이라는 설정이 있고,
// withReduxSaga는 설정 부분이 없지만 store에 사가 미들웨어 run을 넣어줘야한다.
// withReduxSaga는 내부에서 sagaMiddleware.run(rootSaga)를 필요로 한다.

// 여기에서는 아래 코드가 있어야 next에서 SSR를 할 수 있다.
// store.sagaTask = sagaMiddleware.run(rootSaga);
// withReduxSaga(NodeBird)
export default withRedux(configureStore)(withReduxSaga(NodeBird));