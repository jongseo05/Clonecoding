import './Multi_category.css'
import Major_category_button from './Major_category_button/Major_category_button'
import Multi_category_button from "./Multi_category_button/Multi_category_button";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../../firebase';
import categoriesData from '../../../Data/categories.json'; // 카테고리 데이터 import

function Multi_category() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    // 메인 카테고리와 카운트를 저장할 상태
    const [mainCategories, setMainCategories] = useState([]);
    // 전체 카테고리와 카운트를 저장할 상태
    const [allCategories, setAllCategories] = useState([]);

    // 컴포넌트 마운트 시 카테고리 정보 로드
    useEffect(() => {
        // 카테고리.json에서 메인 카테고리 추출
        const mainCategoryNames = Object.keys(categoriesData);

        // 메인 카테고리 초기 설정 (카운트는 0으로 초기화)
        const initialMainCategories = mainCategoryNames.map(name => ({
            name,
            count: '0'
        }));

        setMainCategories(initialMainCategories);

        // 검색어가 있을 경우 상품 카운트 업데이트
        if (searchQuery) {
            fetchProductCounts(initialMainCategories);
        }
    }, [searchQuery]);

    // 상품 카운트를 가져오는 함수
    const fetchProductCounts = async (initialCategories) => {
        try {
            // 전체 상품 데이터 가져오기
            const itemsRef = ref(db, 'items');
            const itemsSnapshot = await get(itemsRef);

            if (itemsSnapshot.exists()) {
                const categoryCounter = {}; // 카테고리별 상품 개수 카운팅
                const itemsData = itemsSnapshot.val();

                // 카테고리별 카운터 초기화
                initialCategories.forEach(category => {
                    categoryCounter[category.name] = 0;
                });

                // 데이터베이스에서 상품 카운팅
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
                                                        // 메인 카테고리에 해당하는 카운터 증가
                                                        if (categoryCounter[mainCategory] !== undefined) {
                                                            categoryCounter[mainCategory]++;
                                                        }
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

                // 카운트가 업데이트된 카테고리 배열 생성
                const updatedCategories = initialCategories.map(category => ({
                    name: category.name,
                    count: categoryCounter[category.name]?.toString() || '0'
                }));

                // 카운트 기준으로 내림차순 정렬
                updatedCategories.sort((a, b) => parseInt(b.count) - parseInt(a.count));

                // 상태 업데이트
                setMainCategories(updatedCategories);
                setAllCategories(updatedCategories);
            }
        } catch (error) {
            console.error('상품 데이터 가져오기 오류:', error);
        }
    };

    return (
        <div>
            <div className="Multi_category">
                {/*주요 카테고리*/}
                <div className="Major_category_section">
                    <div className="Major_category_container">
                        <div className="Major_category_title">
                            <span>카테고리</span>
                        </div>

                        <div className="Major_category_box">
                            {/* 상위 4개 메인 카테고리만 표시 */}
                            {mainCategories.slice(0, 4).map((category, index) => (
                                <Major_category_button
                                    key={index}
                                    categoryName={category.name}
                                    categoryCount={category.count}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/*전체 카테고리*/}
                <div className="Total_category_section">
                    <div className="Total_category_container">
                        {allCategories.map((category, index) => (
                            <CustomCategoryButton
                                key={index}
                                name={category.name}
                                count={category.count}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// 기존 Multi_category_button 컴포넌트를 활용하는 커스텀 버튼 컴포넌트
function CustomCategoryButton({ name, count }) {
    return (
        <button className="Multi_category_button">
            <div className="Multi_category_button_text">{name}</div>
            <div className="Multi_category_button_num">{count}</div>
        </button>
    );
}

export default Multi_category