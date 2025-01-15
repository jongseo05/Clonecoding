import './Sell_page.css';
import React, { useState } from 'react';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import Img_uploader from "./Img_uploader/Img_uploader";
import Category_selecter from "./Category/Category";

function Sell_page() {
    const [images, setImages] = useState([]);

    const handleImageUpload = (file) => {
        if (!file) return;

        if (images.length < 12) {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prevImages) => [...prevImages, reader.result]);
                console.log("Uploaded images:", [...images, reader.result]); // 상태 업데이트 확인
            };
            reader.onerror = (error) => {
                console.error("File reading error:", error);
            };
            reader.readAsDataURL(file);
        } else {
            alert("이미지는 최대 12개까지만 업로드할 수 있습니다.");
        }
    };

    return (
        <div>
            <Top_navbar />
            <Context />

            {/* 중간 navbar */}
            <div className="Sell_process_section">
                <div className="Sell_process_container">
                    <div className="Sell_process_text_section">
                        <div className="Sell_process_text_container">
                            <div className="Sell_process_text">상품등록</div>
                            <div className="Sell_divider"></div>
                            <div className="Sell_process_text">상품관리</div>
                            <div className="Sell_divider"></div>
                            <div className="Sell_process_text">상품구매/판매 내역</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상품등록 */}
            <div className="Item_register_section">
                <div className="Item_register_container">
                    <div className="Item_register_head1">상품정보</div>

                    {/*물건 사진 업로드*/}
                    <div className="Item_info_section">
                        <div className="Item_img_upload_section">
                            <div className="Item_img_upload_text_section">
                                <p className="Item_img_upload_head2">상품이미지</p>
                                <p className="Item_img_count_text">({images.length}/12)</p>
                            </div>

                            {/*물건 사진 업로드*/}
                            <div className = "Grid">
                                <div className="Item_img_section uploaded-images-grid">

                                    {images.length < 12 && (
                                        <Img_uploader onImageUpload={handleImageUpload} />
                                    )}
                                    {images.map((image, index) => (
                                        <div key={index} className="uploaded-image-container">
                                            <img
                                                src={image}
                                                alt={`Uploaded ${index + 1}`}
                                                className="uploaded-image"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className = "Img_upload_detaiil_section">
                                    <p className = "Img_upload_detail_text">
                                    상품 이미지는 PC에서는 1:1, 모바일에서는 1:1.23 비율로 보여져요
                                    </p>
                                </div>
                            </div>



                        </div>

                    </div>

                    {/*상품명 입력*/}
                    <div className="Item_name_section">
                        <div className = "Item_name_head2_section">
                            <p className = "Item_name_head2">
                                상품명
                            </p>
                        </div>

                        <div className="Item_name_input_section">
                            <input className = "Item_name_input" placeholder="상품명을 입력해주세요"/>
                            <p className = "Item_name_count">
                                0/40
                            </p>
                        </div>

                    </div>

                    {/*카테고리 입력*/}
                    <Category_selecter/>





                </div>
            </div>
        </div>
    );
}

export default Sell_page;
