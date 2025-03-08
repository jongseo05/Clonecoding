import { db, storage } from "./firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    limit,
    getDocs
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore"; // Timestamp import 추가

// 🔥 이미지 업로드 함수
export const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `chatImages/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
};

// Firestore에 메시지 전송
export const sendMessage = async (chatId, userId, message, photoURL, imageFile) => {
    const messagesRef = collection(db, `messages-${chatId}`);

    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile); // 이미지 업로드 후 URL 가져오기
    }

    await addDoc(messagesRef, {
        text: message,
        uid: userId,
        createdAt: new Date(),
        photoURL,
        imageUrl,  // 🔥 이미지 URL 추가
        isRead: false
    });
};

// Firestore에서 메시지 실시간으로 수신
export const listenForMessages = (chatId, callback) => {
    const messagesRef = collection(db, `messages-${chatId}`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(messages);
    });

    return unsubscribe;
};

// 🔥 메시지 읽음 상태 업데이트
export const markMessageAsRead = async (chatId, messageId) => {
    const messageRef = doc(db, `messages-${chatId}`, messageId);
    try {
        await updateDoc(messageRef, { isRead: true });
    } catch (error) {
        console.error("메시지 읽음 상태 업데이트 실패:", error);
    }
};

// Firestore 쿼리 Hook
export function useFirestoreQuery(firestoreQuery) {
    const [docs, setDocs] = useState([]);
    const queryRef = useRef(firestoreQuery); // ✅ useRef로 Firestore 쿼리 관리

    useEffect(() => {
        if (
            queryRef.current &&
            queryRef.current instanceof firestoreQuery.constructor &&
            typeof queryRef.current.isEqual === "function"
        ) {
            if (!queryRef.current.isEqual(firestoreQuery)) {
                queryRef.current = firestoreQuery;
            }
        } else {
            console.error("🚨 Firestore Query 객체가 올바르지 않습니다:", queryRef.current);
            queryRef.current = firestoreQuery;
        }
    }, [firestoreQuery]);

    useEffect(() => {
        if (!queryRef.current) return;

        const unsubscribe = onSnapshot(queryRef.current, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocs(data);
        });

        return () => unsubscribe();
    }, [queryRef]);

    return docs;
}

// 🔥 Firestore에서 마지막 메시지 가져오기 함수
export const getLastMessage = async (chatId) => {
    try {
        const messagesRef = collection(db, `messages-${chatId}`);
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const lastMessage = querySnapshot.docs[0].data();

            // createdAt이 Timestamp일 경우 Date 객체로 변환
            const createdAt = lastMessage.createdAt instanceof Timestamp ? lastMessage.createdAt.toDate() : new Date();

            return {
                ...lastMessage,
                createdAt
            }; // 마지막 메시지를 반환
        } else {
            return null;  // 메시지가 없으면 null 반환
        }
    } catch (error) {
        console.error("Error getting last message:", error);
        return null;
    }
};
