import React from "react";
import Helmet from 'react-helmet';
import Document, { Main, NextScript } from "next/document";

// 원래는 _app.jsx에서 html, head, body 태그가 필요없었지만
// 이 파일을 수정함으로써 그런 태그들을 직접 컨트롤할 수 있게 된다.
// { Main } : _app.jsx
// { NextScript }: next 서버 구동에 필요한 script들을 모아둔 것

class MyDocument extends Document{

    // 클래스로 사용하게 되면 static으로 사용해야한다.
    static getInitialProps(context) {

        // Helmet.renderStatic() : SSR을 할 수 있게 된다.
        // 여기서 return 한 것은 this.props에 들어가게 된다.
        return { helmet: Helmet.renderStatic() }
    }

    render() {

        // htmlAttributes: html의 속성들을 helmet에서 제공
        // bodyAttributes: body의 속성들을 helmet에서 제공
        // ...helmet : 나머지들 meta, style, script 등
        // html 속성중 lang=ko 같은게 있는데 그런게 htmlAttributes, bodyAttributes 에 들어있다.
        const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;

        // htmlAttributes, bodyAttributes는 기본적으로 객체형식이라서 리액트에서 쓸 수 있게 컴포넌트로 변환해줘야한다.
        const htmlAttrs = htmlAttributes.toComponent();
        const bodyAttrs = bodyAttributes.toComponent();

        console.log('### front/pages/_document... Object.values(helmet).map(el => el.toComponent()): ', Object.values(helmet).map(el => el.toComponent()), ' ###');

        return(
            <html {...htmlAttrs}>
                <head>
                    {Object.values(helmet).map(el => el.toComponent())}
                </head>
                <body {...bodyAttrs}>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}