import React from "react";
import "./TabContent.css";

const TabContent = ({ activeTab }) => (
    <section className="product-section">
        {activeTab === "상품" && (
            <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p className="tab-title-large">상품 0</p>
                    <select className="dropdown">
                        <option value="전체">전체</option>
                        <option value="최신순">최신순</option>
                        <option value="인기순">인기순</option>
                        <option value="고가순">고가순</option>
                        <option value="저가순">저가순</option>
                    </select>
                </div>
                <div className="tab-line"></div>
                <p style={{ color: "gray", textAlign: "left", fontSize: "14px", marginTop: "30px" }}>
                    등록된 상품이 없습니다.
                </p>
            </>
        )}
        {activeTab === "상점후기" && (
            <div>
                <p className="tab-title-large">상점후기 0</p>
                <div className="tab-line"></div>
                <p style={{ color: "gray", textAlign: "left", fontSize: "14px", marginTop: "30px" }}>
                    아직 작성된 상점후기가 없습니다.
                </p>
            </div>
        )}
        {activeTab === "찜" && (
            <div>
                <p className="tab-title-large">찜 0</p>
                <div className="tab-line"></div>
                <p style={{color: "gray", textAlign: "left", fontSize: "14px", marginTop: "30px"}}>
                    찜한 상품이 없습니다.
                </p>
            </div>
        )}
    </section>
);

export default TabContent;
