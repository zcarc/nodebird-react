import React, {useState, useCallback, useEffect} from 'react'
import {Input, Form, Checkbox, Button} from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
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
    console.log('### front/pages/signup... ###');

    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');

    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const dispatch = useDispatch();
    const { isSigningUp, me } = useSelector(state => state.user);


    useEffect(() => {
        if(me){
            alert('로그인 했으니 메인페이지로 이동합니다.');
            Router.push('/');
        }
    }, [me && me.id]); // 자바 스크립트는 undefined 일수도 있으니 가드(%%)를 해줘야한다.
    // useEffect의 두번째 인자의 비교 대상은 객체가 아니라 객체의 속성이나 변수를 넣는게 낫다.
    // 객체를 넣는다면 비교하는게 힘들다.


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
              userId: id,
              password,
              nickname: nick,
            },
        });

    }, [id, nick, password, passwordCheck, term]);


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


    // 사용자가 로그인 상태라면 회원가입 페이지가 안보이게
    // SSR를 하기 때문에 me가 있을 경우, 없을 경우가 있다.
    // CSR를 하게 되면 me가 없다가 LOAD_USER_REQUEST로 나중에 유저 정보를 받아 왔다면
    // 로그인을 했더라도 다시 요청을 하기 때문에 잠깐 동안 me가 없을 수 있다.
    if(me){
        return null;
    }


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
                           onChange={onChangePasswordCheck} />
                    {passwordError && <div style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</div>}
                </div>

                <div>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
                    {termError && <div style={{color: 'red'}}>약관에 동의하셔야 합니다.</div>}
                </div>

                <div style={{marginTop: 10}}>
                    <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
                </div>
            </Form>
        </>
    );
};
export default Signup;