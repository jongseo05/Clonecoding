import React, { useState } from "react";
import { MdStore } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";
import Image from '../Pages/MyMarket/image/store-image.jpg';
import { useNavigate } from "react-router-dom"; // React Router에서 useNavigate import
import "./StoreInfo.css";

const StoreInfo = () => {
    const [editingName, setEditingName] = useState(false);
    const [storeName, setStoreName] = useState("상점명");
    const [editingIntro, setEditingIntro] = useState(false);
    const [introText, setIntroText] = useState("");
    const [saved, setSaved] = useState(false);

    const navigate = useNavigate(); // useNavigate hook 사용

    const toggleEditName = () => {
        setEditingName(!editingName);
    };

    const handleNameChange = (event) => {
        setStoreName(event.target.value);
    };

    const toggleEditIntro = () => {
        if (editingIntro) {
            setSaved(true);
        }
        setEditingIntro(!editingIntro);
    };

    const handleIntroChange = (event) => {
        setIntroText(event.target.value);
    };

    const handleManageClick = () => {
        navigate("/sell/manage"); // 버튼 클릭 시 /sell로 이동
    };

    return (
        <section className="store-info">
            <div className="store-header">
                <div className="store-image">

                {/* 동그란 프로필 이미지와 버튼 */}
                <div className="store-image-container">
                    <div
                        className="store-profile-image"
                        style={{
                            backgroundImage: `url(${Image})`
                        }}
                    ></div>
                    <div className="store-name-display">
                        <p>{storeName}</p>
                    </div>
                    <button className="store-manage-btn" onClick={handleManageClick}>
                        내 상점 관리
                    </button>
                </div>
                </div>
            </div>

            <div className="store-info2">
                <div className="store-details">
                    <div className="store-title">
                        {editingName ? (
                            <div className="store-name-edit">
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={handleNameChange}
                                    placeholder="상점명을 입력하세요"
                                />
                                <button onClick={toggleEditName}>저장</button>
                            </div>
                        ) : (
                            <>
                                <h1>{storeName}</h1>
                                <button
                                    className="store-modify"
                                    onClick={toggleEditName}
                                >
                                    상점명 수정
                                </button>
                            </>
                        )}
                    </div>
                    <div className="store-details2">
                        <MdStore
                            style={{
                                color: "orange",
                                fontSize: "20px",
                                marginRight: "10px",
                            }}
                        />
                        <p style={{color: "gray"}}>상점오픈일 0 일 전</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <FaPerson
                            style={{
                                color: "darkblue",
                                fontSize: "20px",
                                marginRight: "10px",
                            }}
                        />
                        <p style={{color: "gray"}}>상점방문수 0 명</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <IoCart
                            style={{
                                color: "green",
                                fontSize: "20px",
                                marginRight: "10px",
                            }}
                        />
                        <p style={{color: "gray"}}>상품판매 0회</p>
                    </div>
                    <div className="intro-section">
                        {editingIntro ? (
                            <>
                                <textarea
                                    className={`intro-input ${
                                        saved ? "saved" : ""
                                    }`}
                                    value={introText}
                                    onChange={handleIntroChange}
                                    placeholder="여기에 소개글을 작성하세요.."
                                />
                                <div className="char-count">
                                    {introText.length} / 1000
                                </div>
                            </>
                        ) : (
                            <p>{introText || "소개글 작성"}</p>
                        )}
                    </div>
                    <button
                        className="introduction-modify"
                        onClick={toggleEditIntro}
                    >
                        {editingIntro ? "저장" : "소개글 수정"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StoreInfo;
