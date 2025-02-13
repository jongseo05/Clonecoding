import { db } from "./firebase"; // Firestore 인스턴스 가져오기
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore"; // Firebase 9 방식의 메서드들
import React, { useState, useEffect, useRef } from "react";

// Firestore에 메시지 전송
export const sendMessage = async (chatId, userId, message) => {
    const messagesRef = collection(db, `messages-${chatId}`); // Firebase 9에서 collection 함수 사용
    await addDoc(messagesRef, {
        text: message,
        uid: userId,
        createdAt: new Date(),
    });
};

// Firestore에서 메시지 실시간으로 수신
export const listenForMessages = (chatId, callback) => {
    const messagesRef = collection(db, `messages-${chatId}`); // Firebase 9에서 collection 함수 사용
    const q = query(messagesRef, orderBy("createdAt", "asc")); // 메시지를 생성 시간 순으로 정렬

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(messages); // 수신한 메시지 처리
    });

    return unsubscribe; // 구독 취소 함수 반환
};

// Firestore 쿼리 Hook
export function useFirestoreQuery(query) {
    const [docs, setDocs] = useState([]);
    const queryRef = useRef(query); // 현재 쿼리 저장

    // 쿼리 변경 감지
    useEffect(() => {
        if (!queryRef?.current?.isEqual(query)) {
            queryRef.current = query;
        }
    }, [query]);

    // 쿼리 변경 시 리스너 재등록
    useEffect(() => {
        if (!queryRef.current) {
            return null;
        }

        // Firestore 쿼리 구독
        const unsubscribe = queryRef.current.onSnapshot((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocs(data); // 상태 업데이트
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 취소
    }, [queryRef]);

    return docs;
}
