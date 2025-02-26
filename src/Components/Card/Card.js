import React, { useState, useEffect } from "react";
import "./Card.css";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";

function Card() {
    const [productData, setProductData] = useState({
        name: "상품명",
        price: "0",
        timestamp: 0,
        imageUrl: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            // Firebase Realtime Database 경로 설정
            const itemRef = ref(db, "items/여성의류/아우터/패딩/u80SJtpEEFTe4QyTCcAvBZYjpdE3/1737952559018");

            // 데이터 가져오기
            onValue(itemRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Firebase 데이터:", data);

                if (data) {
                    // 가져온 데이터로 상태 업데이트
                    const newProductData = {
                        name: data.name || "여자 패딩 예시 상품 입니다.",
                        price: data.extraInfo?.price || "120000",
                        timestamp: data.timestamp || Date.now(),
                        imageUrl: data.images?.main || null
                    };

                    setProductData(newProductData);
                }
                setLoading(false);
            }, {
                onlyOnce: true
            });
        } catch (error) {
            console.error("Firebase 데이터 불러오기 오류:", error);
            setLoading(false);
        }
    }, []);

    // 타임스탬프를 "n시간전" 형식으로 변환하는 함수
    const getTimeAgo = (timestamp) => {
        if (!timestamp) return "시간 정보 없음";

        const now = new Date().getTime();
        const postedTime = timestamp;
        const diffHours = Math.floor((now - postedTime) / (1000 * 60 * 60));

        if (diffHours < 1) {
            return "방금 전";
        } else if (diffHours < 24) {
            return `${diffHours}시간전`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}일 전`;
        }
    };

    // 가격 포맷팅 함수 (예: 120000 -> 120,000)
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="ItemCard_section">
            <div className="ItemCard_container">
                <div className="ItemCard_img_section">
                    {loading ? (
                        <div className="ItemCard_img" style={{ backgroundColor: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <p>로딩중...</p>
                        </div>
                    ) : productData.imageUrl ? (
                        <img src={productData.imageUrl} className="ItemCard_img" alt="상품 이미지" />
                    ) : (
                        <div className="ItemCard_img" style={{ backgroundColor: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <p>이미지 준비중</p>
                        </div>
                    )}
                </div>

                <div className="ItemCard_text_section">
                    <p className="ItemCard_text_title">{productData.name}</p>

                    <div className="ItemCard_info_section">
                        <div className="ItemCard_price_section">
                            <p className="ItemCard_price_text">{formatPrice(productData.price)}</p>
                            <p className="ItemCard_price_text">원</p>
                        </div>

                        <div className="ItemCard_time_section">
                            <p className="ItemCard_time_text">{getTimeAgo(productData.timestamp)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;