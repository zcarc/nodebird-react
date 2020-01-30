import { useCallback, useState } from 'react';
import { useDispatch, useSelector, use } from 'react-redux';
import Link from 'next/link';
import { Input, Button, Form } from 'antd';
import { useInput } from '../pages/signup';
import { LOG_IN_REQUEST } from '../reducers/user';
// import styled from 'styled-components';

// const LoginError = styled.div`
//     color: red;
// `;

const LoginForm = () => {
    console.log('### front/components/LoginForm... ###');
    
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    const { isLoggingIn, logInErrorReason } = useSelector(state => state.user);
    const dispatch = useDispatch();

    console.log('### front/components/LoginForm... isLoggingIn: ', isLoggingIn, ' ###');


    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        dispatch({
            type: LOG_IN_REQUEST,
            data: {
                userId: id,
                password,
            },
        });
    }, [id, password]);


    return (
        <Form onSubmit={onSubmitForm} style={{ padding: '10px' }}>
            <div>
                <lable htmlFor="user-id">아이디</lable>
                <br />
                <Input name="user-id" value={id} onChange={onChangeId} required />
            </div>

            <div>
                <lable htmlFor="user-password">패스워드</lable>
                <br />
                <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
            </div>

            <div style={{ color: 'red'}}>{logInErrorReason}</div>
            <div style={{ marginTop: '10px' }}>
                <Button htmlType="submit" type="primary" loading={isLoggingIn}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </div>
        </Form>
    );
};

export default LoginForm;