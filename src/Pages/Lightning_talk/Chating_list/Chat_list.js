// src/Pages/Lightning_talk/Chating_list/Chat_list.js
import { useState, useEffect } from 'react';
import './Chat_list.css';
import market from '../Images/market_icon.png'; // 기존 아이콘 임포트는 유지
import { auth, db } from '../../../firebase';
import { ref, get, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

function ChatList({ onClick }) {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // 채팅방 아이콘 SVG 컴포넌트
    const ChatroomSvgIcon = () => (
        <div className="Chat_list_svg_icon">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 34 34"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    width: '100%',
                    height: '100%',
                    padding: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#f2f2f2',
                }}
            >
                <path
                    d="M3.278 8.72c.248-1.922.496-3.844.747-5.767h6.759l-.281 5.512c0 .017.007.034.007.051-.002.01-.002.02-.002.029-.098 1.868-1.889 3.378-4.018 3.378-1.06 0-2.008-.39-2.602-1.068-.508-.582-.72-1.319-.61-2.134zm8.848 4.06c1.218 1.283 2.995 2.02 4.869 2.02 1.88 0 3.657-.738 4.877-2.025.106-.111.206-.226.303-.343 1.274 1.44 3.202 2.367 5.325 2.367.112 0 .215-.027.327-.032v15.771H6.164v-15.77c.112.004.215.031.326.031 2.124 0 4.054-.927 5.328-2.369.098.12.2.237.308.35zm1.538-9.827h6.668l.28 5.593c0 .016-.006.027-.006.041l.003.085a2.925 2.925 0 0 1-.822 2.122c-1.36 1.433-4.214 1.435-5.578.003a2.937 2.937 0 0 1-.826-2.132l.004-.078c0-.015-.009-.03-.009-.047l.286-5.587zm16.302 0 .75 5.778c.108.805-.103 1.54-.611 2.122-.594.68-1.543 1.07-2.605 1.07-2.127 0-3.914-1.508-4.015-3.373a.357.357 0 0 0-.004-.044c0-.015.007-.027.007-.04l-.278-5.513h6.756zM3.29 13.96v18.016c0 .794.643 1.439 1.436 1.439h24.539c.795 0 1.438-.645 1.438-1.439V13.96c.588-.327 1.132-.716 1.57-1.215 1.055-1.208 1.514-2.772 1.294-4.39-.3-2.344-.604-4.686-.914-7.028a1.437 1.437 0 0 0-1.425-1.25H2.764c-.72 0-1.332.534-1.425 1.25C1.03 3.671.725 6.013.427 8.345c-.22 1.63.239 3.193 1.295 4.402.436.499.98.888 1.567 1.213z"
                    fill="#777"
                    fillRule="evenodd"
                ></path>
            </svg>
        </div>
    );

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

    // 상품 정보 가져오기 함수 - 재귀적으로 데이터베이스 탐색
    const getProductData = async (productId) => {
        if (!productId || productId.startsWith("temp_item_")) {
            console.log("유효하지 않은 상품 ID:", productId);
            return null;
        }

        console.log("상품 정보 가져오기:", productId);

        try {
            // 전체 items 노드 가져오기
            const itemsRef = ref(db, "items");
            const snapshot = await get(itemsRef);

            if (!snapshot.exists()) {
                console.log("상품 데이터가 없습니다.");
                return null;
            }

            const items = snapshot.val();

            // 재귀적으로 상품 ID 찾기
            const findItemInDatabase = (obj, path = "") => {
                // 기본 케이스: 현재 노드가 객체가 아니면 종료
                if (!obj || typeof obj !== 'object') return null;

                // 현재 경로가 찾는 상품 ID와 일치하는지 확인
                if (path.endsWith(productId)) {
                    return { data: obj, path };
                }

                // 모든 자식 노드에 대해 재귀 호출
                for (const key in obj) {
                    const newPath = path ? `${path}/${key}` : key;
                    const result = findItemInDatabase(obj[key], newPath);
                    if (result) return result;
                }

                return null;
            };

            // 상품 찾기
            const result = findItemInDatabase(items);

            if (result) {
                console.log("상품을 찾았습니다:", result.path);
                return {
                    name: result.data.name || "",
                    image: result.data.images ? result.data.images[0] : null,
                    price: result.data.price?.price || ""
                };
            } else {
                console.log("상품을 찾을 수 없습니다:", productId);
                return null;
            }
        } catch (error) {
            console.error("상품 정보 가져오기 오류:", error);
            return null;
        }
    };

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

                        // 상품 ID 확인 - info에 저장된 값 사용
                        const productId = chat.info.itemId || null;
                        console.log(`채팅방 ${chatId}의 상품 ID:`, productId);

                        // 상품 정보 가져오기
                        let productData = null;
                        if (productId && !productId.startsWith("temp_item_")) {
                            productData = await getProductData(productId);
                            console.log("찾은 상품 데이터:", productData);
                        }

                        // 최종 채팅 항목 데이터
                        return {
                            id: chatId,
                            userName: partnerData.name || "알 수 없는 사용자",
                            lastMessage: lastMessage,
                            lastMessageTime: lastMessageTime,
                            lastMessageDate: formattedDate,
                            partnerId: partnerId,
                            productId: productId,
                            productImage: productData?.image || null,
                            productName: productData?.name || "",
                            profileImage: partnerData.profileImage || null
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
                    {/* 상점 아이콘: SVG 아이콘 사용 */}
                    <div className="Chat_list_img">
                        <ChatroomSvgIcon />
                    </div>

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

                    {/* 상품 이미지: 상품 이미지가 있으면 사용, 없으면 기본 아이콘 */}
                    <div className="Chat_list_item_img_section">
                        {chat.productImage ? (
                            // base64 이미지가 이미 data:image 형식을 포함하는지 확인
                            <img
                                src={chat.productImage.startsWith('data:') ?
                                    chat.productImage :
                                    `data:image/jpeg;base64,${chat.productImage}`}
                                className="Chat_list_item_img"
                                alt={chat.productName || "상품 이미지"}
                                onError={(e) => {
                                    console.error("이미지 로드 오류", e);
                                    e.target.src = market; // 오류 시 기본 이미지로 대체
                                }}
                            />
                        ) : (
                            <img
                                src={market}
                                className="Chat_list_item_img"
                                alt="상품 이미지"
                            />
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default ChatList