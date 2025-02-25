import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "./frontend";
import Message from "./Message";
import { sendMessage, listenForMessages } from "./useFirestoreQuery";


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
            <h2>채팅방: {chatId}</h2>
            <div className="message-list">
                {messages.map((msg) => (
                    <Message key={msg.id} {...msg} />
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="메시지를 입력하세요..." />
            <button onClick={handleSendMessage}>전송</button>
        </div>
    );
};

export default ChatRoom;
