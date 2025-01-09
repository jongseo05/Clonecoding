import './Top_navbar.css';
import React from 'react';
import Logo from './logo.png';
import Star from './star.png';
import Login_modal from '../Login_Register/Login_modal'; // Login_modal 컴포넌트 가져오기

function Top_navbar() {

    const [stateLoginModal, setOpenLoginModal] = React.useState(false);

    const openLoginModal = () => {
        setOpenLoginModal(true);
        console.log("openLoginModal");
    }

    const closeLoginModal = () => {
        setOpenLoginModal(false);
        console.log("closeLoginModal");
    }

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

                {/* 로그인, 회원가입 */}
                <div className="Top_navbar_content_container">
                    <button className="Login_Text_button" onClick={openLoginModal}>
                        로그인/회원가입
                    </button>
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
