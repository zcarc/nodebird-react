import React from "react";
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

// 원래는 _app.jsx에서 html, head, body 태그가 필요없었지만
// 이 파일을 수정함으로써 그런 태그들을 직접 컨트롤할 수 있게 된다.
// { Main } : _app.jsx
// { NextScript }: next 서버 구동에 필요한 script들을 모아둔 것

class MyDocument extends Document{

    // 클래스로 사용하게 되면 static으로 사용해야한다.
    static getInitialProps(context) {
        console.log('### front/pages/_document... MyDocument... getInitialProps()...');

        // styled-components를 SSR 적용
        const sheet = new ServerStyleSheet();

        // renderPage의 App : front/pages/_app.jsx
        // 이것을 추가해야 _app.jsx 를 실행할 수 있게 된다.
        // _document 가 _app 의 상위이기 때문에 이 부분을 실행해서 _app 을 렌더링 해줘야한다.
        // 그리고 그 _app 은 각 component 들의 getInitialProps 를 실행시켜준다.
        // styled-components를 SSR 적용 하기 위해서 sheet.collectStyles() 로 App을 감싸줘야한다.
        const page = context.renderPage( (App) => (props) => sheet.collectStyles(<App {...props} />) );
        const styleTags = sheet.getStyleElement();

        console.log('### front/pages/_document... page: ', page, ' ###');

        // Helmet.renderStatic() : SSR을 할 수 있게 된다.
        // 여기서 return 한 것은 this.props에 들어가게 된다.
        return { ...page, helmet: Helmet.renderStatic(), styleTags };
    }

    render() {
        console.log('### front/pages/_document... MyDocument... render()...');

        // htmlAttributes: html의 속성들을 helmet에서 제공
        // bodyAttributes: body의 속성들을 helmet에서 제공
        // ...helmet : 나머지들 meta, style, script 등
        // html 속성중 lang=ko 같은게 있는데 그런게 htmlAttributes, bodyAttributes 에 들어있다.
        const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;

        // htmlAttributes, bodyAttributes는 기본적으로 객체형식이라서 리액트에서 쓸 수 있게 컴포넌트로 변환해줘야한다.
        const htmlAttrs = htmlAttributes.toComponent();
        const bodyAttrs = bodyAttributes.toComponent();

        console.log('### front/pages/_document... this.props: ', this.props, ' ###');
        console.log('### front/pages/_document... helmet: ', helmet, ' ###');
        console.log('### front/pages/_document... Object.values(helmet).map(el => el.toComponent()): ', Object.values(helmet).map(el => el.toComponent()), ' ###');

        return(
            <html {...htmlAttrs}>
                <head>
                    {this.props.styleTags}
                    {Object.values(helmet).map(el => el.toComponent())}
                </head>
                <body {...bodyAttrs}>
                    <Main />
                    {process.env.NODE_ENV === 'production'
                    && <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />}
                    <NextScript />
                </body>
            </html>
        );
    }
}

MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
    styleTags: PropTypes.object.isRequired,
};

export default MyDocument;