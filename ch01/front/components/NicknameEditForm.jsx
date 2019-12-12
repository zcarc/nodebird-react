import { Button, Form, Input } from 'antd';

const NicknameEditForm = () => {

    console.log('NicknameEditForm component...');

    return (

        <Form style={{ marginBottom: '20px', borfer: '1px solid #d9d9d9', padding: '20px' }}>
            <Input addonBefore="닉네임" />
            <Button type="primary">수정</Button>
        </Form>

    );
};

export default NicknameEditForm;