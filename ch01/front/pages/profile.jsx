import React from 'react';
import { Form, Input, Button, List, Card, Icon } from 'antd';

const Profile = () => {

    console.log('Profile() component...');

    return (
        <div>

            <Form style={{ marginBottom: '20px', borfer: '1px solid #d9d9d9', padding: '20px' }}>
                <Input addonBefore="닉네임" />
                <Button type="primary">수정</Button>
            </Form>

            <List
                style={{ marginBottom: '20px' }}
                grid={{ gutter: 4, xs: 2, md: 3 }}
                size="small"
                header={<div>팔로잉 목록</div>}
                loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
                bordered
                dataSource={['트위터', '페이스북', '카밀라 카베요']}
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px' }}>
                        <Card actions={[<Icon type="stop" />]}>
                            <Card.Meta description={item} />
                        </Card>
                    </List.Item>
                )}
            />

            <List
                style={{ marginBottom: '20px' }}
                grid={{ gutter: 4, xs: 2, md: 3 }}
                size="small"
                header={<div>팔로워 목록</div>}
                loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
                bordered
                dataSource={['트위터', '페이스북', '카밀라 카베요']}
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px' }}>
                        <Card actions={[<Icon type="stop" />]}>
                            <Card.Meta description={item} />
                        </Card>
                    </List.Item>
                )}
            />

        </div>
    );
};

export default Profile;