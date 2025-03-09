import './Dibs_button.css';
import Heart_icon from './Heart_icon.png';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from "../../../../firebase";
import { ref, update, get, runTransaction } from "firebase/database";

function Dibs_button({ itemId, itemPath }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        // 좋아요 상태 및 개수 가져오기
        const fetchLikeStatus = async () => {
            if (!itemPath) return;

            try {
                // 상품 정보 참조
                const itemRef = ref(db, itemPath);
                const snapshot = await get(itemRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    // 좋아요 수 설정
                    setLikeCount(data.likeCount || 0);

                    // 현재 사용자가 이미 좋아요했는지 확인
                    if (auth.currentUser && data.likes && data.likes[auth.currentUser.uid]) {
                        setLiked(true);
                    }
                }
            } catch (error) {
                console.error("좋아요 상태 가져오기 오류:", error);
            }
        };

        fetchLikeStatus();
    }, [itemPath, auth.currentUser]);

    const toggleLike = async () => {
        // 로그인 확인
        if (!auth.currentUser) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        if (!itemPath) {
            console.error("상품 경로가 없습니다.");
            return;
        }

        setLoading(true);

        try {
            const userId = auth.currentUser.uid;
            const likesRef = ref(db, `${itemPath}`);

            // 트랜잭션을 사용하여 좋아요 업데이트
            await runTransaction(likesRef, (currentData) => {
                if (!currentData) {
                    return { likes: {}, likeCount: 0 };
                }

                const likes = currentData.likes || {};
                const count = currentData.likeCount || 0;

                // 좋아요 추가 또는 제거
                if (likes[userId]) {
                    // 좋아요 취소
                    delete likes[userId];
                    setLiked(false);
                    setLikeCount(count - 1);
                    return { ...currentData, likes, likeCount: count - 1 };
                } else {
                    // 좋아요 추가
                    likes[userId] = true;
                    setLiked(true);
                    setLikeCount(count + 1);
                    return { ...currentData, likes, likeCount: count + 1 };
                }
            });

        } catch (error) {
            console.error("좋아요 업데이트 오류:", error);
            alert("좋아요 업데이트 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="Dibs_button"
            onClick={toggleLike}
            disabled={loading}
            style={{
                backgroundColor: liked ? '#FF5757' : '#CCC',
                cursor: 'pointer'
            }}
        >
            <img src={Heart_icon} alt="Dibs_icon" className="Dibs_icon" />
            <span className="Dibs_text">찜</span>
            <span className="Dibs_text">{likeCount}</span>
        </button>
    );
}

export default Dibs_button;