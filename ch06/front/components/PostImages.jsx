import React, {useState, useCallback} from 'react';
import PropTypes, {shape} from 'prop-types';
import {Icon} from "antd";
import ImagesZoom from "./ImagesZoom";

const PostImages = ({images}) => {

    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    if (images.length === 1) {
        return (
            <>
                <img src={`http://localhost:8080/${images[0].src}`} onClick={onZoom}/>

                {/*이미지 확대를 끄는것은 컴포넌트 내에서 한다.*/}
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose}/>}
            </>
        );
    }

    if (images.length === 2) {
        return (
            <>
                <div>
                    <img src={`http://localhost:8080/${images[0].src}`} width={"50%"} onClick={onZoom}/>
                    <img src={`http://localhost:8080/${images[1].src}`} width={"50%"} onClick={onZoom}/>
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose}/>}
            </>
        );
    }


    return (
        <>
            <div>
                <img src={`http://localhost:8080/${images[0].src}`} width={"50%"} onClick={onZoom}/>
                <div style={{display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle'}}
                     onClick={onZoom}>
                    <Icon type="plus"/>
                    <br/>
                    {images.length - 1}
                    개의 사진 더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose}/>}
        </>
    );
};


PostImages.propTypes = {
    // Proptypes.shape(): Object를 구체화
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
    })).isRequired,
};

export default PostImages;



