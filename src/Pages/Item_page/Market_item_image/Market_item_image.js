import React, { useState, useEffect } from 'react';
import './Market_item_image.css';
import Example_img from './image/Example_img.png';
import { getAuth } from 'firebase/auth';
import { db } from "../../../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';

{/* 개별 상품 이미지와 가격을 표시하는 컴포넌트 */}
const MarketItemImage = ({ imageUrl, price, itemId, onClick }) => {
    return (
        <div className="market-item-image-container" onClick={onClick} style={{ cursor: 'pointer' }}>
            <img
                src={imageUrl || Example_img}
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

{/* 전체 상품 그리드를 표시하는 컴포넌트 */}
const MarketItemGrid = ({ sellerId }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellerItems = async () => {
            try {
                setLoading(true);

                {/* 판매자 ID 결정 - 제공된 ID 또는 현재 로그인 사용자 */}
                const uid = sellerId || (auth.currentUser ? auth.currentUser.uid : null);

                if (!uid) {
                    setError("판매자 ID를 가져올 수 없습니다.");
                    setLoading(false);
                    return;
                }

                console.log("판매자 ID:", uid);

                {/* 데이터베이스에서 상품 데이터 가져오기 */}
                const itemsRef = ref(db, "items");
                const snapshot = await get(itemsRef);

                if (!snapshot.exists()) {
                    setItems([]);
                    setTotalItems(0);
                    setLoading(false);
                    return;
                }

                {/* 재귀적으로 판매자의 상품 찾기 */}
                const findSellerItems = (node, path) => {
                    let results = [];

                    if (typeof node !== 'object' || node === null || Array.isArray(node)) {
                        return results;
                    }

                    {/* 현재 노드가 해당 판매자의 상품인지 확인 */}
                    if (node.uid === uid) {
                        {/* 상품 ID 추출 (경로의 마지막 부분) */}
                        const pathParts = path.split('/');
                        const itemId = pathParts[pathParts.length - 1];

                        results.push({
                            ...node,
                            id: itemId,
                            path: path
                        });
                    }

                    {/* 모든 자식 노드를 재귀적으로 검색 */}
                    for (const key in node) {
                        const childResults = findSellerItems(node[key], `${path}/${key}`);
                        results = [...results, ...childResults];
                    }

                    return results;
                };

                {/* 판매자의 상품 검색 시작 */}
                const sellerItems = findSellerItems(snapshot.val(), "items");
                console.log("판매자 상품:", sellerItems);

                {/* 검색된 상품이 없는 경우 처리 */}
                if (sellerItems.length === 0) {
                    setItems([]);
                    setTotalItems(0);
                    setLoading(false);
                    return;
                }

                {/* 상품 정보 가공 및 포맷팅 */}
                const processedItems = sellerItems.map((item) => {
                    {/* 가격 정보 처리 */}
                    let price = 0;
                    if (item.price && item.price.price) {
                        price = parseInt(item.price.price);
                    } else if (item.extraInfo && item.extraInfo.price) {
                        price = parseInt(item.extraInfo.price);
                    }

                    {/* 이미지 URL 처리 */}
                    let imageUrl = null;
                    if (Array.isArray(item.images) && item.images.length > 0) {
                        imageUrl = item.images[0];
                        if (imageUrl === "이미지 url" || !imageUrl) {
                            imageUrl = Example_img;
                        }
                    } else {
                        imageUrl = Example_img;
                    }

                    return {
                        id: item.id,
                        name: item.name || "상품명 없음",
                        price: price,
                        imageUrl: imageUrl,
                        path: item.path
                    };
                });

                {/* 전체 상품 수 설정 */}
                setTotalItems(processedItems.length);

                {/* 최대 6개 상품만 표시 (그리드 레이아웃에 맞게) */}
                setItems(processedItems.slice(0, 6));
                setLoading(false);
            } catch (error) {
                console.error("판매자 상품 가져오기 오류:", error);
                setError("상품을 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            }
        };

        fetchSellerItems();
    }, [sellerId, auth.currentUser]);

    {/* 상품 클릭 이벤트 핸들러 - 상품 상세 페이지로 이동 */}
    const handleItemClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    {/* 더 보기 버튼 클릭 핸들러 - 판매자 상점 페이지로 이동 */}
    const handleViewMore = () => {
        navigate(`/store/${sellerId || auth.currentUser?.uid}`);
    };

    {/* 로딩 중 상태 표시 */}
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>상품 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    {/* 에러 상태 표시 */}
    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <p>{error}</p>
            </div>
        );
    }

    {/* 상품이 없을 때 표시 */}
    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>등록된 상품이 없습니다.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="market-item-grid">
                <div className="market-items-container">
                    {items.map((item) => (
                        <div key={item.id} className="market-item">
                            <MarketItemImage
                                imageUrl={item.imageUrl}
                                price={item.price}
                                itemId={item.id}
                                onClick={() => handleItemClick(item.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* 상품이 6개 이상일 때 더보기 버튼 표시 */}
            {totalItems > 6 && (
                <div className="Market-item-button" onClick={handleViewMore}>
                    <span className="Market-item-button-text1">{totalItems}개</span>
                    <span className="Market-item-button-text2">상품 더보기</span>
                </div>
            )}
        </div>
    );
};

export default MarketItemGrid;