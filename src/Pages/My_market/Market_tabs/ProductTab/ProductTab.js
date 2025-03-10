import React from 'react';
import './ProductTab.css';

const ProductsTab = ({ products = [] }) => {
    // 상품이 없는 경우
    if (!products || products.length === 0) {
        return (
            <div className="empty-product-message">
                <p>업로드 하신 상품이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="products-tab-container">
            <div className="products-list">
                {products.map((product, index) => (
                    <div key={index} className="product-item">
                        <div className="product-image">
                            <img
                                src={product.imageUrl || '/default-product.png'}
                                alt={product.name}
                                className="product-thumbnail"
                            />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">{product.price.toLocaleString()}원</p>
                            <p className="product-time">{formatTime(product.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 시간 포맷팅 함수
const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export default ProductsTab;