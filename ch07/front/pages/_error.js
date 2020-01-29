import Error from 'next/error';
import React from "react";
import PropTypes from 'prop-types';

const MyError = ({ statusCode }) => {
    console.log('### front/pages/_error... statusCode: ', statusCode, ' ###');
    return (
        <div>
            <h1>{statusCode} 에러 발생</h1>
            {/*<Error statusCode={statusCode}/>*/}
        </div>
    );
};

MyError.propTypes = {
    statusCode: PropTypes.number,
};

MyError.defaultProps = {
    statusCode: 400,
};

MyError.getInitialProps = async (context) => {
    // server 라면 context.res 가 존재한다.
  const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null;
    console.log('### front/pages/_error... context.res.statusCode: ', context.res.statusCode, ' ###');
    console.log('### front/pages/_error... context.err: ', context.err, ' ###');
  return { statusCode };
};

export default MyError;