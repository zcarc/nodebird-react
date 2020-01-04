import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import AppLayout from '../components/AppLayout';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../reducers'
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../sagas";


const NodeBird = ({Component, store, pageProps}) => {

    console.log('_app.jsx component...');

    return (
        <Provider store={store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css"/>
            </Head>
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
// 프론트, 백엔드 둘 다 실행가능
// 서버사이드 렌더링 시 중요
NodeBird.getInitialProps = async(context) => {
    console.log('NodeBird.getInitialProps context: ', context);
    const { ctx, Component } = context;
    let pageProps = {};

    // Nodebird의 Component와 같다.
    // <Component/> : pages 폴더의 파일들
    // 해당 파일에 getInitialProps를 사용한다면 true
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    // 컴포넌트의 props.
    // NodeBird의 파라미터로 받고 해당 <Component/>의 파라미터로 전달된다.
    return { pageProps };
};

const configureStore = (initialState, options) => {

    console.log('withRedux...');
    // console.log('options: ', options);
    // console.log('options.isServer: ', options.isServer);

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];

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
    sagaMiddleware.run(rootSaga);

    return store;

};

export default withRedux(configureStore)(NodeBird);