import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "./frontend";
import Message from "./Message";
import { sendMessage, listenForMessages } from "./useFirestoreQuery";
import "./ChatRoom.css";

const ChatRoom = () => {
    const { chatId } = useParams(); // URL에서 chatId 가져오기
    const { currentUser: user } = useCurrentUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = listenForMessages(chatId, (newMessages) => {
            setMessages(newMessages);
        });

        return () => unsubscribe();
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

        setMessages([...messages, newMessage]);
        await sendMessage(chatId, user.id, message, user.image);
        setMessage("");
    };

    return (
        <div className="chat-room-container">
            <h3>&nbsp;&nbsp;&nbsp;채팅방: {chatId}</h3>
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
