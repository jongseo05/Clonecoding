import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "./frontend";
import Message from "./Message";
import Channel from "./Components/Channel";
import { sendMessage, listenForMessages } from "./useFirestoreQuery";
import "../../Message.css";
import "./ChatRoom.css";

const ChatRoom = () => {
    const { chatId } = useParams(); // URL에서 chatId 가져오기
    const { currentUser: user } = useCurrentUser(); // 현재 로그인한 사용자 가져오기
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!chatId) return;

        // 채팅방 메시지 구독
        const unsubscribe = listenForMessages(chatId, (newMessages) => {
            setMessages(newMessages);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }, [chatId]);

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

    return (
        <div className="chat-room-container">
            <h2>채팅방: {chatId}</h2>

            {/* Channel 컴포넌트 (currentUser가 있을 때만 표시) */}
            {user && <Channel id={chatId} />}

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
    );
};

export default ChatRoom;
