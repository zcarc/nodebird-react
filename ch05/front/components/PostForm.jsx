import {useCallback, useState, useEffect} from "react";
import {Form, Input, Button} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {ADD_POST_REQUEST} from '../reducers/post';


const PostForm = () => {

    console.log('PostForm component...');
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const {imagePaths, isAddingPost, postAdded} = useSelector(state => state.post);

    useEffect(() => {

        setText('')
    }, [postAdded === true]);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        dispatch({
            type: ADD_POST_REQUEST,
            data: {
                content: text,
            },
        });

    }, [text]);

    const onChangeText = useCallback((e) => {

        setText(e.target.value);
    }, []);

    return (
        <Form encType="multipart/form-data" style={{margin: '10px 20px'}} onSubmit={onSubmitForm}>

            <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText}/>

            <div>
                <input type="file" multiple hidden/>
                <Button>이미지 업로드</Button>
                <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost}>짹짹</Button>
            </div>

            <div>
                {imagePaths.map((v) => (

                    <div key={v} style={{display: 'inline-block'}}>
                        <img src={`http://localhost:3000/${v}`} style={{width: '200px'}} alt={v}/>
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;