import React, { useState, useEffect } from 'react';
import './ProductTab.css';
import { getDatabase, ref, get } from 'firebase/database';
import CardItem from '../../../../Components/Card/CardItem';
import { getAuth } from 'firebase/auth';

const ProductsTab = ({ userId, isOwnMarket = false }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            try {
                console.log("상품 데이터 불러오기 시작, 사용자 ID:", userId);
                const db = getDatabase();
                const allProducts = [];

                // items 전체 데이터 가져오기
                const itemsRef = ref(db, 'items');
                const snapshot = await get(itemsRef);

                if (!snapshot.exists()) {
                    console.log("상품 데이터가 없습니다.");
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const itemsData = snapshot.val();

                const processCategories = (data, path = ['items']) => {
                    if (!data || typeof data !== 'object') return;

                    // 현재 경로에서 UserID 찾기
                    if (path.length > 1 && data[userId] && typeof data[userId] === 'object') {
                        const userProducts = data[userId];

                        // 각 상품 처리
                        Object.keys(userProducts).forEach(productId => {
                            const productData = userProducts[productId];

                            if (productData && productData.name) {
                                // 상품 정보 추출
                                let imageUrl = null;

                                // 이미지 URL 처리
                                if (productData.images) {
                                    if (Array.isArray(productData.images) && productData.images.length > 0) {
                                        imageUrl = productData.images[0];
                                    } else if (typeof productData.images === 'object') {
                                        // 객체 형태의 이미지 처리
                                        if (productData.images.main) {
                                            imageUrl = productData.images.main;
                                        } else {
                                            const imgKeys = Object.keys(productData.images);
                                            if (imgKeys.length > 0) {
                                                imageUrl = productData.images[imgKeys[0]];
                                            }
                                        }
                                    }
                                }

                                // 가격 정보 추출
                                let price = "0";
                                if (productData.price && productData.price.price) {
                                    price = productData.price.price;
                                } else if (productData.extraInfo && productData.extraInfo.price) {
                                    price = productData.extraInfo.price;
                                } else if (typeof productData.price === 'string' || typeof productData.price === 'number') {
                                    price = productData.price;
                                }

                                const product = {
                                    id: [...path, userId, productId].join('/'),
                                    name: productData.name || "상품명 없음",
                                    price: price,
                                    timestamp: productData.createdAt || parseInt(productId) || Date.now(),
                                    imageUrl: imageUrl,
                                    status: productData.status || "판매중"
                                };

                                console.log(`상품 발견: ${product.name}, 경로: ${product.id}`);
                                allProducts.push(product);
                            }
                        });
                    }

                    // 더 깊은 수준 탐색 (다른 카테고리 내 사용자 상품 찾기)
                    Object.keys(data).forEach(key => {
                        processCategories(data[key], [...path, key]);
                    });
                };

                // 데이터 탐색 시작
                processCategories(itemsData);

                console.log(`총 ${allProducts.length}개의 상품을 발견했습니다.`);

                // 최신순으로 정렬
                allProducts.sort((a, b) => b.timestamp - a.timestamp);

                setProducts(allProducts);
            } catch (error) {
                console.error("상품 데이터 로드 오류:", error);
                setError(`데이터 로딩 실패: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userId]);

    // 로딩 중 표시
    if (loading) {
        return <div className="empty-product-message"><p>상품을 불러오는 중입니다...</p></div>;
    }

    // 오류 발생 시 표시
    if (error) {
        return <div className="empty-product-message"><p>{error}</p></div>;
    }

    // 상품이 없는 경우
    if (!products || products.length === 0) {
        return (
            <div className="empty-product-message">
                <p>{isOwnMarket ? '업로드 하신 상품이 없습니다.' : '등록된 상품이 없습니다.'}</p>
            </div>
        );
    }

    // 상품 목록 표시c
    return (
        <div className="products-tab-container">


            {/* 상품 탭 */}
            <div className = "products-tab-header">

                <div className="products-tab-header-title">
                    <span className = "products-tab-header-text">상품</span>
                    <span className = "products-tab-header-count">{products.length}</span>
                </div>

                <div className="products-tab-header-filter">

                </div>

            </div>


            <div className="products-grid">
                {products.map((product, index) => (
                    <CardItem key={product.id || index} item={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductsTab;