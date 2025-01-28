import React, { useState } from "react";
import "./TabContent.css";
import { SlArrowDown } from "react-icons/sl";

const TabContent = ({ activeTab }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("전체");

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };

    const dropdownOptions = ["전체", "최신순", "인기순", "고가순", "저가순"];

    return (
        <section className="product-section">
            {activeTab === "상품" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p className="tab-title-large">상품 0</p>
                        <div className="custom-dropdown">
                            <div className="custom-dropdown-selected" onClick={toggleDropdown}>
                                <span>{selectedOption}</span>
                                <SlArrowDown className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`} />
                            </div>
                            {isDropdownOpen && (
                                <ul className="custom-dropdown-options">
                                    {dropdownOptions.map((option, index) => (
                                        <li
                                            key={index}
                                            className="custom-dropdown-option"
                                            onClick={() => handleOptionClick(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
                    <p style={{ color: "gray", textAlign: "left", fontSize: "14px", marginTop: "30px" }}>
                        찜한 상품이 없습니다.
                    </p>
                </div>
            )}
        </section>
    );
};

export default TabContent;
