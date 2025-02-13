import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase"; // Firestore 인스턴스 가져오기
import { useFirestoreQuery } from "../useFirestoreQuery"; // 커스텀 훅
import { collection, addDoc, query, orderBy, limit } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore"; // Firestore 서버 타임스탬프
import Message from "../Message"; // 메시지 컴포넌트
import { BiSend } from "react-icons/bi";

const Channel = ({ id = null, currentUser }) => {
    // Firestore에서 메시지 컬렉션 가져오기
    const messagesRef = collection(db, `messages-${id}`);
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(1000));
    const messages = useFirestoreQuery(messagesQuery);

    // 상태 및 Ref
    const [newMessage, setNewMessage] = useState("");
    const inputRef = useRef();
    const bottomListRef = useRef();

    // 입력값 변경 핸들러
    const handleOnChange = (e) => {
        setNewMessage(e.target.value);
    };

    // 메시지 전송 핸들러
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (trimmedMessage) {
            await addDoc(messagesRef, {
                text: trimmedMessage,
                createdAt: serverTimestamp(), // 서버 타임스탬프 사용
                uid: currentUser?.id || "guest", // 현재 유저 ID (기본값 guest)
                displayName: currentUser?.name || "익명", // 현재 유저 이름
                photoURL: currentUser?.image || "", // 현재 유저 프로필 이미지
                isRead: false,
            });

            setNewMessage(""); // 입력 필드 초기화
            bottomListRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // 인풋 필드 자동 포커스
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // 메시지 업데이트 시 하단으로 스크롤
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
                        {messages
                            ?.sort((a, b) =>
                                a?.createdAt?.seconds <= b?.createdAt?.seconds ? -1 : 1
                            )
                            ?.map((message) => (
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
