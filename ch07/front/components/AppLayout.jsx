import React, {useEffect} from 'react';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Menu, Input, Row, Col} from 'antd';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import {LOAD_USER_REQUEST} from "../reducers/user";
import Router from "next/router";

// children은 props
const AppLayout = ({children}) => {
    console.log('### front/components/AppLayout.jsx... const AppLayout = ( {children} )... {children}: ', {children}, ' ###');

    const {me} = useSelector(state => state.user);

    const onSearch = (value) => {
        // 내부적으로는 1번째 인자로 동작하고, 외부적으로는 2번째 인자로 보인다.
        Router.push({ pathname: '/hashtag', query: { tag: value }}, `/hashtag/${value}`);
    };

    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
                <Menu.Item key="mail">
                    <Input.Search
                        enterButton
                        style={{verticalAlign: 'middle'}}
                        onSearch={onSearch}
                    />
                </Menu.Item>
            </Menu>

            {/* gutter: Col 간의 간격 */}
            <Row gutter={8}>

                <Col xs={24} md={6}>
                    {me
                        ? <UserProfile/>
                        : <LoginForm/>}
                </Col>

                <Col xs={24} md={12}>
                    {children}
                </Col>

                <Col xs={24} md={6}>
                    <Link href="https://www.github.com/zcarc"><a target="_blank">Made by Hyunsoo</a></Link>
                </Col>

            </Row>

        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;