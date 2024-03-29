import {useCallback, useState, useEffect, useRef} from "react";
import {Form, Input, Button} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {ADD_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST} from '../reducers/post';


const PostForm = () => {
    console.log('### front/components/PostForm ... ###');

    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const {imagePaths, isAddingPost, postAdded} = useSelector(state => state.post);
    const imageInput = useRef();

    useEffect(() => {

        setText('')
    }, [postAdded]);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        // 게시글이 없을 때 알림창
        // 트림을 하는 이유는 스페이스바 치는 사람들이 있기 떄문이다.
        if (!text || !text.trim()) {
            return alert('게시글을 작성하세요.');
        }

        const formData = new FormData();
        // 폼데이터의 단점은 하나씩 append를 해줘야한다.
        imagePaths.forEach((i) => {
            formData.append('image', i); // 텍스트 값
        });

        formData.append('content', text);
        console.log('### front/components/PostForm... formData', formData ,' ###');
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });

    }, [text, imagePaths]);

    const onChangeText = useCallback((e) => {

        setText(e.target.value);
    }, []);

    // 라벨을 클릭했을 때 인풋 창을 연다.
    const onClickImageUpload = useCallback(() => {
        // 이미지 업로드 버튼을 눌렀을 때,
        // <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages}/> 을 누른 효과가 나게해준다.
        imageInput.current.click();
    }, [imageInput.current]);


    // 이미지를 업로드 했을 때 실행된다.
    const onChangeImages = useCallback((e) => {
        console.log('### front/components/PostForm... onChangeImages... e.target.files:', e.target.files, ' ###');

        // encType="multipart/form-data"를 사용했기 때문에
        // 이 객체를 생성해서 이미지 파일을 하나씩 넣어줘야한다.
        const imageFormData = new FormData();

        console.log('### front/components/PostForm... dispatch... ###');
        // 원래는 submit하면 서버로 전송되는데 여기서는 바로 보내지 않고
        // SPA 유지를 하기 위해서 ajax로 보내게 된다.
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });

        console.log('### front/components/PostForm... [].forEach.call()... ###');
        [].forEach.call(e.target.files, (f) => {
            // ajax로 요청을 보내기 때문에 key, key 형태로 생성해야한다.
            imageFormData.append('image', f);
        });
    }, []);

    // 고차함수는 HOC처럼 기존 함수 기능을 확장한다.
    // REMOVE_IMAGE는 이미지 제거만 하는것이기 때문에 비동기가 아니라 동기이다.
    const onRemoveImage = useCallback(index => () => {
        dispatch({
            type: REMOVE_IMAGE,
            index,
        });
    }, []);

    return (
        // 이미지, 동영상, 파일 : multipart/form-data
        <Form encType="multipart/form-data" style={{margin: '10px 20px'}} onSubmit={onSubmitForm}>

            <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText}/>

            <div>
                <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages}/>
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost}>짹짹</Button>
            </div>

            <div>
                {imagePaths.map((v, i) => (

                    <div key={v} style={{display: 'inline-block'}}>
                        <img src={`http://localhost:8080/${v}`} style={{width: '200px'}} alt={v}/>
                        <div>
                            <Button onClick={onRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;