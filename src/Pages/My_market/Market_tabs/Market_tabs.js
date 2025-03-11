import React, { useState } from 'react';
import './Market_tabs.css';
import ProductsTab from './ProductTab/ProductTab';
import { useParams } from 'react-router-dom';

const Market_tabs = ({ marketData, isOwnMarket }) => {

    {/* url에서 userID 파싱*/}
    const { userId: urlUserId } = useParams();
    const userId = urlUserId || marketData.userId;

    // 현재 선택된 탭 상태
    const [activeTab, setActiveTab] = useState('상품');

    // 각 탭별 카운트 정보
    const tabsInfo = [
        { name: '상품', count: marketData.products ? marketData.products.length : 0 },
        { name: '상점후기', count: marketData.reviews ? marketData.reviews.length : 0 },
        { name: '찜', count: marketData.likes || 0 },
        { name: '팔로잉', count: marketData.following || 0 },
        { name: '팔로워', count: marketData.followers || 0 }
    ];

    // 탭 변경 핸들러
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    // 선택된 탭에 따른 컨텐츠 렌더링
    const renderTabContent = () => {
        switch (activeTab) {
            case '상품':
                return <ProductsTab userId={userId} isOwnMarket={isOwnMarket} />;
            case '상점후기':
                return (
                    <div className="empty-tab-content">
                        <p>상점후기가 없습니다.</p>
                    </div>
                );
            case '찜':
                return (
                    <div className="empty-tab-content">
                        <p>찜 목록이 없습니다.</p>
                    </div>
                );
            case '팔로잉':
                return (
                    <div className="empty-tab-content">
                        <p>팔로잉 목록이 없습니다.</p>
                    </div>
                );
            case '팔로워':
                return (
                    <div className="empty-tab-content">
                        <p>팔로워 목록이 없습니다.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="market-tabs-container">
            {/* 탭 네비게이션 */}
            <div className="market-tabs">
                {tabsInfo.map((tab) => (
                    <button
                        key={tab.name}
                        className={`tab-button ${activeTab === tab.name ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.name)}
                    >
                        {tab.name} <span className="tab-count">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* 탭 내용 컨테이너 */}
            <div className="tab-content-container">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Market_tabs;