import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";

function Card({ itemPath }) {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: "상품명",
        price: "0",
        timestamp: 0,
        imageUrl: null,
        path: {
            mainCategory: "",
            subCategory: "",
            smallCategory: "",
            userId: "",
            productId: ""
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            // 기본 경로 또는 전달된 itemPath 사용
            const dbPath = itemPath || "items/여성의류/아우터/패딩/u80SJtpEEFTe4QyTCcAvBZYjpdE3/1737952559018";

            // 경로 분석하여 상품 상세 페이지 이동에 사용할 정보 추출
            const pathParts = dbPath.split('/');
            const pathInfo = {
                mainCategory: pathParts[1] || "",
                subCategory: pathParts[2] || "",
                smallCategory: pathParts[3] || "",
                userId: pathParts[4] || "",
                productId: pathParts[5] || ""
            };

            // Firebase Realtime Database 경로 설정
            const itemRef = ref(db, dbPath);

            // 데이터 가져오기
            onValue(itemRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Firebase 데이터:", data);

                if (data) {
                    // 가져온 데이터로 상태 업데이트
                    const newProductData = {
                        name: data.name || "상품명 없음",
                        price: data.price?.price || data.extraInfo?.price || "0",
                        timestamp: parseInt(pathInfo.productId) || Date.now(),
                        imageUrl: data.images?.main || getFirstImage(data.images) || null,
                        path: pathInfo
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
    }, [itemPath]);

    // 첫 번째 이미지 URL 가져오는 헬퍼 함수
    const getFirstImage = (imagesObj) => {
        if (!imagesObj) return null;

        // 이미지가 객체인 경우 첫 번째 이미지 반환
        if (typeof imagesObj === 'object') {
            const keys = Object.keys(imagesObj);
            if (keys.length > 0) {
                return imagesObj[keys[0]];
            }
        }

        return null;
    };

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

    // 상품 클릭 시 상세 페이지로 이동
    const handleCardClick = () => {
        const { mainCategory, subCategory, smallCategory, userId, productId } = productData.path;
        if (mainCategory && subCategory && smallCategory && userId && productId) {
            navigate(`/item/${mainCategory}/${subCategory}/${smallCategory}/${userId}/${productId}`);
        }
    };

    return (
        <div className="ItemCard_section" onClick={handleCardClick}>
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
                    <div className="ItemCard_title_section">
                        <p className="ItemCard_text_title">{productData.name}</p>
                    </div>

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