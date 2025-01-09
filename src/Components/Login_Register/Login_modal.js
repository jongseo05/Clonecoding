import React from "react";
import "./Login_modal.css";
import Logo from './img/Logo.png';

const Login_modal = () => {
    return(
        <div className = "Login_modal">

            <img src={Logo} alt = "번개장터 로고" className = "Login_logo"/>
            <div className = "Login_title_section">
               <p className = "Login_title">번개장터로 중고거래 시작하기</p>
            </div>
            <div className = "Login_explain_section">
                <p className = "Login_explain"></p>
            </div>

            <div className = "Login_button_section">

                {/* 카카오 로그인 버튼 */}
                <div className = "Login_button">
                </div>

                {/* 페이스북 로그인 버튼 */}
                <div className = "Login_button">
                </div>

                {/* 네이버 로그인 버튼 */}
                <div className = "Login_button">
                </div>

                {/* 일반 로그인 버튼 */}
                <div className = "Login_button">
                </div>

            </div>

            <div className = "Login_info_section">
            </div>

        </div>
    )
}

export default Login_modal;