import React from "react";
import "./Tabs.css";

const Tabs = ({ activeTab, handleTabClick }) => (
    <nav className="tabs">
        <div
            className={`tab-item ${activeTab === "상품" ? "active" : ""}`}
            onClick={() => handleTabClick("상품")}
        >
            상품 0
        </div>
        <div
            className={`tab-item ${activeTab === "상점후기" ? "active" : ""}`}
            onClick={() => handleTabClick("상점후기")}
        >
            상점후기 0
        </div>
        <div
            className={`tab-item ${activeTab === "찜" ? "active" : ""}`}
            onClick={() => handleTabClick("찜")}
        >
            찜 0
        </div>
    </nav>
);

export default Tabs;
