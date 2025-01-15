import './Img_uploader.css';
import Camera from './Image/Camera.png'
import React from 'react';

function Img_uploader({ onImageUpload }) {
    return (
        <div className="Img_uploader">
            <input
                type="file"
                accept="image/*"
                className="Img_uploader_input"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        onImageUpload(file);
                    }
                }}
            />
            <div className="Img_uploader_icon_section">
                <img className="Img_uploader_icon" src= {Camera} alt="Camera Icon" />
                <p className="Img_uploader_icon_text">이미지 등록</p>
            </div>
        </div>
    );
}

export default Img_uploader;
