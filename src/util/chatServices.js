// src/services/chatService.js
import { ref, push, set, onValue, get, query, orderByChild } from "firebase/database";
import { auth, db } from "../firebase";

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
        if (existingChat) return existingChat;

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
        console.log("채팅방 생성 성공:", chatId);

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

// 메시지 전송
export const sendMessage = async (chatId, text) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return null;

        // 빈 메시지 확인
        if (!text.trim()) {
            console.warn("빈 메시지는 전송할 수 없습니다");
            return null;
        }

        // 메시지 추가
        const messagesRef = ref(db, `chats/${chatId}/messages`);
        const newMessageRef = push(messagesRef);
        const timestamp = Date.now();

        // 메시지 데이터
        const messageData = {
            text: text.trim(),
            sender: currentUser.uid,
            timestamp: timestamp
        };

        await set(newMessageRef, messageData);

        // 채팅방 info 업데이트
        const chatInfoRef = ref(db, `chats/${chatId}/info`);
        const infoSnapshot = await get(chatInfoRef);

        if (infoSnapshot.exists()) {
            const existingInfo = infoSnapshot.val();

            // 참가자 배열 확인 및 업데이트
            let participants = existingInfo.participants || [];
            if (!Array.isArray(participants)) {
                participants = []; // 배열이 아니면 초기화
            }

            if (!participants.includes(currentUser.uid)) {
                participants.push(currentUser.uid);
            }

            // 업데이트 데이터
            const updateData = {
                ...existingInfo,
                lastMessage: text.trim(),
                lastMessageTime: timestamp,
                participants: participants
            };

            // 상품 ID 확인
            if (!updateData.itemId) {
                updateData.itemId = `temp_item_${chatId}`;
            }

            await set(chatInfoRef, updateData);
        } else {
            // info가 없는 경우 새로 생성
            await set(chatInfoRef, {
                lastMessage: text.trim(),
                lastMessageTime: timestamp,
                participants: [currentUser.uid],
                itemId: `temp_item_${chatId}`
            });
        }

        return newMessageRef.key;
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