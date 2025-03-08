// src/Pages/Lightning_talk/Chating_list/Chat_list.js
import { useState, useEffect } from 'react';
import './Chat_list.css';
import market from '../Images/market_icon.png';
import { auth, db } from '../../../firebase';
import { ref, get, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

function ChatList({ onClick }) {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // 인증 상태 감지
    useEffect(() => {
        console.log("인증 상태 확인 중...");

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("로그인된 사용자 확인:", user.uid);
                setCurrentUser(user);
            } else {
                console.log("사용자가 로그인하지 않았습니다.");
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // 채팅 목록 가져오기
    useEffect(() => {
        if (!currentUser) return;

        console.log("채팅 목록 가져오기 시작:", currentUser.uid);

        try {
            // 모든 채팅 가져오기
            const chatsRef = ref(db, "chats");

            // 실시간 업데이트 설정
            const unsubscribe = onValue(chatsRef, async (snapshot) => {
                try {
                    if (!snapshot.exists()) {
                        console.log("채팅방 데이터가 없습니다.");
                        setChatList([]);
                        setLoading(false);
                        return;
                    }

                    const allChats = snapshot.val();
                    console.log("모든 채팅방 데이터:", allChats);

                    // 채팅방 ID 배열로 변환
                    const chatIds = Object.keys(allChats);

                    if (chatIds.length === 0) {
                        console.log("채팅방이 없습니다.");
                        setChatList([]);
                        setLoading(false);
                        return;
                    }

                    // 채팅방 데이터 처리
                    const chatDataPromises = chatIds.map(async (chatId) => {
                        const chat = allChats[chatId];

                        if (!chat.info) {
                            console.warn(`채팅방 ID ${chatId}에 info 객체가 없습니다.`);
                            return null;
                        }

                        // 참가자 정보 처리
                        let partnerId = null;
                        let isUserInChat = false;

                        // participants 배열에서 확인 (우선)
                        if (chat.info.participants) {
                            if (chat.info.participants.includes(currentUser.uid)) {
                                isUserInChat = true;
                                // 파트너 ID 찾기
                                partnerId = chat.info.participants.find(id => id !== currentUser.uid);
                            }
                        }

                        // 메시지에서도 확인 (participants가 없거나 현재 사용자가 없는 경우)
                        if (!isUserInChat && chat.messages) {
                            const messageKeys = Object.keys(chat.messages);
                            for (const msgKey of messageKeys) {
                                const msg = chat.messages[msgKey];
                                if (msg.sender) {
                                    // 현재 사용자가 발신자라면 참여한 것으로 간주
                                    if (msg.sender === currentUser.uid) {
                                        isUserInChat = true;
                                    }
                                    // 다른 발신자가 있다면 파트너로 간주
                                    else if (!partnerId) {
                                        partnerId = msg.sender;
                                    }
                                }
                            }
                        }

                        // 사용자가 참여하지 않은 채팅방은 건너뛰기
                        if (!isUserInChat) {
                            return null;
                        }

                        // 파트너 ID를 찾지 못한 경우
                        if (!partnerId) {
                            console.warn(`채팅방 ID ${chatId}에서 파트너 ID를 찾을 수 없습니다.`);
                            partnerId = "unknown";
                        }

                        // 파트너 정보 가져오기
                        let partnerData = { name: "알 수 없는 사용자" };
                        try {
                            const partnerRef = ref(db, `users/${partnerId}`);
                            const partnerSnapshot = await get(partnerRef);

                            if (partnerSnapshot.exists()) {
                                partnerData = partnerSnapshot.val();
                            } else {
                                console.warn(`파트너 ID ${partnerId}의 정보를 찾을 수 없습니다.`);
                            }
                        } catch (error) {
                            console.warn(`파트너 정보 로딩 오류:`, error);
                        }

                        // 마지막 메시지 찾기
                        let lastMessage = chat.info.lastMessage || "";
                        let lastMessageTime = chat.info.lastMessageTime || Date.now();

                        // 날짜 포맷팅
                        const lastMessageDate = new Date(lastMessageTime);
                        const month = lastMessageDate.getMonth() + 1;
                        const day = lastMessageDate.getDate();
                        const formattedDate = `${month}월${day}일`;

                        return {
                            id: chatId,
                            userName: partnerData.name || "알 수 없는 사용자",
                            lastMessage: lastMessage,
                            lastMessageTime: lastMessageTime,
                            lastMessageDate: formattedDate,
                            partnerId: partnerId
                        };
                    });

                    // null 값 제거 및 날짜순 정렬
                    const chatList = (await Promise.all(chatDataPromises))
                        .filter(chat => chat !== null)
                        .sort((a, b) => b.lastMessageTime - a.lastMessageTime);

                    console.log("최종 채팅 목록:", chatList);
                    setChatList(chatList);
                    setLoading(false);
                } catch (error) {
                    console.error("채팅 데이터 처리 오류:", error);
                    setError("채팅 데이터 처리 중 오류가 발생했습니다.");
                    setLoading(false);
                }
            }, (error) => {
                console.error("채팅 목록 로딩 오류:", error);
                setError("채팅 목록을 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("onValue 설정 오류:", error);
            setError("채팅 목록 설정 중 오류가 발생했습니다.");
            setLoading(false);
        }
    }, [currentUser]);

    if (loading && !currentUser) {
        return <div className="Chat_list_section">사용자 인증 확인 중...</div>;
    }

    if (loading) {
        return <div className="Chat_list_section">채팅 목록 로딩 중...</div>;
    }

    if (!currentUser) {
        return <div className="Chat_list_section">로그인이 필요합니다.</div>;
    }

    if (error) {
        return <div className="Chat_list_section" style={{ color: 'red' }}>{error}</div>;
    }

    // 채팅방이 없을 때
    if (chatList.length === 0) {
        return (
            <div className="Chat_list_section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>아직 대화 내역이 없습니다.</div>
                <div style={{ fontSize: '12px', color: '#999' }}>상품 페이지에서 번개톡 버튼을 눌러 대화를 시작해보세요!</div>
            </div>
        );
    }

    return (
        <>
            {chatList.map((chat) => (
                <div
                    key={chat.id}
                    className="Chat_list_section"
                    onClick={() => onClick(chat.id)}
                >
                    <img src={market} className="Chat_list_img" alt="상점 아이콘" />

                    {/* 상점명, 최근 대화, 최근 대화 일자 */}
                    <div className="Chat_list_text_section">
                        <div className="Chat_list_strong_section">
                            <strong>{chat.userName}</strong>
                        </div>
                        <div className="Chat_list_normal_text_section">
                            <div className="Chat_list_recent_chat_text">
                                {chat.lastMessage}
                            </div>
                            <div className="Chat_list_recent_date_text">
                                ・ {chat.lastMessageDate}
                            </div>
                        </div>
                    </div>

                    {/* 상품 이미지 (없는 경우 기본 이미지) */}
                    <div className="Chat_list_item_img_section">
                        <img src={market} className="Chat_list_item_img" alt="상품 이미지" />
                    </div>
                </div>
            ))}
        </>
    );
}

export default ChatList;