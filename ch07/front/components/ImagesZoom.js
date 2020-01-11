import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Icon} from 'antd';
import PostImages from "./PostImages";
import Slick from 'react-slick'; // 이미지 슬라이더 역할

const ImagesZoom = ({images, onClose}) => {
    console.log('### front/components/ImagesZoom... ###');

    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <div style={{ position: 'fixed', zIndex: 5000, top: 0, left: 0, right: 0, bottom: 0 }}>
            <header style={{ height: 44, background: 'white', potision: 'relative', padding: 0, textAlign: 'center' }}>
                <h1 style={{margin: 0, fontSize: '17px', color: '#333', lineHeight: '44px' }}>상세 이미지</h1>
                <Icon type="close" onClick={onClose} style={{ position: 'absolute', right: 0, top: 0, padding: 15, lineHeight: '14px', cursor: 'pointer' }}/>
            </header>

            <div style={{ height: 'calc(100% - 44px)', background: '#090909'}}>
                <div>
                    <Slick
                        // 초기 슬라이드 설정
                        initialSlide={0}
                        // 슬라이드 할 때 마다 인덱스 변경
                        afterChange={slide => setCurrentSlide(slide)}
                        // 무한 슬라이드
                        infinite={false}
                        // 화살표
                        arrows
                        // 한번에 보여질 개수
                        slidesToShow={1}
                        // 한번에 스크롤할 개수
                        slidesToScroll={1}
                    >
                        {/*반복문 안에 이미지 반복문을 넣어두면 알아서 이미지 슬라이더로 바뀐다.*/}
                        {images.map((v) => {
                            return (
                                <div style={{ padding: 32, textAlign: 'center' }}>
                                    <img src={`http://localhost:8080/${v.src}`} style={{ margin: '0 auto', maxHeight: 750 }}/>
                                </div>
                            );
                        })}
                    </Slick>

                    {/*몇번째 이미지인지 표시*/}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 75, height: 30, lineHeight: '30px', borderRadius: 15, background: '#313131', display: 'inline-block', textAlign: 'center', color: 'white', fontSize: '15px' }}>{currentSlide + 1} / {images.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ImagesZoom.propTypes = {
    // Proptypes.shape(): Object를 구체화
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
    })).isRequired,

    onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;