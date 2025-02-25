import React from 'react';
import './Market_item_image.css';
import Example_img from './image/Example_img.png';

// 개별 상품 이미지와 가격을 표시하는 컴포넌트
const MarketItemImage = ({ imageUrl, price }) => {
    return (
        <div className="market-item-image-container">
            <img
                src={imageUrl}
                alt="상품 이미지"
                className="market-item-image"
            />
            <div className="market-item-price">
                <span className="market-item-price-text">
                    {price.toLocaleString()}
                </span>
                <span className="market-item-price-text">원</span>
            </div>
        </div>
    );
};

// 전체 상품 그리드를 표시하는 컴포넌트
const MarketItemGrid = () => {
    // 상품 데이터 배열
    const items = [
        { id: 1, imageUrl: Example_img, price: 518200 },
        { id: 2, imageUrl: Example_img, price: 259100 },
        { id: 3, imageUrl: Example_img, price: 83000 },
        { id: 4, imageUrl: Example_img, price: 518130 },
        { id: 5, imageUrl: Example_img, price: 2072530 },
        { id: 6, imageUrl: Example_img, price: 85000 },
    ];

    return (
        <div>
            <div className="market-item-grid">
                <div className="market-items-container">
                    {items.map((item) => (
                        <div key={item.id} className="market-item">
                            <MarketItemImage imageUrl={item.imageUrl} price={item.price} />
                        </div>
                    ))}
                </div>
            </div>
            <div className = "Market-item-button">
                <span className = "Market-item-button-text1">12개</span>
                <span className = "Market-item-button-text2">상품 더보기</span>
            </div>
        </div>
    );
};

export default MarketItemGrid;