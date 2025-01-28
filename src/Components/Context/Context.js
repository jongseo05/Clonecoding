import React from "react";
import { Link } from "react-router-dom";
import './Context.css';
import HomeLogo from './Home.png';
import Sold from './Sold.png';
import my_store from './my_store.png';
import talk from './talk.png';
import Dropdown_black from './dropdown.png';

function Context() {
    return (
        <div className="Context_section">
            <div className="Context_main_container">

                <div className="Info1_section">

                    {/* 메인 로고 */}
                    <div className="Title_section">
                        <img src={HomeLogo} alt="logo" className="Homelogo" />
                    </div>

                    {/* 검색 */}
                    <div className="Search_section">
                        <input className="Search_input" type="text" placeholder="상품명, 지역명, @상점명 입력" />
                    </div>

                    <div className="User_section">

                        {/* 판매하기 */}
                        <div className="User_container">
                            <div className="Link_section">
                                <Link to="/sell/register">
                                    <img src={Sold} alt="Sold_icon" className="User_container_img" />
                                    <p className="User_container_text">판매하기</p>
                                </Link>
                            </div>
                        </div>

                        {/* 내 상점 */}
                        <div className="User_container">
                            <div className="Link_section">
                                <Link to="/mymarket">
                                    <img src={my_store} alt="Store_icon" className="User_container_img" />
                                    <p className="User_container_text">내상점</p>
                                </Link>
                            </div>
                        </div>

                        {/* 번개톡 */}
                        <div className="User_container">
                            <div className="Link_section">
                                <Link to="/lightningtalk">
                                    <img src={talk} alt="Talk_icon" className="User_container_img" />
                                    <p className="User_container_text">번개톡</p>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="Info2_section">
                    <div className="Context_dropdown_img_section">
                        <img src={Dropdown_black} alt="Search_icon" />
                    </div>
                    <p className="Context_text_bold">번개장터 판매자센터</p>
                </div>

            </div>
        </div>
    );
}

export default Context;