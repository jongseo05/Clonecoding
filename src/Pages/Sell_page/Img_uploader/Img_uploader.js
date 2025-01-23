import './Img_uploader.css';
import Camera from './Image/Camera.png'
import React, { useState,useEffect } from 'react';

function Img_uploader({ onImageUpload , initialImages}) {

    const [images, setImages] = useState(initialImages);

    useEffect(() => {
        setImages(initialImages); // 초기값 반영
    }, [initialImages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImageUpload(file); // 부모로 전달
        }
    };

    return (
        <div className="Img_uploader">
            <input
                type="file"
                accept="image/*"
                className="Img_uploader_input"
                onChange={handleFileChange}
            />
            <div className="Img_uploader_icon_section">
                <img className="Img_uploader_icon" src= {Camera} alt="Camera Icon" />
                <p className="Img_uploader_icon_text">이미지 등록</p>
            </div>
        </div>
    );
}

export default Img_uploader;
