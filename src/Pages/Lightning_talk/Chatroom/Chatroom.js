import './Chatroom.css';
import Partner_chat_icon from '../Chating_icon/PartnerIcon/Partner_chat_icon'
import User_chat_icon from '../Chating_icon/UserIcon/UserIcon'
import Chat_input from '../Chating_input/Chat_input'


function Chatroom() {
    return (
        <div className="Chatroom_section">
            <div className="Chatroom_info_section">
                <div className="Chatroom_icon_section">
                    <div className="Chatroom_icon">
                        {/* SVG 코드 삽입 */}
                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 34 34"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.278 8.72c.248-1.922.496-3.844.747-5.767h6.759l-.281 5.512c0 .017.007.034.007.051-.002.01-.002.02-.002.029-.098 1.868-1.889 3.378-4.018 3.378-1.06 0-2.008-.39-2.602-1.068-.508-.582-.72-1.319-.61-2.134zm8.848 4.06c1.218 1.283 2.995 2.02 4.869 2.02 1.88 0 3.657-.738 4.877-2.025.106-.111.206-.226.303-.343 1.274 1.44 3.202 2.367 5.325 2.367.112 0 .215-.027.327-.032v15.771H6.164v-15.77c.112.004.215.031.326.031 2.124 0 4.054-.927 5.328-2.369.098.12.2.237.308.35zm1.538-9.827h6.668l.28 5.593c0 .016-.006.027-.006.041l.003.085a2.925 2.925 0 0 1-.822 2.122c-1.36 1.433-4.214 1.435-5.578.003a2.937 2.937 0 0 1-.826-2.132l.004-.078c0-.015-.009-.03-.009-.047l.286-5.587zm16.302 0 .75 5.778c.108.805-.103 1.54-.611 2.122-.594.68-1.543 1.07-2.605 1.07-2.127 0-3.914-1.508-4.015-3.373a.357.357 0 0 0-.004-.044c0-.015.007-.027.007-.04l-.278-5.513h6.756zM3.29 13.96v18.016c0 .794.643 1.439 1.436 1.439h24.539c.795 0 1.438-.645 1.438-1.439V13.96c.588-.327 1.132-.716 1.57-1.215 1.055-1.208 1.514-2.772 1.294-4.39-.3-2.344-.604-4.686-.914-7.028a1.437 1.437 0 0 0-1.425-1.25H2.764c-.72 0-1.332.534-1.425 1.25C1.03 3.671.725 6.013.427 8.345c-.22 1.63.239 3.193 1.295 4.402.436.499.98.888 1.567 1.213z"
                                fill="#FFF"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <div className="Chatroom_name">상점명0403</div>
                    <div className="Chatroom_rating">
                        <span className="Chatroom_rating_star">⭐</span>
                        <span>0 (0)</span>
                    </div>
                </div>

                {/* 채팅 날짜 섹션 */}
                <div className="Chatroom_date_section">
                    <p className="Chatroom_date_text">2025년 01월 09일</p>
                    <div className="Chatroom_date_divider"></div>
                </div>


            </div>
            <div className="Chatroom_chat_section">
                <Chat_input/>
                <User_chat_icon/>
                <Partner_chat_icon/>


            </div>
        </div>
    );
}

export default Chatroom;
