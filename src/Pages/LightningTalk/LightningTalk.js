import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { useCurrentUser } from "../../frontend";
import ChatRoom from "../../ChatRoom"; // ✅ ChatRoom 컴포넌트 import
import { sendMessage } from "../../useFirestoreQuery"; // ✅ 메시지 전송 함수 import
import "../../Message.css";
import "./LightningTalk.css";

const LightningTalk = () => {
    const { chatId } = useParams(); // ✅ URL에서 chatId를 가져옴 (선택된 채팅방)
    const { currentUser: user } = useCurrentUser();
    const [selectedChat, setSelectedChat] = useState("전체대화");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [message, setMessage] = useState(""); // ✅ 입력 메시지 상태 추가

    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // ✅ 페이지 이동을 위한 훅

    // ✅ 채팅방 클릭 시 해당 채팅방으로 이동 (URL 변경)
    const handleChatRoomClick = (chatId) => {
        navigate(`/lightningtalk/${chatId}`);
    };

    // ✅ 메시지 전송 함수
    const handleSendMessage = async () => {
        if (!message.trim() || !chatId) return; // 빈 메시지 또는 채팅방 미선택 시 전송 불가

        try {
            await sendMessage(chatId, user.id, message, user.image);
            setMessage(""); // 메시지 전송 후 입력창 초기화
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    // ✅ 드롭다운 바깥을 클릭하면 닫히도록 설정
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="container">
            <div className="bar">
                <Top_navbar />
                <Context />
            </div>

            <div className={`chat-container ${isDropdownOpen ? "dark-overlay" : ""}`}>
                {/* ✅ 왼쪽 채팅방 목록 */}
                <div className="chat-list">
                    <div className="dropdown" ref={dropdownRef}>
                        <div
                            className="dropdown-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDropdownOpen((prev) => !prev);
                            }}
                        >
                            <h2>{selectedChat}</h2>
                            <IoIosArrowDropdown size={24} style={{ color: "gray" }} />
                        </div>
                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <button
                                    className={selectedChat === "전체대화" ? "chat-btn selected" : "chat-btn"}
                                    onClick={() => setSelectedChat("전체대화")}
                                >
                                    전체대화
                                </button>
                                <button
                                    className={selectedChat === "구매대화" ? "chat-btn selected" : "chat-btn"}
                                    onClick={() => setSelectedChat("구매대화")}
                                >
                                    구매대화
                                </button>
                                <button
                                    className={selectedChat === "판매대화" ? "chat-btn selected" : "chat-btn"}
                                    onClick={() => setSelectedChat("판매대화")}
                                >
                                    판매대화
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ✅ 채팅방 리스트 (클릭 시 오른쪽 화면에 해당 채팅방 내용 표시) */}
                    <div className="chat-room" onClick={() => handleChatRoomClick("chat1")}>
                        <img src="/lightningtalk_logo.jpg" alt="User" className="chat-room-img" />
                        <div className="chat-info">
                            <div className="chat-title">번개장터_알림</div>
                            <div className="chat-preview">(광고)오늘특가 탭이 새로 생겼어요!</div>
                        </div>
                    </div>

                    <div className="chat-room" onClick={() => handleChatRoomClick("chat2")}>
                        <img src="/lightningtalk_logo.jpg" alt="User" className="chat-room-img" />
                        <div className="chat-info">
                            <div className="chat-title">번개장터_광고</div>
                            <div className="chat-preview">(광고)번개포인트 가장 쉽게 받을 수 있는 방법, 몰래 알려..</div>
                        </div>
                    </div>
                </div>

                {/* ✅ 오른쪽 채팅 화면 */}
                <div className="chat-window">
                    {chatId ? (
                        <>
                            {/* ✅ 선택된 채팅방이 있으면 ChatRoom 컴포넌트 렌더링 */}
                            <ChatRoom />

                            {/* ✅ 메시지 입력창 */}
                            <div className="chat-input">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="메시지를 입력하세요..."
                                />
                                <button onClick={handleSendMessage}>전송</button>
                            </div>
                        </>
                    ) : (
                        // ✅ 채팅방이 선택되지 않은 경우 안내 메시지 표시
                        <div className="message-list">
                            <HiChatBubbleLeftRight className="chat-icon" />
                            <h3>대화방을 선택해주세요</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LightningTalk;
