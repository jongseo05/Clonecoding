import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Search_page.css';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from '../../Components/Context/Context';
import Multi_category from './Multi_category/Multi_category';
import FilteredProductList from './FilteredProductList/FilteredProductList';

function Search_page() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';
    const mainCategory = queryParams.get('main') || '';
    const subCategory = queryParams.get('sub') || '';
    const smallCategory = queryParams.get('small') || '';

    const [showCategoryPath, setShowCategoryPath] = useState(false);

    // 카테고리 경로가 있는 경우 표시 여부 설정
    useEffect(() => {
        setShowCategoryPath(!!(mainCategory || subCategory || smallCategory));
    }, [mainCategory, subCategory, smallCategory]);

    return (
        <div className="Search_page">
            <Top_navbar />
            <Context />
            <div className="Search_page_section">
                {/* 검색어가 있을 경우 카테고리 트리와 필터링된 상품 표시 */}
                {searchQuery ? (
                    <>
                        {/* 선택된 카테고리 경로 표시 */}
                        {showCategoryPath && (
                            <div className="SelectedCategory_path">
                                <p className="SelectedCategory_text">
                                    <span className="SelectedCategory_label">선택한 카테고리:</span>
                                    <span className="SelectedCategory_main">{mainCategory}</span>
                                    {subCategory && (
                                        <>
                                            <span className="SelectedCategory_separator">&gt;</span>
                                            <span className="SelectedCategory_sub">{subCategory}</span>
                                        </>
                                    )}
                                    {smallCategory && (
                                        <>
                                            <span className="SelectedCategory_separator">&gt;</span>
                                            <span className="SelectedCategory_small">{smallCategory}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* 다중 카테고리 및 필터 옵션 표시 */}
                        <Multi_category />

                        {/* 필터링된 상품 목록 표시 */}
                        <FilteredProductList />
                    </>
                ) : (
                    /* 검색어가 없을 경우 기본 멀티 카테고리 표시 */
                    <Multi_category />
                )}
            </div>
        </div>
    );
}

export default Search_page;