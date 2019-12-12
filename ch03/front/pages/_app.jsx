import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import AppLayout from '../components/AppLayout';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducers'


const NodeBird = ({ Component, store }) => {

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
  

  // createStore()에 첫번째 인자에 root reducer를 넣어준다.
  const store = createStore(reducer, initialState);

  console.log('initialState: ', initialState);
  console.log('reducer: ', reducer);
  console.log('store: ', store);

  return store;

})(NodeBird);