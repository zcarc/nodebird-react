import React, {useEffect} from 'react';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Menu, Input, Row, Col} from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import {LOAD_USER_REQUEST} from "../reducers/user";

// children은 props
const AppLayout = ({children}) => {
    console.log('### front/components/AppLayout.jsx... const AppLayout = ( {children} )... {children}: ', {children}, ' ###');

    const {me} = useSelector(state => state.user);
    const dispatch = useDispatch();

    // 컴포넌트가 마운트 될 때, 사용자 요청
    useEffect(() => {
        if (!me) {
            dispatch({
                type: LOAD_USER_REQUEST,
            });
        }
    }, []);

    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
                <Menu.Item key="mail">
                    <Input.Search enterButton style={{verticalAlign: 'middle'}}/>
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
    children: PropTypes.node,
};

export default AppLayout;