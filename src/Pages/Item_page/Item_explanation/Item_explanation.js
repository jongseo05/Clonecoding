import './Item_explanation.css';
import React, { useState, useEffect } from 'react';
import Location_icon from './Images/location.png';
import Category_icon from './Images/Category.png';
import Tag_icon from './Images/Tag.png';
import Market_icon from './Images/Market.png';
import Follow_button from "../Button/Follow_button/Follow_button";
import Market_item_image from "../Market_item_image/Market_item_image";
import Lightning_talk_button_size from "../Button/Lightning_talk_button/Lightning_talk_button_size";
import Purchase_button_size from "../Button/Purchase_button/Purchase_button_size";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";

function Item_explanation({ item }) {
    const [marketName, setMarketName] = useState("상점명");

    useEffect(() => {
        // 판매자 ID가 있을 경우 상점명 가져오기
        const fetchMarketName = async () => {
            if (item && item.seller && item.seller.uid) {
                try {
                    const sellerId = item.seller.uid;
                    const marketRef = ref(db, `markets/${sellerId}/marketName`);
                    const snapshot = await get(marketRef);

                    if (snapshot.exists()) {
                        setMarketName(snapshot.val());
                    }
                } catch (error) {
                    console.error("상점명 가져오기 오류:", error);
                }
            }
        };

        fetchMarketName();
    }, [item]);

    return (
        <div className="Item_explanation_section">
            <div className="Item_explanation_other_section"/>

            {/*상품 설명*/}
            <div className="Item_explanation_container">
                <div className="Item_explanation_head1_box">
                    <span className="Item_explanation_container_text">상품정보</span>
                </div>

                <div className="Item_explanation_box1">
                    <span className="Item_explanation_text">
                        {item.description || "상품 설명이 없습니다."}
                    </span>
                </div>

                <div className="Item_explanation_box2">
                    {/*직거래 위치 정보*/}
                    <div className="Item_info_box2">
                        <div className="Item_info_box2_head">
                            <img src={Location_icon} className="Item_info_icon" alt="위치"/>
                            <span className="Item_info_text">직거래 위치</span>
                        </div>

                        <div className="Item_info_box2_text">
                            {item.extraInfo && item.extraInfo.location ?
                                item.extraInfo.location :
                                item.extraInfo && item.extraInfo.tradeOption === "직거래_가능" ?
                                    "직거래 가능 (장소 문의)" : "직거래 불가"}
                        </div>
                    </div>

                    {/*카테고리 정보*/}
                    <div className="Item_info_box2">
                        <div className="Item_info_box2_head">
                            <img src={Category_icon} className="Item_info_icon" alt="카테고리"/>
                            <span className="Item_info_text">카테고리</span>
                        </div>

                        <div className="Item_info_box2_text">
                            {item.category ?
                                `${item.category.main || ""} > ${item.category.sub || ""} > ${item.category.small || ""}` :
                                "카테고리 정보 없음"}
                        </div>
                    </div>

                    {/*상품 태그*/}
                    <div className="Item_info_box2" style={{borderRight: "none"}}>
                        <div className="Item_info_box2_head">
                            <img src={Tag_icon} className="Item_info_icon" alt="태그"/>
                            <span className="Item_info_text">태그</span>
                        </div>

                        <div className="Item_info_box2_text">
                            {Array.isArray(item.tags) && item.tags.length > 0 ?
                                item.tags.join(", ") :
                                "태그 정보 없음"}
                        </div>
                    </div>
                </div>
            </div>

            {/*상점 정보*/}
            <div className="Market_info_section">
                <div className="Market_info_head1_box">
                    <span>상점 정보</span>
                </div>

                {/*상점 정보*/}
                <div className="Market_info_container">
                    <img src={Market_icon} className="Market_info_icon" alt="상점"/>

                    <div className="Market_info_box">
                        <span className="Market_info_head">
                            {marketName || "상점명"}
                        </span>
                        <span className="Market_info_text">
                            {"상품 정보 | 팔로워"}
                        </span>
                    </div>
                </div>

                {/*상점 팔로우 버튼*/}
                <Follow_button
                    targetUserId={item.seller && item.seller.uid ? item.seller.uid : null}
                    followersCount={0}
                />


                {/*상점 상품 이미지*/}
                <div className="Market_image_section">
                    <Market_item_image sellerId={item.seller && item.seller.uid ? item.seller.uid : null}/>
                </div>

                <div className="Market_button_section">
                    <Lightning_talk_button_size/>
                    <Purchase_button_size/>
                </div>
            </div>
        </div>
    );
}

export default Item_explanation;