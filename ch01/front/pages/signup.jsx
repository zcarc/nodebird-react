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
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        if(password !== passwordCheck) {
            return setPasswordError(true);
        }

        if(!term) {
            return setTermError(true);
        }

        console.log({
            id,
            nick,
            password,
            passwordCheck,
            term
        });
        console.log('id: ', id);
    };
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
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    };
    const onChangeTerm = (e) => {
        setTermError(false);
        setTerm(e.target.checked);
    };

    // 커스텀 Hook
    // 만약 비밀번호 Input에 사용한다면
    // value에 value가 들어가고 onChange에 handler가 들어간다.
    const useInput = (initValue = null) => {
        const [value, setter] = useState(initValue);
        const handler = (e) => {
            setter(e.target.value);
        };
        return [value, handler];
    };

    const [pwd, onChangePwd] = useInput('');



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
                        <Input name="user-id" required onChange={onChangeId}></Input>
                    </div>

                    <div>
                        <lable htmlFor="user-nick">닉네임</lable>
                        <br/>
                        <Input name="user-nick" required onChange={onChangeNick}></Input>
                    </div>

                    <div>
                        <lable htmlFor="user-password">비밀번호</lable>
                        <br/>
                        <Input name="user-password" type="password" value={password} required onChange={onChangePassword}></Input>
                    </div>

                    <div>
                        <lable htmlFor="user-password-check">비밀번호 체크</lable>
                        <br/>
                        <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck}></Input>
                        {passwordError && <div style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</div>}
                    </div>

                    <div>
                        <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
                        {termError && <div style={{color: 'red'}}>약관에 동의하셔야 합니다.</div>}
                    </div>

                    <div style={{marginTop: 10}}>
                        <Button type="primary" htmlType="submit">가입하기</Button>
                    </div>
                </Form>
            </AppLayout>
        </>
    );
};

export default Signup;