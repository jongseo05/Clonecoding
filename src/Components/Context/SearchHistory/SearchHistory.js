import React, { useState, useEffect, useRef } from 'react';
import './SearchHistory.css';

function SearchHistory({ onSelectQuery }) {
    // 최근 검색어 상태 관리
    const [recentSearches, setRecentSearches] = useState([
        '여자 패딩', '안녕하세요', '향수', '휴대폰', '알림', '○ ○ ○','여자 패딩', '안녕하세요', '향수', '휴대폰', '알림', '○ ○ ○'
    ]);

    // 인기 검색어 상태 관리 (실제로는 API에서 가져올 데이터)
    const [popularSearches, setPopularSearches] = useState([
        '패딩', '롱패딩', '몽클레어', '노스페이스', '롱코트', '가방', '에어팟', '아이폰'
    ]);

    // 현재 활성화된 탭 (최근검색어/인기검색어)
    const [activeTab, setActiveTab] = useState('recent');

    // 검색어 삭제 기능
    const removeSearch = (index) => {
        const updatedSearches = [...recentSearches];
        updatedSearches.splice(index, 1);
        setRecentSearches(updatedSearches);

        // 로컬 스토리지 업데이트 (실제 구현 시)
        // localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    // 검색어 전체 삭제
    const clearAllSearches = () => {
        setRecentSearches([]);
        // localStorage.removeItem('recentSearches');
    };

    // 검색어 선택 시 실행되는 함수
    const handleSelectSearch = (query) => {
        if (onSelectQuery) {
            onSelectQuery(query);
        }
    };

    // 탭 변경 처리
    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="SearchHistory_container">
            {/* 탭 메뉴 */}
            <div className="SearchHistory_tabs">
                <button
                    className={`SearchHistory_tab ${activeTab === 'recent' ? 'active' : ''}`}
                    onClick={() => changeTab('recent')}
                >
                    최근검색어
                </button>
                <button
                    className={`SearchHistory_tab ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => changeTab('popular')}
                >
                    인기검색어
                </button>
            </div>

            {/* 검색어 목록 영역 */}
            <div className="SearchHistory_content">
                {activeTab === 'recent' ? (
                    // 최근 검색어 목록
                    <div className="SearchHistory_list">
                        {recentSearches.length > 0 ? (
                            <>
                                {recentSearches.map((search, index) => (
                                    <div key={index} className="SearchHistory_item">
                                        <div
                                            className="SearchHistory_query"
                                            onClick={() => handleSelectSearch(search)}
                                        >
                                            {search}
                                        </div>
                                        <button
                                            className="SearchHistory_delete"
                                            onClick={() => removeSearch(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

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
                            </>
                        ) : (
                            <div className="SearchHistory_empty">
                                최근 검색어가 없습니다.
                            </div>
                        )}
                    </div>
                ) : (
                    // 인기 검색어 목록
                    <div className="SearchHistory_list">
                        {popularSearches.map((search, index) => (
                            <div key={index} className="SearchHistory_item">
                                <div
                                    className="SearchHistory_query"
                                    onClick={() => handleSelectSearch(search)}
                                >
                                    {search}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchHistory;