
// styled-components 는 모듈로 만들어서 다른 파일에서도 쓸 수 있다. (export)

import styled from "styled-components";
import {Icon} from "antd";

export const Overlay = styled.div`
    position: fixed;
    z-index: 5000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

// Header 안에 들어있는 h1을 생성하면 Header의 하위 컴포넌트로 사용가능하다.
// & h1 이 부분은 CSS 선택자로 사용할 수 있다.
// & : 자기 자신을 가르키는 태그
export const Header = styled.header`
    height: 44px;
    background: white;
    position: relative;
    padding: 0;
    text-align: center;
    
    & h1 {
        margin: 0;
        font-size: 17px;
        color: #333;
        line-height: 44ox;
    }
`;


export const SlickWrapper = styled.div`
    height: calc(100% - 44px);
    background: #090909;
`;

export const CloseBtn = styled(Icon)`
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
`;

export const Indicator = styled.div`
    text-align: center;
    
    & > div {
        width: 75px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background: #313131;
        display: inline-block;
        text-align: center;
        color: white;
        font-size: 15px;
    }
    
`;

export const ImgWrapper = styled.div`
    padding: 32px;
    text-align: center;
    
    & img {
        margin: 0 auto;
        max-height: 750px;
    }
`;