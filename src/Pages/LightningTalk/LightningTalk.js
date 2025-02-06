import React, { useState, useEffect } from "react";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import { sendMessage, listenForMessages } from "../../useFirestoreQuery"; // chatService.js에서 가져오기
import  chatPage  from "../../ChatPage"; // 로그인한 유저 정보 가져오기
import './LightningTalk.css'; // CSS 파일 임포트

const LightningTalk = ({ chatId }) => {
    const user = chatPage(); // 로그인한 유저 정보
    const [message, setMessage] = useState(""); // 입력된 메시지 상태
    const [messages, setMessages] = useState([]); // 수신된 메시지 목록

    // ✅ 메시지 전송 함수
    const handleSendMessage = async () => {
        if (!message.trim()) return; // 메시지가 비어있으면 전송하지 않음

        await sendMessage(chatId, user.uid, message); // 메시지 전송
        setMessage(""); // 메시지 전송 후 입력창 비우기
    };

    useEffect(() => {
        console.log("🚀 chatId 확인 (LightningTalk.js):", chatId);
    }, [chatId]);

    useEffect(() => {
        if (!chatId) return; // chatId가 없으면 실행하지 않음
        const unsubscribe = listenForMessages(chatId, (newMessages) => {
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [chatId]);

    return (
        <div className="container">
            <div className={"bar"}>
            <Top_navbar />
            <Context />
            </div>
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
                {/* 메시지 리스트 출력 */}
                <div className="message-list">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.senderId === user.uid ? "my-message" : ""}`}>
                            <strong>{msg.senderId}:</strong> {msg.text}
                        </div>
                    ))}
                </div>

                {/* 메시지 입력창 */}
                <div className="chat-input">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} // 입력값 변경 시 상태 업데이트
                        placeholder="메시지를 입력하세요..."
                    />
                    <button onClick={handleSendMessage}>전송</button>
                </div>
            </div>
        </div>
    );
};

export default LightningTalk;
