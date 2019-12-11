import React, {useState, useCallback, memo} from 'react'
import Head from "next/head";
import {Input, Form, Checkbox, Button} from 'antd';
import AppLayout from '../components/AppLayout';


// 특정 부분만 골라서 최적화 하는 방법
// 지나친 최적화도 별로 좋지 않다.
const TextInput = memo(({ value, onChange }) => {
    return(
        <Input value={value} required onChange={onChange}></Input>
    );
});

const Signup = () => {

    const useInput = (initValue = null) => {
        const [value, setter] = useState(initValue);

        const handler = useCallback((e) => {
            setter(e.target.value);
        }, []);

        return [value, handler];
    };

    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');

    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);


    const onSubmit = useCallback((e) => {
        e.preventDefault();

        if (password !== passwordCheck) {
            return setPasswordError(true);
        }

        if (!term) {
            return setTermError(true);
        }

    }, [password, passwordCheck, term]);


    const onChangePasswordCheck = useCallback((e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    }, [password]);

    const onChangeTerm = useCallback((e) => {
        setTermError(false);
        setTerm(e.target.checked);
    }, []);

    // 커스텀 Hook
    // 만약 비밀번호 Input에 사용한다면
    // value에 value가 들어가고 onChange에 handler가 들어간다.
    // const useInput = (initValue = null) => {
    //     const [value, setter] = useState(initValue);
    //     const handler = (e) => {
    //         setter(e.target.value);
    //     };
    //     return [value, handler];
    // };


    return (
        <>
            <Form onSubmit={onSubmit} style={{padding: 10}}>
                <div>
                    <lable htmlFor="user-id">아이디</lable>
                    <br/>
                    <Input name="user-id" required onChange={onChangeId}></Input>
                    {/*<TextInput name="user-id" />*/}
                </div>

                <div>
                    <lable htmlFor="user-nick">닉네임</lable>
                    <br/>
                    <Input name="user-nick" required onChange={onChangeNick} />
                </div>

                <div>
                    <lable htmlFor="user-password">비밀번호</lable>
                    <br/>
                    <Input name="user-password" type="password" value={password} required
                           onChange={onChangePassword} />
                </div>

                <div>
                    <lable htmlFor="user-password-check">비밀번호 체크</lable>
                    <br/>
                    <Input name="user-password-check" type="password" value={passwordCheck} required
                           onChange={onChangePasswordCheck}></Input>
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
        </>
    );
};
export default Signup;