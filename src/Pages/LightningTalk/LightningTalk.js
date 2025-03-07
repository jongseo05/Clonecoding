import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { useCurrentUser } from "../../frontend";
import ChatRoom from "../../ChatRoom";
import { sendMessage } from "../../useFirestoreQuery";
import "../../Message.css";
import "./LightningTalk.css";

const LightningTalk = () => {
    const { chatId } = useParams();
    const { currentUser: user } = useCurrentUser();
    const [selectedChat, setSelectedChat] = useState("전체대화");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(null);
    const [message, setMessage] = useState("");

    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const pressTimer = useRef(null);
    const isMouseDown = useRef(false);

    const handleChatRoomClick = (chatId) => {
        navigate(`/lightningtalk/${chatId}`);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !chatId) return;

        try {
            await sendMessage(chatId, user.id, message, user.image);
            setMessage("");
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

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

    // 길게 누르면 드롭다운 표시
    const handleLongPressStart = (chatId) => {
        isMouseDown.current = true;
        pressTimer.current = setTimeout(() => {
            if (isMouseDown.current) {
                setIsChatOptionsOpen(chatId);
            }
        }, 700);  // 700ms 이상 길게 누르면 드롭다운 표시
    };

    const handleLongPressEnd = () => {
        isMouseDown.current = false;
        clearTimeout(pressTimer.current);
    };

    const chatRooms = {
        chat1: "번개장터_알림",
        chat2: "번개장터_광고",
        chat3: "번개톡",
    };

    return (
        <div className="container">
            <div className="bar">
                <Top_navbar />
                <Context />
            </div>

            <div className={`chat-container ${isDropdownOpen ? "dark-overlay" : ""}`}>
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
                            <IoIosArrowDropdown size={24} style={{color: "gray"}}/>
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

                    {/* 채팅방 목록 */}
                    <div
                        className="chat-room"
                        onClick={() => handleChatRoomClick("chat1")}
                        onMouseDown={() => handleLongPressStart("chat1")}
                        onMouseUp={handleLongPressEnd}
                    >
                        <img src="/lightningtalk_logo.jpg" alt="User" className="chat-room-img"/>
                        <div className="chat-info">
                            <div className="chat-title">번개장터_알림</div>
                            <div className="chat-preview">(광고)오늘특가 탭이 새로 생겼어요!&nbsp;&nbsp;•2월 26일</div>
                        </div>
                    </div>

                    <>
                        {isChatOptionsOpen === "chat1" && (
                            <>
                                <div className="chat-options-dropdown">
                                    <button>알림끄기</button>
                                    <button>대화방 나가기</button>
                                </div>
                            </>
                        )}
                    </>


                    <div
                        className="chat-room"
                        onClick={() => handleChatRoomClick("chat2")}
                        onMouseDown={() => handleLongPressStart("chat2")}
                        onMouseUp={handleLongPressEnd}
                    >
                        <img src="/lightningtalk_logo.jpg" alt="User" className="chat-room-img"/>
                        <div className="chat-info">
                            <div className="chat-title">번개장터_광고</div>
                            <div className="chat-preview">(광고)번개포인트 가장 쉽게 받을 수 있는 방..&nbsp;&nbsp;•2월 26일</div>
                        </div>
                    </div>

                    {isChatOptionsOpen === "chat2" && (
                        <div className="chat-options-dropdown">
                            <button>알림끄기</button>
                            <button>대화방 나가기</button>
                        </div>
                    )}

                    <div
                        className="chat-room"
                        onClick={() => handleChatRoomClick("chat3")}
                        onMouseDown={() => handleLongPressStart("chat3")}
                        onMouseUp={handleLongPressEnd}
                    >
                        <img src="/lightningTalk_storeImage.jpg" alt="User" className="chat-room-img"/>
                        <div className="chat-info">
                            <div className="chat-title">번개톡</div>
                            <div className="chat-preview">(광고)번개포인트 가장 쉽게 받을 수 있는 방..&nbsp;&nbsp;•2월 26일</div>
                        </div>
                    </div>

                    {isChatOptionsOpen === "chat3" && (
                        <div className="chat-options-dropdown">
                            <button>알림끄기</button>
                            <button>대화방 나가기</button>
                        </div>
                    )}

                </div>




                <div className="chat-window">
                    {chatId ? (
                        <>
                            <ChatRoom chatTitle={chatRooms[chatId] || "알 수 없는 채팅방"} />
                        </>
                    ) : (
                        <div className="message-list">
                            <HiChatBubbleLeftRight className="chat-icon"/>
                            <h3>대화방을 선택해주세요</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LightningTalk;
