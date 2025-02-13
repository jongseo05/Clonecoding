import React, { useState, useEffect } from "react";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { sendMessage, listenForMessages } from "../../useFirestoreQuery";
import { useCurrentUser } from "../../frontend";
import Message from "../../Message";
import '../../Message.css';
import './LightningTalk.css';

const LightningTalk = ({ chatId }) => {
    const { currentUser: user } = useCurrentUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

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
        console.log("🚀 chatId 확인 (LightningTalk.js):", chatId);
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

    return (
        <div className="container">
            <div className="bar">
                <Top_navbar />
                <Context />
            </div>

            <div className="chat-container">
                {/* 왼쪽 채팅방 목록 */}
                <div className="chat-list">
                    <h2>전체대화</h2>
                    <div className="chat-room">
                        <img src="/profile1.jpg" alt="User" />
                        <div className="chat-info">
                            <div className="chat-title">번개장터</div>
                            <div className="chat-preview">상품 등록이 완료되었습니다.</div>
                        </div>
                    </div>
                    <div className="chat-room">
                        <img src="/profile2.jpg" alt="User" />
                        <div className="chat-info">
                            <div className="chat-title">상점84351990호</div>
                            <div className="chat-preview">안녕하세요!</div>
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
