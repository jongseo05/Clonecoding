import React, { useState } from "react";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import ProductManagement from "./productManagement";
import "./SellPage.css";

function SellPage() {
    // State for active tab
    const [activeTab, setActiveTab] = useState("register");

    // Function to handle tab click
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container">
            {/* 상단 네비게이션 */}
            <Top_navbar />

            {/* 컨텍스트 네비게이션 */}
            <Context />

            {/* 탭 네비게이션 */}
            <div className="sell-tab-navigation">
                <button
                    className={activeTab === "register" ? "tab active" : "tab"}
                    onClick={() => handleTabClick("register")}
                >
                    상품등록
                </button>
                <p style={{color: "gray"}}>|</p>
                <button
                    className={activeTab === "manage" ? "tab active" : "tab"}
                    onClick={() => handleTabClick("manage")}
                >
                    상품관리
                </button>
            </div>

            {/* 탭 내용 */}
            <div className="sell-tab-content">
                {activeTab === "register" && (
                    <div>
                        <p>상품 등록 페이지</p>
                    </div>
                )}

                {activeTab === "manage" && <ProductManagement />}
            </div>
        </div>
    );
}

export default SellPage;
