import React, { useState } from "react";
import { MdStore } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";
import "./StoreInfo.css";

const StoreInfo = () => {
    // 상태 변수 추가
    const [editing, setEditing] = useState(false); // 소개글 수정 모드 여부
    const [introText, setIntroText] = useState(""); // 소개글 텍스트
    const [saved, setSaved] = useState(false); // 저장된 상태 관리

    // 소개글 수정 모드 토글
    const handleEditClick = () => {
        if (editing) {
            setSaved(true); // 저장 후 상태 변경
        }
        setEditing(!editing); // 수정 모드 토글
    };

    // 소개글 내용 변경 처리
    const handleChange = (event) => {
        setIntroText(event.target.value);
    };

    return (
        <section className="store-info">
            <div className="store-header">
                <div className="store-image"></div>
                <div className="store-details">
                    <div className="store-title">
                        <h1>상점명</h1>
                        <button className="store-modify">상점명 수정</button>
                    </div>
                    <div className="store-details2">
                        <MdStore style={{ color: "orange", fontSize: "20px", marginRight: "10px" }} />
                        <p style={{ color: "gray" }}>상점오픈일 0 일 전</p>&nbsp;&nbsp;&nbsp;&nbsp;
                        <FaPerson style={{ color: "darkblue", fontSize: "20px", marginRight: "10px" }} />
                        <p style={{ color: "gray" }}>상점방문수 0 명</p>&nbsp;&nbsp;&nbsp;&nbsp;
                        <IoCart style={{ color: "green", fontSize: "20px", marginRight: "10px" }} />
                        <p style={{ color: "gray" }}>상품판매 0회</p>
                    </div>
                    {/* 소개글 작성 부분 */}
                    <div className="intro-section">
                        {editing ? (
                            <>
                                <textarea
                                    className={`intro-input ${saved ? "saved" : ""}`}
                                    value={introText}
                                    onChange={handleChange}
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
                    <button className="introduction-modify" onClick={handleEditClick}>
                        {editing ? "저장" : "소개글 수정"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StoreInfo;
