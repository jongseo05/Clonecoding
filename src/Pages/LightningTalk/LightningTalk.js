import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { useCurrentUser } from "../../frontend";
import ChatRoom from "../../ChatRoom";
import { sendMessage, getLastMessage, getUnreadMessageCount } from "../../useFirestoreQuery"; // 새로운 함수 추가
import "../../Message.css";
import "./LightningTalk.css";

const LightningTalk = () => {
    const { chatId } = useParams();
    const { currentUser: user } = useCurrentUser();
    const [selectedChat, setSelectedChat] = useState("전체대화");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [lastMessages, setLastMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({}); // 읽지 않은 메시지 개수를 추적할 상태 추가

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const chatRooms = {
        chat1: "번개장터_알림",
        chat2: "번개장터_광고",
        chat3: "상점20040311",
    };

    // Firestore에서 마지막 메시지와 읽지 않은 메시지 개수를 가져오는 쿼리
    const fetchLastMessages = async () => {
        const updatedMessages = {};
        const updatedUnreadCounts = {};

        for (const chatId in chatRooms) {
            try {
                const lastMessage = await getLastMessage(chatId); // 마지막 메시지
                const unreadCount = await getUnreadMessageCount(chatId); // 읽지 않은 메시지 개수

                updatedMessages[chatId] = lastMessage;
                updatedUnreadCounts[chatId] = unreadCount; // 각 채팅방의 읽지 않은 메시지 개수 저장
            } catch (error) {
                console.error("Error fetching last messages:", error);
            }
        }
        setLastMessages(updatedMessages);
        setUnreadCounts(updatedUnreadCounts);
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

    // 드롭다운 아이콘 클릭 시 드롭다운 열고 닫기
    const handleDropdownToggle = (e) => {
        e.stopPropagation(); // 다른 클릭 이벤트로 드롭다운이 닫히지 않도록 막기
        setIsDropdownOpen((prev) => !prev);
    };

    return (
        <div className={`container`}>
            <div className="bar">
                <Top_navbar />
                <Context />
            </div>

            <div className={`chat-container ${isDropdownOpen ? "dark-overlay" : ""}`}>
                <div className="chat-list">
                    <div className="dropdown" ref={dropdownRef}>
                        <div
                            className="dropdown-btn"
                            onClick={handleDropdownToggle} // 드롭다운 아이콘 클릭 시 열리도록
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
                        const unreadCount = unreadCounts[chatKey] || 0; // 읽지 않은 메시지 개수
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
                                onClick={() => handleChatRoomClick(chatKey)} // 채팅방 클릭 시 드롭다운 열리지 않도록
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
                                {/* 읽지 않은 메시지 개수 표시 */}
                                {lastMessage && lastMessage.unreadCount > 0 && (
                                    <div className="unread-count">{lastMessage.unreadCount}</div>
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
                </div>
            </div>
        </div>
    );
};

export default LightningTalk;
