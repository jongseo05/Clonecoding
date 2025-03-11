import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";

// 단일 카드 컴포넌트
function CardItem({ item }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    // 타임스탬프를 "n시간전" 또는 "n개월 전" 형식으로 변환하는 함수
    const getTimeAgo = (timestamp) => {
        if (!timestamp) return "시간 정보 없음";

        const now = new Date().getTime();
        const postedTime = timestamp;
        const diffHours = Math.floor((now - postedTime) / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);

        if (diffHours < 1) {
            return "방금 전";
        } else if (diffHours < 24) {
            return `${diffHours}시간전`;
        } else if (diffDays < 30) {
            return `${diffDays}일 전`;
        } else {
            return `${diffMonths}달 전`;
        }
    };

    // 가격 포맷팅 함수 (예: 120000 -> 120,000)
    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 이미지 로드 성공 처리
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // 이미지 로드 실패 처리
    const handleImageError = () => {
        console.error("이미지 로드 실패:", item.imageUrl?.substring(0, 50) + "...");
        setImageError(true);
    };

    // 카드 클릭 핸들러
    const handleCardClick = () => {
        // 경로에서 상품 ID 추출
        const pathSegments = item.id.split('/');
        const mainCategory = pathSegments[1] || "";
        const subCategory = pathSegments[2] || "";
        const smallCategory = pathSegments[3] || "";
        const userId = pathSegments[4] || "";
        const itemUID = pathSegments[5] || "";

        // 유효한 경로가 있을 경우에만 이동
        if (itemUID) {
            console.log("상품 상세 페이지로 이동:", itemUID);
            navigate(`/item/${mainCategory}/${subCategory}/${smallCategory}/${userId}/${itemUID}`);
        }
    };

    return (
        <div
            className="ItemCard_section"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="ItemCard_container">
                <div className="ItemCard_img_section">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            className="ItemCard_img"
                            alt={item.name}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            style={{ display: imageError ? 'none' : 'block' }}
                        />
                    ) : null}

                    {/* 이미지 로딩 중이거나 없을 때 */}
                    {(!item.imageUrl || imageError) && (
                        <div className="ItemCard_img" style={{
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <p>예약중</p>
                        </div>
                    )}
                </div>

                <div className="ItemCard_text_section">
                    <div className="ItemCard_title_section">
                        <p className="ItemCard_text_title">{item.name}</p>
                    </div>

                    <div className="ItemCard_info_section">
                        <div className="ItemCard_price_section">
                            <p className="ItemCard_price_text">{formatPrice(item.price)}</p>
                            <p className="ItemCard_price_text">원</p>
                        </div>

                        <div className="ItemCard_time_section">
                            <p className="ItemCard_time_text">{getTimeAgo(item.timestamp)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardItem;