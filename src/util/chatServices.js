// src/services/chatService.js
import { ref, push, set, onValue, get, query, orderByChild } from "firebase/database";
import { auth, db } from "../firebase";

// 현재 사용자 가져오기 (보조 함수)
const getCurrentUser = () => {
    return auth.currentUser;
};

// 사용자의 채팅 목록에 채팅을 저장하는 함수
export const saveChatToUserList = async (userId, chatId, additionalInfo = {}) => {
    try {
        // 사용자의 채팅 목록 참조 생성
        const userChatsRef = ref(db, `users/${userId}/chats/${chatId}`);

        // 채팅 정보 구성
        const chatInfo = {
            chatId: chatId,
            lastAccessed: Date.now(),
            ...additionalInfo
        };

        // 데이터베이스에 저장
        await set(userChatsRef, chatInfo);

        return true;
    } catch (error) {
        console.error("채팅 목록 저장 오류:", error);
        throw error;
    }
};

// 활성 채팅 설정 함수
export const setActiveChat = async (userId, chatId) => {
    try {
        // 사용자의 활성 채팅 참조 생성
        const activeRef = ref(db, `users/${userId}/activeChat`);

        // 활성 채팅 정보 저장
        await set(activeRef, {
            chatId: chatId,
            timestamp: Date.now()
        });

        return true;
    } catch (error) {
        console.error("활성 채팅 설정 오류:", error);
        throw error;
    }
};

// 사용자의 채팅 목록 가져오기 함수
export const getUserChatList = (userId, callback) => {
    if (!userId) {
        console.error("사용자 ID가 필요합니다");
        callback([]);
        return () => {};
    }

    try {
        // 사용자의 채팅 목록 참조 생성
        const userChatsRef = ref(db, `users/${userId}/chats`);

        // 실시간 리스너 설정
        return onValue(userChatsRef, (snapshot) => {
            if (snapshot.exists()) {
                const chatList = [];
                snapshot.forEach((childSnapshot) => {
                    const chatId = childSnapshot.key;
                    const chatData = childSnapshot.val();
                    chatList.push({
                        id: chatId,
                        ...chatData
                    });
                });

                // 최신 접근 순으로 정렬
                chatList.sort((a, b) => b.lastAccessed - a.lastAccessed);

                callback(chatList);
            } else {
                callback([]);
            }
        }, (error) => {
            console.error("채팅 목록 가져오기 오류:", error);
            callback([]);
        });
    } catch (error) {
        console.error("getUserChatList 오류:", error);
        callback([]);
        return () => {};
    }
};

// 활성 채팅 가져오기 함수
export const getActiveChat = async (userId) => {
    try {
        const activeRef = ref(db, `users/${userId}/activeChat`);
        const snapshot = await get(activeRef);

        if (snapshot.exists()) {
            return snapshot.val().chatId;
        }
        return null;
    } catch (error) {
        console.error("활성 채팅 가져오기 오류:", error);
        return null;
    }
};

// 새 채팅방 생성
export const createChat = async (sellerId, itemId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // sellerId와 itemId 필수 검증
    if (!sellerId) {
        console.error("판매자 ID가 없습니다.");
        throw new Error("판매자 ID는 필수입니다.");
    }

    if (!itemId) {
        console.error("상품 ID가 없습니다.");
        throw new Error("상품 ID는 필수입니다.");
    }

    try {
        // 이미 존재하는 채팅방 확인
        const existingChat = await findChatByParticipants(currentUser.uid, sellerId, itemId);
        if (existingChat) {
            // 이미 존재하는 채팅방이면 사용자 목록 및 활성 채팅 업데이트
            await saveChatToUserList(currentUser.uid, existingChat, {
                withUser: sellerId,
                itemId: itemId,
                role: 'buyer'
            });

            await setActiveChat(currentUser.uid, existingChat);
            return existingChat;
        }

        // 새 채팅방 생성
        const chatsRef = ref(db, "chats");
        const newChatRef = push(chatsRef);
        const chatId = newChatRef.key;

        // 채팅방 데이터 - 올바른 구조 사용
        const chatData = {
            info: {
                lastMessage: "",
                lastMessageTime: Date.now(),
                participants: [currentUser.uid, sellerId], // 참가자 배열 필수
                itemId: itemId                            // 상품 ID 필수
            }
        };

        // Firebase에 데이터 저장
        await set(newChatRef, chatData);

        // 구매자(현재 사용자)의 채팅 목록에 저장
        await saveChatToUserList(currentUser.uid, chatId, {
            withUser: sellerId,
            itemId: itemId,
            role: 'buyer'
        });

        // 판매자의 채팅 목록에도 저장
        await saveChatToUserList(sellerId, chatId, {
            withUser: currentUser.uid,
            itemId: itemId,
            role: 'seller'
        });

        // 활성 채팅으로 설정
        await setActiveChat(currentUser.uid, chatId);

        return chatId;
    } catch (error) {
        console.error("채팅방 생성 중 오류 발생:", error);
        throw error;
    }
};

// 참가자로 채팅방 찾기
export const findChatByParticipants = async (userId1, userId2, itemId) => {
    try {
        const chatsRef = ref(db, "chats");
        const snapshot = await get(chatsRef);
        let foundChatId = null;

        if (snapshot.exists()) {
            const chats = snapshot.val();
            Object.keys(chats).forEach(chatId => {
                const chat = chats[chatId];

                // info와 participants 배열이 있는지 확인
                if (chat.info && chat.info.participants) {
                    const participants = chat.info.participants;

                    // 두 참가자가 모두 있고 상품 ID가 일치하는지 확인
                    if (
                        participants.includes(userId1) &&
                        participants.includes(userId2) &&
                        chat.info.itemId === itemId
                    ) {
                        foundChatId = chatId;
                    }
                }
            });
        }

        return foundChatId;
    } catch (error) {
        console.error("채팅방 찾기 오류:", error);
        return null;
    }
};

// 사용자의 모든 채팅방 가져오기
export const getUserChats = (userId, callback) => {
    if (!userId) {
        console.error("사용자 ID가 필요합니다");
        callback({});
        return () => {};
    }

    try {
        const chatsRef = ref(db, "chats");

        return onValue(chatsRef, (snapshot) => {
            if (snapshot.exists()) {
                const chats = snapshot.val();
                const userChats = {};

                Object.keys(chats).forEach(chatId => {
                    const chat = chats[chatId];

                    // 참가자 배열에서 사용자 참여 확인 (항상 확인)
                    let isUserInChat = false;
                    if (chat.info && chat.info.participants) {
                        if (chat.info.participants.includes(userId)) {
                            isUserInChat = true;
                        }
                    }

                    // 참가자 배열이 없는 경우 메시지에서 사용자 참여 확인
                    if (!isUserInChat && chat.messages) {
                        Object.values(chat.messages).forEach(msg => {
                            if (msg.sender === userId) {
                                isUserInChat = true;
                            }
                        });
                    }

                    // 사용자가 참여한 채팅방만 추가
                    if (isUserInChat) {
                        userChats[chatId] = chat;
                    }
                });

                callback(userChats);
            } else {
                callback({});
            }
        }, (error) => {
            console.error("채팅방 가져오기 오류:", error);
            callback({});
        });
    } catch (error) {
        console.error("getUserChats 오류:", error);
        callback({});
        return () => {};
    }
};

// 메시지 전송 함수 확장 (텍스트 또는 이미지 전송 지원)
export const sendMessage = async (chatId, text, mediaContent = null) => {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) throw new Error("로그인이 필요합니다");

        // 텍스트 메시지나 미디어 컨텐츠 중 하나는 있어야 함
        if (!text && !mediaContent) {
            throw new Error("메시지 내용이 필요합니다");
        }

        if (!chatId) {
            throw new Error("채팅방 ID가 필요합니다");
        }

        // 메시지 데이터 구성
        const messageData = {
            sender: currentUser.uid,
            timestamp: Date.now()
        };

        // 텍스트 메시지인 경우 (text가 null이 아니고 유효한 문자열일 때)
        if (text !== null && text !== undefined && text.trim()) {
            messageData.text = text.trim();
            messageData.type = 'text';
        }
        // 미디어 메시지인 경우 (mediaContent가 유효한 객체일 때)
        else if (mediaContent && typeof mediaContent === 'object') {
            messageData.type = mediaContent.type;

            // 이미지인 경우
            if (mediaContent.type === 'image' && mediaContent.url) {
                messageData.imageUrl = mediaContent.url;
                messageData.width = mediaContent.width || 265;
                messageData.height = mediaContent.height || 265;
            }
        }

        // 메시지 추가
        const messagesRef = ref(db, `chats/${chatId}/messages`);
        const newMessageRef = push(messagesRef);

        // Firebase에 메시지 저장
        await set(newMessageRef, messageData);

        // 나머지 코드...
    } catch (error) {
        console.error("메시지 전송 오류:", error);
        throw error;
    }
};

// 채팅방 메시지 가져오기 (실시간 업데이트)
export const getChatMessages = (chatId, callback) => {
    if (!chatId) {
        console.error("채팅방 ID가 필요합니다");
        callback([]);
        return () => {};
    }

    try {
        const messagesRef = ref(db, `chats/${chatId}/messages`);
        const messagesQuery = query(messagesRef, orderByChild('timestamp'));

        return onValue(messagesQuery, (snapshot) => {
            const messages = [];

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const message = {
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    };
                    messages.push(message);
                });
            }

            callback(messages);
        }, (error) => {
            console.error("메시지 가져오기 오류:", error);
            callback([]);
        });
    } catch (error) {
        console.error("getChatMessages 오류:", error);
        callback([]);
        return () => {};
    }
};

// 채팅방 정보 가져오기
export const getChatInfo = (chatId, callback) => {
    if (!chatId) {
        console.error("채팅방 ID가 필요합니다");
        callback(null);
        return () => {};
    }

    try {
        const chatInfoRef = ref(db, `chats/${chatId}/info`);

        return onValue(chatInfoRef, (snapshot) => {
            if (snapshot.exists()) {
                // 데이터 확인 및 기본값 설정
                const rawData = snapshot.val();

                // 구조화된 데이터 반환
                const chatInfo = {
                    lastMessage: rawData.lastMessage || "",
                    lastMessageTime: rawData.lastMessageTime || Date.now(),
                    participants: rawData.participants || [],
                    itemId: rawData.itemId || null
                };

                callback(chatInfo);
            } else {
                console.warn(`채팅방 정보 없음: ${chatId}`);
                callback({
                    lastMessage: "",
                    lastMessageTime: Date.now(),
                    participants: [],
                    itemId: null
                });
            }
        }, (error) => {
            console.error("채팅방 정보 가져오기 오류:", error);
            callback(null);
        });
    } catch (error) {
        console.error("getChatInfo 오류:", error);
        callback(null);
        return () => {};
    }
};