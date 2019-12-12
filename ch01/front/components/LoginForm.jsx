import { useCallback } from 'react';
import Link from 'next/link';
import { Input, Button, Form } from 'antd';
import {useInput} from '../pages/signup';

const LoginForm = () => {

    console.log('LoginForm() component...');
    
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        console.log({
            id, password,
        });

    }, [id, password]);


    return (
        <Form onSubmit={onSubmitForm} style={{ padding: '10px' }}>
            <div>
                <lable htmlFor="user-id">아이디</lable>
                <br />
                <Input name="user-id" value={id} onChange={onChangeId} required></Input>
            </div>

            <div>
                <lable htmlFor="user-password">패스워드</lable>
                <br />
                <Input name="user-password" value={password} onChange={onChangePassword} type="password" required></Input>
            </div>

            <div>
                <Button htmlType="submit" type="primary" loading={false}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </div>
        </Form>
    );
};

export default LoginForm;