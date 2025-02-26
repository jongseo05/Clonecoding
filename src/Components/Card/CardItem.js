import React, { useState } from "react";
import "./Card.css";

// 단일 카드 컴포넌트
function CardItem({ item }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

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
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Base64 이미지 유효성 확인
    const isValidBase64Image = (url) => {
        if (!url) return false;
        return url.startsWith('data:image/');
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

    const hasValidImage = item.imageUrl && isValidBase64Image(item.imageUrl);

    return (
        <div className="ItemCard_section">
            <div className="ItemCard_container">
                <div className="ItemCard_img_section">
                    {hasValidImage ? (
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
                    {(!hasValidImage || imageError) && (
                        <div className="ItemCard_img" style={{
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <p>이미지 준비중</p>
                        </div>
                    )}
                </div>

                <div className="ItemCard_text_section">
                    <p className="ItemCard_text_title">{item.name}</p>

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