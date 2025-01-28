import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SellTabs.css";

function SellTabs() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="SellTabs">
            <div className="sell-tab-navigation">
                <button
                    onClick={() => navigate("/sell/register")}
                    className={location.pathname === "/sell/register" ? "tab active" : "tab"}
                >
                    상품등록
                </button>
                <p style={{color:"lightgray"}}>|</p>
                <button
                    onClick={() => navigate("/sell/manage")}
                    className={location.pathname === "/sell/manage" ? "tab active" : "tab"}
                >
                    상품관리
                </button>
            </div>
        </div>
    );
}

export default SellTabs;
