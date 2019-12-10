import React, { useState } from 'react'
import Head from "next/head";
import { Input, Form, Checkbox, Button } from 'antd';
import AppLayout from '../components/AppLayout';

const Signup = () => {

    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);

    const onSubmit = () => {};
    const onChangeId = (e) => {
        setId(e.target.value);
    };
    const onChangeNick = (e) => {
        setNick(e.target.value);
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };
    const onChangePasswordCheck = (e) => {
        setPasswordCheck(e.target.value);
    };
    const onChangeTerm = (e) => {
        setTerm(e.target.value);
    };

    return(
        <>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css"/>
            </Head>
            <AppLayout>
                <Form onSubmit={onSubmit} style={{padding: 10}}>
                    <div>
                        <lable htmlFor="user-id">아이디</lable>
                        <br/>
                        <Input name="user-id" required onChnage={onChangeId}></Input>
                    </div>

                    <div>
                        <lable htmlFor="user-nick">닉네임</lable>
                        <br/>
                        <Input name="user-nick" required onChnage={onChangeNick}></Input>
                    </div>

                    <div>
                        <lable htmlFor="user-password">비밀번호</lable>
                        <br/>
                        <Input name="user-password" type="password" value={password} required onChnage={onChangePassword}></Input>
                    </div>

                    <div>
                        <lable htmlFor="user-password-check">비밀번호 체크</lable>
                        <br/>
                        <Input name="user-password-check" type="password" value={passwordCheck} required onChnage={onChangePasswordCheck}></Input>
                    </div>

                    <div>
                        <Checkbox name="user-term" value={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
                    </div>

                    <div>
                        <Button type="primary" htmlType="submit">가입하기</Button>
                    </div>
                </Form>
            </AppLayout>
        </>
    );
};

export default Signup;