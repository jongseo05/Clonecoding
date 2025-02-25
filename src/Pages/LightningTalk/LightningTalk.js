import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { sendMessage, listenForMessages } from "../../useFirestoreQuery";
import { useCurrentUser } from "../../frontend";
import Message from "../../Message";
import "../../Message.css";
import "./LightningTalk.css";

const LightningTalk = () => {
    const { chatId } = useParams(); // URL에서 chatId 가져오기
    const { currentUser: user } = useCurrentUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState("전체대화");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 채팅방 클릭 시 해당 채팅방으로 이동
    const handleChatRoomClick = (id) => {
        navigate(`/lightningtalk/${id}`);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            text: message,
            createdAt: { seconds: Math.floor(Date.now() / 1000) },
            displayName: user.name,
            photoURL: user.image,
            isRead: false
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            await sendMessage(chatId, user.id, message, user.image);
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }

        setMessage("");
    };

    useEffect(() => {
        console.log("🚀 현재 chatId:", chatId);
    }, [chatId]);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = listenForMessages(chatId, (newMessages) => {
            setMessages((prevMessages) => {
                if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
                    return newMessages;
                }
                return prevMessages;
            });
        });

        return () => unsubscribe();
    }, [chatId]);

    // 드롭다운 바깥을 클릭하면 닫히도록 설정
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
                {/* 왼쪽 채팅방 목록 */}
                <div className="chat-list">
                    {/* 드롭다운 메뉴 */}
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

                        {/* 드롭다운 메뉴 내용 */}
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

                    {/* 채팅방 리스트 (클릭 시 개별 채팅방으로 이동) */}
                    <div className="chat-room" onClick={() => handleChatRoomClick("chat1")}>
                        <img src="/lightningtalk_logo.jpg" alt="User" />
                        <div className="chat-info">
                            <div className="chat-title">번개장터</div>
                            <div className="chat-preview">상품 등록이 완료되었습니다.</div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 채팅 화면 */}
                <div className="chat-window">
                    <div className="message-list">
                        {messages.map((msg) => (
                            <Message
                                key={msg.id}
                                uid={msg.senderId}
                                text={msg.text}
                                createdAt={msg.createdAt}
                                displayName={msg.displayName || "익명"}
                                photoURL={msg.photoURL || "/default-avatar.png"}
                                isRead={msg.isRead || false}
                            />
                        ))}
                        <HiChatBubbleLeftRight className="chat-icon"/>
                        <h3>대화방을 선택해주세요</h3>
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                        />
                        <button onClick={handleSendMessage}>전송</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightningTalk;
