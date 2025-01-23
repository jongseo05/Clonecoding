import './Sell_page.css';
import React, { useState,useEffect } from 'react';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import Img_uploader from "./Img_uploader/Img_uploader";
import Category_selecter from "./Category/Category";
import Item_description from "./Item_description/Item_description";
import Tag_selecter from './Tag/Tag';
import Item_status from './Item_status/Item_status';
import Item_price from "./Item_price/Item_price";
import Package from "./Package/Package";
import Extra_information from "./Extra_information/Extra_information";
import Buttons from './buttons/buttons';
import Temporary_save_modal from "./buttons/Temporary_save_modal/Temporary_save_modal";

function Sell_page() {

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem("sellPageFormData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData) {
                    console.log("Stored data is existed")
                    setShowModal(true); // 데이터가 존재하면 모달 표시
                }
            } catch (error) {
                console.error("Error parsing saved data:", error);
            }
        }
    }, []);

    {/*새로 등록 함수*/}
    const handleNewRegister = () => {

        localStorage.removeItem("sellPageFormData"); // localstorage 초기화
        setFormData({
            Category: { mainCategory: "", subCategory: "", smallCategory: "" },
            extraInfo: { quantity: "", tradeOption: "직거래_유무" },
            name: "",
            images: [],
            description: "",
            price: { price: "", allowNegotiation: false },
            status: "",
            package: { package_price: "" },
            tags: [],
        });

    };

    // "이어서 하기" 동작
    const handleContinue = () => {
        const savedData = localStorage.getItem("sellPageFormData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setFormData(parsedData); // 저장된 데이터를 formData에 반영
            } catch (error) {
                console.error("Error parsing saved data:", error);
            }
        }
    };


    const [formData, setFormData] = useState({
        Category: {
            mainCategory: "",
            subCategory: "",
            smallCategory: ""
        },
        extraInfo: {
            quantity: "",
            tradeOption: "직거래_유무",
        },
        name: "",
        images: [],
        description: "",
        price: {
            price: "",
            allowNegotiation: false,
        },
        status: "",
        package: {
            package_price: "",
        },
        tags: [],
    });




    const handleImageUpload = (file) => {
        if (!file) return;

        if (formData.images.length < 12) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    images: [...prevFormData.images, reader.result],
                }));
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
            {showModal && (
                <Temporary_save_modal
                    onClose={setShowModal}
                    onNewRegister={handleNewRegister}
                    onContinue={handleContinue} />
            )}
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

                    {/* 물건 사진 업로드 */}
                    <div className="Item_info_section">
                        <div className="Item_img_upload_section">
                            <div className="Item_img_upload_text_section">
                                <p className="Item_img_upload_head2">상품이미지</p>
                                <p className="Item_img_count_text">
                                    ({formData.images.length}/12)
                                </p>
                            </div>

                            <div className="Grid">
                                <div className="Item_img_section uploaded-images-grid">
                                    {formData.images.length < 12 && (
                                        <Img_uploader
                                            onImageUpload={handleImageUpload} />
                                    )}
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="uploaded-image-container">
                                            <img
                                                src={image}
                                                alt={`Uploaded ${index + 1}`}
                                                className="uploaded-image"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="Img_upload_detaiil_section">
                                    <p className="Img_upload_detail_text">
                                        상품 이미지는 PC에서는 1:1, 모바일에서는 1:1.23 비율로 보여져요
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 상품명 입력 */}
                    <div className="Item_name_section">
                        <div className="Item_name_head2_section">
                            <p className="Item_name_head2">상품명</p>
                        </div>

                        <div className="Item_name_input_section">
                            <input className="Item_name_input"
                                   placeholder="상품명을 입력해주세요"
                                   value={formData.name}
                                   onChange={(e) => {
                                       const inputValue = e.target.value;
                                       if (inputValue.length <= 40) {
                                           setFormData((prevFormData) => ({
                                               ...prevFormData,
                                               name: inputValue,
                                           }));
                                       }
                                   }}
                            />
                            <p className="Item_name_count">{formData.name.length}/40</p>
                        </div>
                    </div>

                    {/* 카테고리 입력 */}
                    <Category_selecter
                        formDataCategory={formData.Category}
                        onCategoryChange={(main, sub, small) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                Category: {
                                    mainCategory: main,
                                    subCategory: sub,
                                    smallCategory: small
                                },
                            }));
                        }}
                    />

                    {/* 상품 상태 입력 */}
                    <Item_status
                        formDataStatus={formData.status}
                        onStatusChange={(statusValue) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                status: statusValue,
                            }));
                        }}
                    />

                    {/* 상품 설명 입력 */}
                    <Item_description
                        formDataDescription={formData.description} // 초기값 전달
                        onDescriptionChange={(description) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                description: description,
                            }));
                        }}
                    />


                    {/* 태그 입력 */}
                    <Tag_selecter
                        onTagsChange={(tags) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                tags: tags,
                            }));
                        }}
                    />

                    {/* 상품 가격 입력 */}
                    <Item_price
                        formDataPrice={formData.price}
                        onPriceChange={({ price, allowNegotiation }) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                price: {
                                    price: price,
                                    allowNegotiation: allowNegotiation,
                                },
                            }));
                        }}
                    />

                    {/* 택배거래 입력 */}
                    <Package
                        formDataPackage={formData.package}
                        onPackageChange={(packageOption) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                package: { ...prevFormData.package, packageOption },
                            }));
                        }}/>

                    {/* 추가정보 입력 */}
                    <Extra_information
                        formExtraInformation={formData.extraInfo}
                        onExtraInfoChange={(extraInfo) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                extraInfo: extraInfo,
                            }));
                        }}
                    />
                </div>
            </div>

            <Buttons formData={formData} />

        </div>
    );
}

export default Sell_page;
