import { db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Query } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";

// Firestore에 메시지 전송
export const sendMessage = async (chatId, userId, message) => {
    const messagesRef = collection(db, `messages-${chatId}`);
    await addDoc(messagesRef, {
        text: message,
        uid: userId,
        createdAt: new Date(),
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

// Firestore 쿼리 Hook
export function useFirestoreQuery(query) {
    const [docs, setDocs] = useState([]);
    const queryRef = useRef(query); // ✅ useRef로 Firestore 쿼리 관리

    useEffect(() => {
        if (queryRef.current && queryRef.current instanceof Query && typeof queryRef.current.isEqual === "function") {
            if (!queryRef.current.isEqual(query)) {
                queryRef.current = query;
            }
        } else {
            console.error("🚨 Firestore Query 객체가 올바르지 않습니다:", queryRef.current);
            queryRef.current = query;
        }
    }, [query]);

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
