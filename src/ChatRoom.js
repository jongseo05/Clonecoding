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
    const [image, setImage] = useState(null);

    // 🚨 읽기 전용 채팅방인지 확인 (번개장터_알림 & 번개장터_광고)
    const isReadOnlyChat = chatId === "chat1" || chatId === "chat2";

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = listenForMessages(chatId, (newMessages) => {
            setMessages(newMessages);

            // ✅ 읽기 전용 채팅방이 아닐 때만 읽음 상태 업데이트
            if (!isReadOnlyChat) {
                newMessages.forEach((msg) => {
                    if (msg.uid !== user.id && !msg.isRead) {
                        markMessageAsRead(chatId, msg.id);
                    }
                });
            }
        });

        return () => unsubscribe();
    }, [chatId, user, isReadOnlyChat]);

    const handleSendMessage = async () => {
        if (isReadOnlyChat) return; // 🚨 읽기 전용 채팅방에서는 전송 금지
        if (!message.trim() && !image) return;

        await sendMessage(chatId, user.id, message, user.image, image);
        setMessage("");
        setImage(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    return (
        <div className="chat-room-container">
            <h3>&nbsp;&nbsp;&nbsp;{chatTitle}</h3>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;번개장터 공식상점</p>

            <div className="message-list">
                {messages.map((msg) => (
                    <Message
                        key={msg.id}
                        {...msg}
                        showReadStatus={!isReadOnlyChat} // ✅ 읽기 전용 채팅방에서는 읽음 상태 표시 X
                    />
                ))}
            </div>

            <div className="chat-input">
                {isReadOnlyChat ? (
                    <p className="disabled-message">메시지를 보낼 수 없습니다.</p>
                ) : (
                    <>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                        />
                        <input className={"file-input"} type="file" accept="image/*" onChange={handleImageChange}/>
                        <button onClick={handleSendMessage}>전송</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;
