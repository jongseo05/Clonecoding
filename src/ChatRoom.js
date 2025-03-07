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
    const [image, setImage] = useState(null); // 🔥 이미지 상태 추가

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
        if (!message.trim() && !image) return; // 🔥 메시지나 이미지가 없으면 전송 안 함

        await sendMessage(chatId, user.id, message, user.image, image);
        setMessage("");
        setImage(null); // 🔥 전송 후 이미지 초기화
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // 🔥 선택한 이미지 저장
        }
    };

    return (
        <div className="chat-room-container">
            <h3>&nbsp;&nbsp;&nbsp;{chatTitle}</h3>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;번개장터 공식상점</p>

            <div className="message-list">
                {messages.map((msg) => (
                    <Message key={msg.id} {...msg} />
                ))}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <input className={"file-input"} type="file" accept="image/*" onChange={handleImageChange}/>
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChatRoom;
