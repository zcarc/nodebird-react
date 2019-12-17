import React, {useState, useCallback, memo} from 'react'
import {Input, Form, Checkbox, Button} from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { SIGN_UP_REQUEST } from '../reducers/user';


// propTypes value를 string으로 지정하고 number를 넘겨주면 콘솔에 에러가 발생
const TextInput = ({value}) => {
    return (
        <div>{value}</div>
    );
};

TextInput.propTypes = {
  value: PropTypes.string,
};

// 컴포넌트로 내보내기
export const useInput = (initValue = null) => {

    console.log('useInput...');

    const [value, setter] = useState(initValue);

    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);


    return [value, handler];
};

const Signup = () => {
    console.log('Signup() component...');

    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');

    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const dispatch = useDispatch();


    const onSubmit = useCallback((e) => {
        e.preventDefault();

        if (password !== passwordCheck) {
            return setPasswordError(true);
        }

        if (!term) {
            return setTermError(true);
        }

        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
              id,
              password,
              nick,
            },
        });

    }, [password, passwordCheck, term]);


    const onChangePasswordCheck = useCallback((e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    }, [password]);

    const onChangeTerm = useCallback((e) => {
        console.log('e.target.checked: ', e.target.checked);
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
            <TextInput value={"123"} />
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