import React, { useState, useEffect } from 'react';
import categoriesData from '../../../Data/categories.json'; // 카테고리 데이터
import relatedKeywordsData from '../../../Data/related_items.json'; // 관련 검색어 데이터
import './SearchHistory.css';

function SearchHistory({ onSelectQuery, searchInput }) {

    const [recentSearches, setRecentSearches] = useState([]);


    const [popularSearches, setPopularSearches] = useState([
        '패딩', '롱패딩', '몽클레어', '노스페이스', '롱코트', '가방', '에어팟', '아이폰'
    ]);

    // 활성화된 탭 (최근검색어/인기검색어)
    const [activeTab, setActiveTab] = useState('recent');

    // 카테고리 경로 검색 결과
    const [categoryPaths, setCategoryPaths] = useState([]);

    // 연관 검색어 결과
    const [relatedKeywords, setRelatedKeywords] = useState([]);

    // 카테고리 데이터 구조를 JSON에서 동적으로 변환
    const categoryData = {};
    Object.entries(categoriesData).forEach(([mainCategory, subCategories]) => {
        categoryData[mainCategory] = {};
        Object.entries(subCategories).forEach(([subCategory, smallCategories]) => {
            categoryData[mainCategory][subCategory] = {};
            smallCategories.forEach(smallCategory => {
                categoryData[mainCategory][subCategory][smallCategory] = true;
            });
        });
    });

    // 컴포넌트 마운트 시와 검색창 포커스시 로컬 스토리지에서 최근 검색어 로드
    useEffect(() => {
        loadRecentSearches();
    }, []);

    // 로컬 스토리지에서 최근 검색어 로드 함수
    const loadRecentSearches = () => {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    };

    // 검색어 변경 시 결과 업데이트
    useEffect(() => {
        if (searchInput && searchInput.trim() !== '') {
            const keyword = searchInput.trim().toLowerCase();

            // 1. 카테고리 경로 찾기
            const paths = [];
            Object.entries(categoriesData).forEach(([mainCategory, subCategories]) => {
                Object.entries(subCategories).forEach(([subCategory, smallCategories]) => {
                    smallCategories.forEach(smallCategory => {
                        if (smallCategory.toLowerCase().includes(keyword)) {
                            paths.push({
                                path: `${mainCategory} > ${subCategory} > ${smallCategory}`,
                                icon: 'category'
                            });
                        }
                    });
                });
            });

            // 상점 검색 추가
            paths.push({
                path: `상점검색 > ${keyword} 상점명으로 검색`,
                icon: 'shop'
            });

            setCategoryPaths(paths);

            // 2. 연관 검색어 찾기
            const related = [];

            // 모든 메인 카테고리 순회
            Object.entries(relatedKeywordsData).forEach(([mainCategory, subCategories]) => {
                // 모든 중간 카테고리 순회
                Object.entries(subCategories).forEach(([subCategory, smallCategories]) => {
                    // 모든 소분류 카테고리 순회
                    Object.entries(smallCategories).forEach(([smallCategory, keywords]) => {
                        // 해당 소분류 카테고리의 관련 검색어 중 입력된 키워드와 일치하는 것 찾기
                        keywords.forEach(keywordObj => {
                            if (keywordObj.text.toLowerCase().includes(keyword)) {
                                related.push(keywordObj);
                            }
                        });
                    });
                });
            });

            setRelatedKeywords(related);
        } else {
            setCategoryPaths([]);
            setRelatedKeywords([]);
        }
    }, [searchInput]);

    // 탭 변경 핸들러
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // 검색어 선택 시 실행되는 함수 - 최근 검색어에 추가
    const handleSelectQuery = (query) => {
        addToRecentSearches(query);

        // 부모 컴포넌트로 검색어 전달
        if (onSelectQuery) {
            onSelectQuery(query);
        }
    };

    // 최근 검색어에 검색어 추가
    const addToRecentSearches = (query) => {
        // 이미 있는 검색어인 경우 제거
        const filteredSearches = recentSearches.filter(item => item !== query);

        // 최신 검색어를 배열 앞에 추가
        const updatedSearches = [query, ...filteredSearches].slice(0, 20); // 최대 20개 유지

        // 상태 및 로컬 스토리지 업데이트
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    // 검색어 삭제 기능
    const removeSearch = (index, event) => {
        event.stopPropagation(); // 클릭 이벤트 전파 방지

        const updatedSearches = [...recentSearches];
        updatedSearches.splice(index, 1);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    // 검색어 전체 삭제
    const clearAllSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    // 카테고리 아이콘
    const renderIcon = (iconType) => {
        if (iconType === 'shop') {
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z" fill="#999999"/>
                    <path d="M8 4.25C7.0375 4.25 6.25 5.0375 6.25 6C6.25 6.9625 7.0375 7.75 8 7.75C8.9625 7.75 9.75 6.9625 9.75 6C9.75 5.0375 8.9625 4.25 8 4.25Z" fill="#999999"/>
                    <path d="M8 8.5C6.39688 8.5 5.09375 9.80313 5.09375 11.4062V11.75H10.9062V11.4062C10.9062 9.80313 9.60313 8.5 8 8.5Z" fill="#999999"/>
                </svg>
            );
        } else {
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 3H2C1.44772 3 1 3.44772 1 4V12C1 12.5523 1.44772 13 2 13H14C14.5523 13 15 12.5523 15 12V4C15 3.44772 14.5523 3 14 3Z" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5 8H11.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        }
    };

    return (
        <div className="SearchHistory_container">
            {/* 검색어가 없는 경우: 최근 검색어/인기 검색어 탭 표시 */}
            {!searchInput || searchInput.trim() === '' ? (
                <>
                    {/* 탭 메뉴 */}
                    <div className="SearchHistory_tabs">
                        <button
                            className={`SearchHistory_tab ${activeTab === 'recent' ? 'active' : ''}`}
                            onClick={() => handleTabChange('recent')}
                        >
                            최근검색어
                        </button>
                        <button
                            className={`SearchHistory_tab ${activeTab === 'popular' ? 'active' : ''}`}
                            onClick={() => handleTabChange('popular')}
                        >
                            인기검색어
                        </button>
                    </div>

                    {activeTab === 'recent' ? (
                        <div className="SearchHistory_content_wrapper">
                            {/* 최근 검색어 목록 - 스크롤 영역 */}
                            <div className="SearchHistory_scrollable_list">
                                {recentSearches.length > 0 ? (
                                    recentSearches.map((search, index) => (
                                        <div
                                            key={index}
                                            className="SearchHistory_item"
                                            onClick={() => handleSelectQuery(search)}
                                        >
                                            <div className="SearchHistory_query">
                                                {search}
                                            </div>
                                            <button
                                                className="SearchHistory_delete"
                                                onClick={(e) => removeSearch(index, e)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="SearchHistory_empty">
                                        최근 검색어가 없습니다.
                                    </div>
                                )}
                            </div>

                            {/* 하단 버튼 영역 - 스크롤 영역 밖에 고정 */}
                            {recentSearches.length > 0 && (
                                <div className="SearchHistory_footer">
                                    <button
                                        className="SearchHistory_clear"
                                        onClick={clearAllSearches}
                                    >
                                        <span className="SearchHistory_clear_icon">🗑️</span>
                                        <span>검색어 전체삭제</span>
                                    </button>
                                    <button className="SearchHistory_close">
                                        <span>닫기</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // 인기 검색어 목록
                        <div className="SearchHistory_list">
                            {popularSearches.map((search, index) => (
                                <div
                                    key={index}
                                    className="SearchHistory_item"
                                    onClick={() => handleSelectQuery(search)}
                                >
                                    <div className="SearchHistory_query">
                                        {search}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="SearchSuggestions_container">
                    {/* 카테고리 경로 섹션 */}
                    {categoryPaths.length > 0 && (
                        <div className="SearchSuggestions_category_section">
                            {categoryPaths.map((item, index) => (
                                <div
                                    key={index}
                                    className="SearchSuggestions_item"
                                    onClick={() => handleSelectQuery(item.path.split(' > ').pop())}
                                >
                                    {renderIcon(item.icon)}
                                    <div className="SearchSuggestions_text">
                                        {item.path}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 관련 검색어 섹션 */}
                    {relatedKeywords.length > 0 && (
                        <div className="SearchSuggestions_keywords_section">
                            {relatedKeywords.map((item, index) => (
                                <div
                                    key={index}
                                    className="SearchSuggestions_item"
                                    onClick={() => handleSelectQuery(item.text)}
                                >
                                    <div className="SearchSuggestions_text">
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchHistory;