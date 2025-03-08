// src/Pages/Lightning_talk/Chatroom/Chatroom.js
import { useState, useEffect, useRef } from 'react';
import './Chatroom.css';
import PartnerChatIcon from '../Chating_icon/PartnerIcon/Partner_chat_icon';
import UserChatIcon from '../Chating_icon/UserIcon/UserIcon';
import ChatInput from '../Chating_input/Chat_input';
import { auth, db } from '../../../firebase';
import { ref, get, onValue, push, set } from 'firebase/database';

function Chatroom({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chatSectionRef = useRef(null);

    // 메시지를 날짜별로 그룹화
    const messagesByDate = {};
    messages.forEach(msg => {
        const date = new Date(msg.timestamp);
        const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

        if (!messagesByDate[dateStr]) {
            messagesByDate[dateStr] = [];
        }
        messagesByDate[dateStr].push(msg);
    });

    // 스크롤을 항상 최신 메시지로 이동
    useEffect(() => {
        if (chatSectionRef.current) {
            chatSectionRef.current.scrollTop = 0;
        }
    }, [messages]);

    // 채팅방 데이터 로드
    useEffect(() => {
        if (!chatId) return;

        console.log("채팅방 데이터 로드 시작:", chatId);

        // 채팅 메시지 실시간 가져오기
        const messagesRef = ref(db, `chats/${chatId}/messages`);

        const messageUnsubscribe = onValue(messagesRef, (snapshot) => {
            try {
                if (!snapshot.exists()) {
                    console.log("메시지가 없습니다.");
                    setMessages([]);
                    return;
                }

                const messagesData = snapshot.val();
                const messagesList = Object.keys(messagesData).map(key => ({
                    id: key,
                    ...messagesData[key]
                }));

                // 타임스탬프 기준 정렬
                messagesList.sort((a, b) => a.timestamp - b.timestamp);

                setMessages(messagesList);
            } catch (error) {
                console.error("메시지 데이터 처리 오류:", error);
                setError("메시지 처리 중 오류가 발생했습니다.");
            }
        }, (error) => {
            console.error("메시지 가져오기 오류:", error);
            setError("메시지를 불러오는 중 오류가 발생했습니다.");
        });

        // 채팅방 정보 가져오기
        const loadChatInfo = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error("로그인 필요");
                    setLoading(false);
                    return;
                }

                // 채팅방 info 가져오기
                const chatInfoRef = ref(db, `chats/${chatId}/info`);
                const infoSnapshot = await get(chatInfoRef);

                if (!infoSnapshot.exists()) {
                    console.error("채팅방 정보가 없습니다:", chatId);
                    setLoading(false);
                    return;
                }

                const info = infoSnapshot.val();
                let partnerId = null;

                // participants 배열에서 파트너 ID 찾기
                if (info.participants) {
                    partnerId = info.participants.find(id => id !== user.uid);
                }

                // participants 없으면 메시지에서 찾기
                if (!partnerId) {
                    // messagesRef에서 메시지 데이터 가져오기
                    const messagesSnapshot = await get(messagesRef);

                    if (messagesSnapshot.exists()) {
                        const messagesData = messagesSnapshot.val();

                        for (const msgKey in messagesData) {
                            const msg = messagesData[msgKey];
                            if (msg.sender && msg.sender !== user.uid) {
                                partnerId = msg.sender;
                                break;
                            }
                        }
                    }
                }

                if (!partnerId) {
                    console.warn("채팅방에서 파트너 ID를 찾을 수 없습니다.");
                    setPartnerInfo({ name: "알 수 없는 사용자" });
                    setLoading(false);
                    return;
                }

                // 파트너 정보 가져오기
                const partnerRef = ref(db, `users/${partnerId}`);
                const partnerSnapshot = await get(partnerRef);

                if (partnerSnapshot.exists()) {
                    setPartnerInfo(partnerSnapshot.val());
                } else {
                    console.warn("파트너 정보를 찾을 수 없습니다:", partnerId);
                    setPartnerInfo({ name: "알 수 없는 사용자" });
                }

                setLoading(false);
            } catch (error) {
                console.error("채팅방 정보 로딩 오류:", error);
                setError("채팅방 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            }
        };

        loadChatInfo();

        return () => {
            messageUnsubscribe();
        };
    }, [chatId]);

    // 메시지 전송 핸들러
    const handleSendMessage = async (text) => {
        if (!text.trim() || !chatId) return;

        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("로그인 필요");
                return;
            }

            // 메시지 저장
            const messagesRef = ref(db, `chats/${chatId}/messages`);
            const newMessageRef = push(messagesRef);

            const messageData = {
                text: text.trim(),
                sender: user.uid,
                timestamp: Date.now()
            };

            await set(newMessageRef, messageData);

            // 채팅방 info 업데이트
            const updateChatInfo = async () => {
                const chatInfoRef = ref(db, `chats/${chatId}/info`);
                const infoSnapshot = await get(chatInfoRef);

                let updateData = {
                    lastMessage: text.trim(),
                    lastMessageTime: messageData.timestamp
                };

                // 기존 info 데이터 있으면 보존
                if (infoSnapshot.exists()) {
                    const existingInfo = infoSnapshot.val();

                    // participants 배열이 없거나 현재 사용자가 없으면 추가
                    let participants = existingInfo.participants || [];
                    if (!Array.isArray(participants)) {
                        participants = []; // 배열이 아니면 초기화
                    }

                    if (!participants.includes(user.uid)) {
                        participants.push(user.uid);
                    }

                    updateData = {
                        ...existingInfo,
                        ...updateData,
                        participants: participants
                    };

                    // 상품 ID 없으면 추가
                    if (!updateData.itemId) {
                        updateData.itemId = `temp_item_${chatId}`;
                    }
                } else {
                    // info가 없는 경우 기본 데이터 생성
                    updateData = {
                        ...updateData,
                        participants: [user.uid],
                        itemId: `temp_item_${chatId}`
                    };
                }

                await set(chatInfoRef, updateData);
            };

            await updateChatInfo();
        } catch (error) {
            console.error("메시지 전송 오류:", error);
            alert("메시지를 전송할 수 없습니다. 다시 시도해주세요.");
        }
    };

    if (loading) {
        return <div className="Chatroom_section">로딩 중...</div>;
    }

    if (error) {
        return <div className="Chatroom_section" style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="Chatroom_section">
            <div className="Chatroom_info_section">
                <div className="Chatroom_icon_section">
                    <div className="Chatroom_icon">
                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 34 34"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.278 8.72c.248-1.922.496-3.844.747-5.767h6.759l-.281 5.512c0 .017.007.034.007.051-.002.01-.002.02-.002.029-.098 1.868-1.889 3.378-4.018 3.378-1.06 0-2.008-.39-2.602-1.068-.508-.582-.72-1.319-.61-2.134zm8.848 4.06c1.218 1.283 2.995 2.02 4.869 2.02 1.88 0 3.657-.738 4.877-2.025.106-.111.206-.226.303-.343 1.274 1.44 3.202 2.367 5.325 2.367.112 0 .215-.027.327-.032v15.771H6.164v-15.77c.112.004.215.031.326.031 2.124 0 4.054-.927 5.328-2.369.098.12.2.237.308.35zm1.538-9.827h6.668l.28 5.593c0 .016-.006.027-.006.041l.003.085a2.925 2.925 0 0 1-.822 2.122c-1.36 1.433-4.214 1.435-5.578.003a2.937 2.937 0 0 1-.826-2.132l.004-.078c0-.015-.009-.03-.009-.047l.286-5.587zm16.302 0 .75 5.778c.108.805-.103 1.54-.611 2.122-.594.68-1.543 1.07-2.605 1.07-2.127 0-3.914-1.508-4.015-3.373a.357.357 0 0 0-.004-.044c0-.015.007-.027.007-.04l-.278-5.513h6.756zM3.29 13.96v18.016c0 .794.643 1.439 1.436 1.439h24.539c.795 0 1.438-.645 1.438-1.439V13.96c.588-.327 1.132-.716 1.57-1.215 1.055-1.208 1.514-2.772 1.294-4.39-.3-2.344-.604-4.686-.914-7.028a1.437 1.437 0 0 0-1.425-1.25H2.764c-.72 0-1.332.534-1.425 1.25C1.03 3.671.725 6.013.427 8.345c-.22 1.63.239 3.193 1.295 4.402.436.499.98.888 1.567 1.213z"
                                fill="#FFF"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <div className="Chatroom_name">
                        {partnerInfo?.name || "알 수 없는 사용자"}
                    </div>
                    <div className="Chatroom_rating">
                        <span className="Chatroom_rating_star">⭐</span>
                        <span>0</span>
                    </div>
                </div>

                {/* 메시지 표시 */}
                <div className="Chatroom_chat_section" ref={chatSectionRef}>
                    <ChatInput onSendMessage={handleSendMessage} />

                    {Object.keys(messagesByDate).reverse().map(dateStr => (
                        <div key={dateStr}>
                            {/* 채팅 날짜 섹션 */}
                            <div className="Chatroom_date_section">
                                <p className="Chatroom_date_text">{dateStr}</p>
                                <div className="Chatroom_date_divider"></div>
                            </div>

                            {/* 해당 날짜의 메시지들 */}
                            {messagesByDate[dateStr].map(message => {
                                const isCurrentUser = message.sender === auth.currentUser?.uid;
                                // 시간 포맷팅
                                const date = new Date(message.timestamp);
                                const hours = date.getHours();
                                const minutes = date.getMinutes();
                                const ampm = hours >= 12 ? '오후' : '오전';
                                const formattedHours = hours % 12 || 12;
                                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                                const formattedTime = `${ampm} ${formattedHours}:${formattedMinutes}`;

                                return isCurrentUser ? (
                                    <UserChatIcon
                                        key={message.id}
                                        text={message.text}
                                        time={formattedTime}
                                    />
                                ) : (
                                    <PartnerChatIcon
                                        key={message.id}
                                        text={message.text}
                                        time={formattedTime}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Chatroom;