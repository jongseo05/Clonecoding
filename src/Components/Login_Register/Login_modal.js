import React from "react";
import { Link } from "react-router-dom";
import "./Login_modal.css";
import Logo from './img/Logo.png';
import Kakao from './img/kakaotalki_icon.png';
import Naver from './img/naver_icon.png';
import Phone from './img/phone_icon.png';
import { createPortal } from "react-dom";

const Login_modal = ({ onClose }) => {

    {/* 배경 클릭 시 모달 닫기 */}
    const handleBackgroundClick = (e) => {
        if (e.target.className === "Login_back") {
            onClose(false);
        }
    };

    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) {
        console.error("#modal-root not found in DOM");
        return null; // modal-root가 없으면 렌더링하지 않음
    }

    return createPortal(
        <div className="Login_back" onClick={handleBackgroundClick}>
            <div className="Login_modal" onClick={(e) => e.stopPropagation()}>
                {/* 로고 */}
                <img src={Logo} alt="번개장터 로고" className="Login_logo" />

                {/* 제목 */}
                <div className="Login_title_section">
                    <p className="Login_title">번개장터로 중고거래 시작하기</p>
                </div>

                {/* 설명 */}
                <div className="Login_explain_section">
                    <p className="Login_explain">간편하게 가입하고 상품을 확인하세요</p>
                </div>

                {/* 로그인 버튼들 */}
                <div className="Login_button_section">
                    {/* 카카오 로그인 버튼 */}
                    <div className="Login_button">
                        <img src={Kakao} className="Login_button_img" alt="카카오" />
                        <p className="Login_button_text">카카오 로그인</p>
                    </div>
                    {/* 네이버 로그인 버튼 */}
                    <div className="Login_button">
                        <img src={Naver} className="Login_button_img" alt="네이버" />
                        <p className="Login_button_text">네이버 로그인</p>
                    </div>
                    {/* 일반 로그인 버튼 */}
                    <Link to="/sign_up" className="Login_button">
                        <img src={Phone} className="Login_button_img" alt="일반" />
                        <p className="Login_button_text">일반 로그인</p>
                    </Link>
                </div>

                <div className="Login_info_section">
                    <p className="Login_info_text">
                        도움이 필요하면 이메일 또는 고객센터1670-2910로 문의 부탁드립니다.
                    </p>
                </div>
            </div>
        </div>,
        modalRoot // HTML의 modal-root 요소에 렌더링
    );
};

export default Login_modal;