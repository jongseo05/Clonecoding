import React from "react";
import { IoSearch, IoMenuOutline } from "react-icons/io5";
import "./Header.css";

const Header = () => (
    <header className="header">
        <div className="column">
            <div className="logo">
                <img src="/public/logo.png" alt="번개장터" className="logo-image" />
            </div>
            <div className="header2">
                <IoMenuOutline style={{ color: "black", fontSize: "40px" }} />
            </div>
        </div>
        <div className="search-bar">
            <input
                className="search-input"
                type="text"
                placeholder="상품명, 지역명, @상점명 입력"
            />
            <button className="search-button">
                <IoSearch style={{ color: "red", fontSize: "20px" }} />
            </button>
        </div>
    </header>
);

export default Header;
