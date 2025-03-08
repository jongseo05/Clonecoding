import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { useCurrentUser } from "../../frontend";
import ChatRoom from "../../ChatRoom";
import { sendMessage, getLastMessage } from "../../useFirestoreQuery"; // import 수정 필요
import "../../Message.css";
import "./LightningTalk.css";

const LightningTalk = () => {
    const { chatId } = useParams();
    const { currentUser: user } = useCurrentUser();
    const [selectedChat, setSelectedChat] = useState("전체대화");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(null);
    const [message, setMessage] = useState("");
    const [lastMessages, setLastMessages] = useState({});

    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const pressTimer = useRef(null);
    const isMouseDown = useRef(false);

    const chatRooms = {
        chat1: "번개장터_알림",
        chat2: "번개장터_광고",
        chat3: "번개톡",
    };

    // Firestore에서 마지막 메시지를 가져오는 쿼리
    const fetchLastMessages = async () => {
        const updatedMessages = {};
        for (const chatId in chatRooms) {
            try {
                const lastMessage = await getLastMessage(chatId); // 여기서 getLastMessage 사용
                updatedMessages[chatId] = lastMessage;
            } catch (error) {
                console.error("Error fetching last messages:", error);
            }
        }
        setLastMessages(updatedMessages);
    };

    useEffect(() => {
        fetchLastMessages();
    }, []);

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

                    {/* 채팅방 목록 */}
                    {Object.keys(chatRooms).map((chatKey) => {
                        const lastMessage = lastMessages[chatKey];
                        const maxMessageLength = 20; // 최대 표시할 문자 수 (필요에 따라 조정 가능)
                        const truncatedMessage = lastMessage
                            ? lastMessage.text.length > maxMessageLength
                                ? `${lastMessage.text.slice(0, maxMessageLength)}...`
                                : lastMessage.text
                            : "새로운 메시지가 없습니다.";
                        return (
                            <div
                                key={chatKey}
                                className="chat-room"
                                onClick={() => handleChatRoomClick(chatKey)}
                                onMouseDown={() => handleLongPressStart(chatKey)}
                                onMouseUp={handleLongPressEnd}
                            >
                                <img
                                    src={chatKey === 'chat3' ? '/lightningTalk_storeImage.jpg' : '/lightningtalk_logo.jpg'}
                                    alt="User"
                                    className="chat-room-img"
                                />
                                <div className="chat-info">
                                    <div className="chat-title">{chatRooms[chatKey]}</div>
                                    <div
                                        className="chat-preview"
                                        data-date={lastMessage ? lastMessage.createdAt?.toLocaleDateString() : ""}
                                    >
                                        {truncatedMessage}
                                    </div>
                                </div>

                                {isChatOptionsOpen === chatKey && (
                                    <div className="chat-options-dropdown">
                                        <button>알림끄기</button>
                                        <button>대화방 나가기</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="chat-window">
                    {chatId ? (
                        <ChatRoom chatTitle={chatRooms[chatId] || "알 수 없는 채팅방"} />
                    ) : (
                        <div className="message-list">
                            <HiChatBubbleLeftRight className="chat-icon" />
                            <h3>대화방을 선택해주세요</h3>
                        </div>
                    )}

                    {chatId && (
                        <div className="message-input">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="메시지를 입력하세요"
                            />
                            <button onClick={handleSendMessage}>보내기</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LightningTalk;
