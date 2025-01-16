import React from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import "./TopBar.css";

const TopBar = ({ isAlertDropdownVisible, setAlertDropdownVisible, isStoreDropdownVisible, setStoreDropdownVisible }) => (
    <div className="top-bar">
        <button className="top-bar-button">로그아웃</button>

        <div
            className="top-bar-button"
            onMouseEnter={() => setAlertDropdownVisible(true)}
            onMouseLeave={() => setAlertDropdownVisible(false)}
        >
            알림<RiArrowDropDownFill style={{ color: "black" }} />
            {isAlertDropdownVisible && (
                <div className="dropdown-menu">
                    <p className="dropdown-item">알림 1</p>
                </div>
            )}
        </div>

        <div
            className="top-bar-button"
            onMouseEnter={() => setStoreDropdownVisible(true)}
            onMouseLeave={() => setStoreDropdownVisible(false)}
        >
            내 상점<RiArrowDropDownFill style={{ color: "black" }} />
            {isStoreDropdownVisible && (
                <div className="dropdown-menu">
                    <p className="dropdown-item">내 상품</p>
                    <p className="dropdown-item">찜한 상품</p>
                    <p className="dropdown-item">구매 내역</p>
                </div>
            )}
        </div>
    </div>
);

export default TopBar;
