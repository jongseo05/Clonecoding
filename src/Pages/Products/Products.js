import React from "react";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import ExImg1 from "../../Components/Card/Ex_img/Ex_img1.png";
import { IoHeartSharp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";
import { HiChatAlt } from "react-icons/hi";
import "./Products.css";

const Products = () => {
    return (
        <div className="container">
            <Top_navbar />
            <Context />
            <div className="product-content">
                <div className="image">
                    <img src={ExImg1} alt="상품 이미지" className="products-img" />
                </div>
                <div className="productsInfo">
                    <h2>아디다스 스탠스미스</h2>
                    <h1>70,000원</h1>
                    <div className="icons">
                        <IoHeartSharp/>
                        <p>15</p>
                        <IoMdEye/>
                        <p>307</p>
                        <MdAccessTimeFilled/>
                        <p>3시간 전</p>
                    </div>
                    <div className="detail">
                        <div>
                            <li>상품상태</li>
                            <p>사용감 적음</p>
                        </div>
                        <div>
                            <li>사이즈</li>
                            <p>90</p>
                        </div>
                        <div>
                            <li>배송비</li>
                            <p>일반 4,000원</p>
                        </div>
                    </div>

                    <div className="mainbutton">
                        <button className={"btn1"}>
                            <IoHeartSharp/>
                            <p>찜</p>
                            <p>15</p>
                        </button>
                        <button className={"btn2"}>
                            <HiChatAlt/>
                            <p>번개톡</p>
                        </button>
                        <button className={"btn3"}>
                            <p>바로구매</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="addition-info">
            <h3>이 상품과 비슷해요</h3>
            <p>상품정보</p>
            <p>비슷한 새 상품 보기</p>
            </div>
        </div>
    );
};

export default Products;
