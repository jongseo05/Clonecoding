import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Context.css';
import HomeLogo from './Home.png';
import Search from './Search.png';
import Sold from './Sold.png';
import my_store from './my_store.png';
import talk from './talk.png';
import Dropdown_black from './dropdown.png';
import SearchHistory from './SearchHistory/SearchHistory';

function Context() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();

    // 검색창 외부 클릭 감지
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainerRef]);

    // 검색 입력 처리
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // 검색 폼 제출 처리 - 최근 검색어에 추가하고 검색 페이지로 이동
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // 검색어 로컬 스토리지에 저장
            saveRecentSearch(searchQuery.trim());

            // 검색 페이지로 이동하면서 쿼리 파라미터 전달
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchFocused(false);
        }
    };

    // 검색창 포커스 처리
    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    // 최근 검색어 저장 - 로컬 스토리지 활용
    const saveRecentSearch = (query) => {
        // 로컬 스토리지에서 기존 검색어 불러오기
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

        // 중복 제거
        const filteredSearches = recentSearches.filter(item => item !== query);

        // 최근 검색어를 앞에 추가
        const updatedSearches = [query, ...filteredSearches].slice(0, 20); // 최대 20개 유지

        // 로컬 스토리지에 저장
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    // 검색어 선택 처리 - 자동완성이나 최근/인기 검색어 선택 시
    const handleSelectQuery = (query) => {
        setSearchQuery(query);
        saveRecentSearch(query);
        navigate(`/search?query=${encodeURIComponent(query)}`);
        setIsSearchFocused(false);
    };

    return(
        <div className="Context_section">
            <div className="Context_main_container">

                <div className="Info1_section">

                    {/*메인 로고*/}
                    <div className="Title_section">
                        <Link to="/">
                            <img src={HomeLogo} alt="logo" className="Homelogo"/>
                        </Link>
                    </div>

                    {/*검색*/}
                    <div className="Search_section" ref={searchContainerRef}>
                        <form onSubmit={handleSearchSubmit} className="Search_form">
                            <input
                                className="Search_input"
                                type="text"
                                placeholder="상품명,지역명,@상점명 입력"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                            />
                            <button type="submit" className="Search_button">
                                <img src={Search} alt="Search_icon" className="Search_Icon" />
                            </button>
                        </form>

                        {/* 검색창 포커스 시 최근/인기 검색어 또는 검색 제안 표시 */}
                        {isSearchFocused && (
                            <SearchHistory
                                onSelectQuery={handleSelectQuery}
                                searchInput={searchQuery}
                            />
                        )}
                    </div>

                    <div className="User_section">

                        {/*판매하기*/}
                        <div className="User_container">
                            <div className="Link_section">
                                <img src={Sold} alt="Sold_icon" className="User_container_img"/>
                                <Link to='/sell_page' className="User_container_text">판매하기</Link>
                            </div>
                        </div>

                        {/*내 상점*/}
                        <div className="User_container">
                            <div className="Link_section">
                                <img src={my_store} alt="Store_icon" className="User_container_img"/>
                                <Link to='my_market' className="User_container_text">내상점</Link>
                            </div>
                        </div>

                        {/*번개톡*/}
                        <div className="User_container">
                            <div className="Link_section">
                                <img src={talk} alt="Talk_icon" className="User_container_img"/>
                                <Link to='lightning-talk' className="User_container_text">번개톡</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Info2_section">
                    <div className="Context_dropdown_img_section">
                        <img src={Dropdown_black} alt="Search_icon"/>
                    </div>
                    <p className="Context_text_bold">번개장터 판매자센터</p>
                </div>
            </div>
        </div>
    );
}

export default Context;