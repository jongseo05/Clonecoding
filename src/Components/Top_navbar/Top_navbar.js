import './Top_navbar.css';
import React, { useState, useEffect } from 'react';
import Logo from './logo.png';
import Star from './star.png';
import Login_modal from '../Login_Register/Login_modal'; // Login_modal 컴포넌트 가져오기
import { auth } from "../../firebase"; // Firebase 인증 객체 가져오기
import { signOut } from "firebase/auth"; // 로그아웃 함수 가져오기

function Top_navbar() {
    const [stateLoginModal, setOpenLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

    // 로그인 상태 확인
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user); // 로그인 여부를 상태로 설정
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 제거
    }, []);

    const openLoginModal = () => {
        setOpenLoginModal(true);
    };

    const closeLoginModal = () => {
        setOpenLoginModal(false);
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("로그아웃 되었습니다.");
            setIsLoggedIn(false); // 상태 업데이트
        } catch (error) {
            console.error("Logout failed:", error);
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="Top_navbar_section">
            <div className="Top_navabar_main_container">
                {/* 앱 다운로드, 즐겨찾기 버튼 */}
                <div className="Top_navbar_content_container">
                    <div className="Content_section">
                        {/* 앱 다운로드 */}
                        <div className="Button_section">
                            <div className="Image_section">
                                <img src={Logo} alt="logo" className="Image" />
                            </div>
                            <div className="Text_section">
                                <p>앱 다운로드</p>
                            </div>
                        </div>

                        {/* 즐겨찾기 */}
                        <div className="Button_section">
                            <div className="Image_section">
                                <img src={Star} alt="logo" className="Image" />
                            </div>
                            <div className="Text_section">
                                <p>즐겨찾기</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 로그인/회원가입 또는 로그아웃 */}
                <div className="Top_navbar_content_container">
                    {isLoggedIn ? (
                        <button className="Login_Text_button" onClick={handleLogout}>
                            로그아웃
                        </button>
                    ) : (
                        <button className="Login_Text_button" onClick={openLoginModal}>
                            로그인/회원가입
                        </button>
                    )}
                    <div className="Login_Text_section">
                        <p className="Text_section">내 상점</p>
                    </div>
                </div>
            </div>

            {/* Login_modal 표시 */}
            {stateLoginModal && (
                <Login_modal onClose={closeLoginModal} />
            )}
        </div>
    );
}

export default Top_navbar;
