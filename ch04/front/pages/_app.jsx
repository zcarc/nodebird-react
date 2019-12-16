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


const NodeBird = ({Component, store}) => {

    console.log('_app.jsx component...');

    return (
        <Provider store={store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css"/>
            </Head>
            <AppLayout>
                <Component/>
            </AppLayout>
        </Provider>
    );
};

NodeBird.propTypes = {
    Component: PropTypes.elementType,
    store: PropTypes.object,
};


export default withRedux((initialState, options) => {

    console.log('withRedux...');
    console.log('options: ', options);
    console.log('options.isServer: ', options.isServer);

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

})(NodeBird);