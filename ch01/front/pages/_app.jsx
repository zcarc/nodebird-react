import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';

const NodeBird = ({ Component }) => {

  console.log('_app.jsx component...');

    return (
      <>
          <Head>
              <title>NodeBird</title>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css"/>
          </Head>
          <AppLayout>
              <Component/>
          </AppLayout>
      </>
    );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType,
};

export default NodeBird;