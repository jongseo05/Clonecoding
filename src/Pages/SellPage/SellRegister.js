import React from "react";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import SellTabs from "./SellTabs"; // SellTabs import
import "./SellRegister.css";

function SellRegister() {
    return (
        <div className="container">
            {/* 상단 네비게이션 */}
            <Top_navbar />

            {/* 컨텍스트 네비게이션 */}
            <Context />

            {/* 탭 네비게이션 */}
            <SellTabs />

            {/* 페이지 내용 */}
            <div className="sell-tab-content">
                <p>상품 등록 페이지</p>
            </div>
        </div>
    );
}

export default SellRegister;
