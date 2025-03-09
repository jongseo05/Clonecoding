import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../../firebase';
import './FilteredProductList.css';
import Card from '../../../Components/Card/Card'; // 기존 Card 컴포넌트

function FilteredProductList() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // 전체 상품 데이터 가져오기
                const itemsRef = ref(db, 'items');
                const itemsSnapshot = await get(itemsRef);

                if (itemsSnapshot.exists()) {
                    const products = [];
                    const itemsData = itemsSnapshot.val();

                    // 데이터베이스 구조에 따라 상품 추출
                    Object.keys(itemsData).forEach(mainCategory => {
                        const mainCategoryData = itemsData[mainCategory];

                        if (mainCategoryData && typeof mainCategoryData === 'object') {
                            Object.keys(mainCategoryData).forEach(subCategory => {
                                const subCategoryData = mainCategoryData[subCategory];

                                if (subCategoryData && typeof subCategoryData === 'object') {
                                    Object.keys(subCategoryData).forEach(smallCategory => {
                                        const smallCategoryData = subCategoryData[smallCategory];

                                        if (smallCategoryData && typeof smallCategoryData === 'object') {
                                            Object.keys(smallCategoryData).forEach(userId => {
                                                const userProducts = smallCategoryData[userId];

                                                if (userProducts && typeof userProducts === 'object') {
                                                    Object.keys(userProducts).forEach(productId => {
                                                        const productData = userProducts[productId];

                                                        // 검색어 필터링
                                                        if (searchQuery) {
                                                            const productName = productData.name?.toLowerCase() || '';
                                                            const productDesc = productData.description?.toLowerCase() || '';
                                                            const productTags = productData.tags || [];
                                                            const searchLower = searchQuery.toLowerCase();

                                                            const matchesName = productName.includes(searchLower);
                                                            const matchesDesc = productDesc.includes(searchLower);
                                                            const matchesTags = productTags.some(tag =>
                                                                tag.toLowerCase().includes(searchLower)
                                                            );
                                                            const matchesCategory =
                                                                mainCategory.toLowerCase().includes(searchLower) ||
                                                                subCategory.toLowerCase().includes(searchLower) ||
                                                                smallCategory.toLowerCase().includes(searchLower);

                                                            if (matchesName || matchesDesc || matchesTags || matchesCategory) {
                                                                // 상품 경로 저장
                                                                products.push({
                                                                    id: productId,
                                                                    path: `items/${mainCategory}/${subCategory}/${smallCategory}/${userId}/${productId}`
                                                                });
                                                            }
                                                        } else {
                                                            // 검색어가 없으면 전체 상품 추가
                                                            products.push({
                                                                id: productId,
                                                                path: `items/${mainCategory}/${subCategory}/${smallCategory}/${userId}/${productId}`
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });

                    // 최신순으로 정렬 (ID가 타임스탬프인 경우)
                    products.sort((a, b) => parseInt(b.id) - parseInt(a.id));

                    setTotalCount(products.length);
                    setFilteredProducts(products);
                }
            } catch (error) {
                console.error('상품 데이터 가져오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]);

    return (
        <div className="FilteredProductList_section">
            {searchQuery && (
                <div className="FilteredProductList_header">
                    <h2 className="FilteredProductList_title">"{searchQuery}" 검색 결과</h2>
                    <p className="FilteredProductList_count">전체 {totalCount}개</p>
                </div>
            )}

            {loading ? (
                <div className="FilteredProductList_loading">상품을 불러오는 중입니다...</div>
            ) : (
                <>
                    {filteredProducts.length > 0 ? (
                        <div className="Card_container">
                            {/* 기존 Card 컴포넌트 사용 */}
                            {filteredProducts.map((product) => (
                                <Card key={product.id} itemPath={product.path} />
                            ))}
                        </div>
                    ) : (
                        <div className="FilteredProductList_empty">
                            <p>"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
                            <p>다른 검색어를 입력해보세요.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FilteredProductList;