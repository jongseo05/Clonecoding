import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 기본 아바타 설정
export const imageUrl = (url) => url || "/default-avatar.png";

// 현재 로그인된 사용자 정보를 Firebase에서 가져오기
export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser({
                    id: user.uid,  // ✅ 실제 로그인된 사용자의 UID
                    name: user.displayName || "익명 사용자",
                    image: imageUrl(user.photoURL), // 프로필 이미지가 없으면 기본 이미지 사용
                });
            } else {
                setCurrentUser(null); // 로그아웃 상태
            }
        });

        return () => unsubscribe();
    }, []);

    return { currentUser };
};

// 시간 포맷 함수 (기본적인 변환)
export const timeFormat = (date) => {
    return new Date(date).toLocaleTimeString();
};
