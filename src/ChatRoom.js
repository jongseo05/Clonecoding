import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "./frontend";
import Message from "./Message";
import { sendMessage, listenForMessages, markMessageAsRead } from "./useFirestoreQuery";
import "./ChatRoom.css";

const ChatRoom = ({ chatTitle }) => {
    const { chatId } = useParams(); // URL에서 chatId 가져오기
    const { currentUser: user } = useCurrentUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = listenForMessages(chatId, (newMessages) => {
            setMessages(newMessages);

            // 🔥 내가 보낸 메시지가 아니라면 읽음 상태 업데이트
            newMessages.forEach((msg) => {
                if (msg.uid !== user.id && !msg.isRead) {
                    markMessageAsRead(chatId, msg.id);
                }
            });
        });

        return () => unsubscribe();
    }, [chatId, user]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            uid: user.id,
            text: message,
            createdAt: { seconds: Math.floor(Date.now() / 1000) },
            displayName: user.name,
            photoURL: user.image,
            isRead: false
        };

        setMessages([...messages, newMessage]);
        await sendMessage(chatId, user.id, message, user.image);
        setMessage("");
    };

    return (
        <div className="chat-room-container">
            <h3>&nbsp;&nbsp;&nbsp;{chatTitle}</h3> {/* ✅ 채팅방 이름 표시 */}
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;번개장터 공식상점</p>
            <div className="message-list">
                {messages.map((msg) => (
                    <Message key={msg.id} {...msg} />
                ))}
            </div>
        </div>
    );
};

export default ChatRoom;
