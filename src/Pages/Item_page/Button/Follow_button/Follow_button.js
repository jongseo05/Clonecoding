import './Follow_button.css';
import Follow_icon from './Follow_icon.png';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from "../../../../firebase";
import { ref, get, update } from "firebase/database";

function Follow_button({ sellerId }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    // 현재 팔로우 상태 확인
    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!auth.currentUser || !sellerId) return;

            try {
                const currentUserId = auth.currentUser.uid;

                // 자신의 판매 페이지인 경우 팔로우 버튼 비활성화
                if (currentUserId === sellerId) {
                    return;
                }

                // 현재 사용자가 판매자를 팔로우하고 있는지 확인
                const followingRef = ref(db, `users/${currentUserId}/following/${sellerId}`);
                const snapshot = await get(followingRef);

                setIsFollowing(snapshot.exists() && snapshot.val() === true);
            } catch (error) {
                console.error("팔로우 상태 확인 오류:", error);
            }
        };

        checkFollowStatus();
    }, [auth.currentUser, sellerId]);

    // 팔로우/언팔로우 토글 함수
    const toggleFollow = async () => {
        if (!auth.currentUser) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        if (!sellerId) {
            console.error("판매자 ID가 없습니다.");
            return;
        }

        // 자신의 판매 페이지인 경우 팔로우 불가
        if (auth.currentUser.uid === sellerId) {
            alert("자신을 팔로우할 수 없습니다.");
            return;
        }

        setLoading(true);

        try {
            const currentUserId = auth.currentUser.uid;

            if (isFollowing) {
                // 언팔로우: 팔로잉 및 팔로워 목록에서 제거
                await update(ref(db), {
                    [`users/${currentUserId}/following/${sellerId}`]: null,
                    [`users/${sellerId}/followers/${currentUserId}`]: null
                });
                setIsFollowing(false);
            } else {
                // 팔로우: 팔로잉 및 팔로워 목록에 추가
                await update(ref(db), {
                    [`users/${currentUserId}/following/${sellerId}`]: true,
                    [`users/${sellerId}/followers/${currentUserId}`]: true
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("팔로우 상태 업데이트 오류:", error);
            alert("팔로우 상태 업데이트 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="Follow_button"
            onClick={toggleFollow}
            disabled={loading || auth.currentUser?.uid === sellerId}
            style={{
                cursor: (auth.currentUser?.uid === sellerId) ? 'default' : 'pointer'
            }}
        >
            {!isFollowing && <img src={Follow_icon} className="Follow_icon" alt="팔로우 아이콘" />}
            <span className="Follow_text">
                {isFollowing ? '팔로우완료' : '팔로우'}
            </span>
        </button>
    );
}

export default Follow_button;