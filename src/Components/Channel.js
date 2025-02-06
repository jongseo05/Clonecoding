import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase"; // db는 firebase.js에서 export 되어야 합니다.
import { useFirestoreQuery } from "../useFirestoreQuery";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // 추가된 import
import Message from "../Message"; // 상대 경로로 수정
import { BiSend } from "react-icons/bi";

const Channel = ({ id }) => {
    const messagesRef = collection(db, `messages-${id}`); // collection()을 통해 messages collection 지정
    const messages = useFirestoreQuery(
        messagesRef.orderBy("createdAt", "desc").limit(1000)
    );

    const [newMessage, setNewMessage] = useState("");
    const inputRef = useRef();
    const bottomListRef = useRef();

    const handleOnChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (trimmedMessage) {
            await addDoc(messagesRef, { // addDoc을 사용하여 Firestore에 새 메시지 추가
                text: trimmedMessage,
                createdAt: serverTimestamp(), // Firestore의 서버 타임스탬프 사용
                uid: "현재 유저 ID", // TODO: 인증 시스템 연결
                displayName: "현재 유저 이름", // TODO: 인증 시스템 연결
                photoURL: "현재 유저 프로필 이미지", // TODO: 인증 시스템 연결
                isRead: false,
            });

            setNewMessage("");
            bottomListRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (bottomListRef.current) {
            bottomListRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-auto h-full">
                <div className="py-4 max-w-screen-lg mx-auto">
                    {/* 메시지 리스트 */}
                    <ul>
                        {messages?.map((message) => (
                            <li key={message.id}>
                                <Message
                                    text={message.text}
                                    displayName={message.displayName}
                                    photoURL={message.photoURL}
                                    senderId={message.uid}
                                />
                            </li>
                        ))}
                    </ul>
                    <div ref={bottomListRef} className="mb-16" />
                </div>
            </div>

            {/* 채팅 입력 폼 */}
            <div className="w-full z-20 pb-safe bottom-0 fixed md:max-w-xl p-4 bg-gray-50">
                <form onSubmit={handleOnSubmit} className="flex">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={handleOnChange}
                        placeholder="메세지를 입력하세요"
                        className="border rounded-full px-4 h-10 flex-1 mr-1 ml-1"
                    />
                    <button type="submit" disabled={!newMessage} className="rounded-full bg-red-400 h-10 w-10">
                        <BiSend className="text-white text-xl w-10" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Channel;
