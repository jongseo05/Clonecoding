import React, { useState, useEffect } from 'react';
import './Follow_button.css';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update, get, set } from "firebase/database";

function Follow_button({ targetUserId, sellerId, followersCount, onFollowUpdate }) {
    // targetUserId가 없는 경우 sellerId를 사용
    const userId = targetUserId || sellerId;

    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [followersNum, setFollowersNum] = useState(followersCount || 0);
    const auth = getAuth();
    const db = getDatabase();

    useEffect(() => {
        console.log("Follow_button 렌더링됨. 대상 사용자 ID:", userId);
        console.log("현재 로그인된 사용자:", auth.currentUser?.uid);
    }, [userId, auth.currentUser]);

    useEffect(() => {
        // 초기 팔로우 상태 확인
        const checkFollowStatus = async () => {
            if (!auth.currentUser || !userId) {
                console.log("사용자 정보 없음:", !auth.currentUser ? "로그인 안됨" : "대상 ID 없음");
                return;
            }

            try {
                const currentUserId = auth.currentUser.uid;
                console.log("팔로우 상태 확인 중:", currentUserId, "->", userId);

                // 내가 팔로우하고 있는지 확인
                const followingRef = ref(db, `users/${currentUserId}/following/${userId}`);
                const followingSnapshot = await get(followingRef);

                const isFollowingStatus = followingSnapshot.exists() && followingSnapshot.val();
                console.log("팔로우 상태:", isFollowingStatus);
                setIsFollowing(isFollowingStatus);

                // 대상 사용자의 팔로워 수 확인
                const userRef = ref(db, `users/${userId}`);
                const userSnapshot = await get(userRef);

                if (userSnapshot.exists()) {
                    console.log("사용자 데이터:", userSnapshot.val());
                    const followers = userSnapshot.val().followers || {};
                    const followerCount = Object.keys(followers).length;
                    console.log("팔로워 수:", followerCount);
                    setFollowersNum(followerCount);
                } else {
                    console.log("사용자 데이터가 없습니다");
                }
            } catch (error) {
                console.error("팔로우 상태 확인 오류:", error);
            }
        };

        checkFollowStatus();
    }, [auth.currentUser, userId, db]);

    const toggleFollow = async () => {
        console.log("toggleFollow 호출됨");

        if (!auth.currentUser) {
            console.log("로그인 필요");
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        if (!userId) {
            console.error("대상 사용자 ID가 없습니다.");
            return;
        }

        setLoading(true);
        console.log("팔로우 상태 변경 시작:", isFollowing ? "언팔로우" : "팔로우");

        try {
            const currentUserId = auth.currentUser.uid;
            console.log("현재 사용자:", currentUserId, "대상 사용자:", userId);

            // 데이터베이스 트랜잭션 사용
            const db = getDatabase();

            // 현재 팔로우 상태 확인
            const followingRef = ref(db, `users/${currentUserId}/following/${userId}`);
            const followingSnapshot = await get(followingRef);
            const isCurrentlyFollowing = followingSnapshot.exists();

            // 두 데이터베이스 작업을 원자적으로 수행
            const updates = {};

            if (isCurrentlyFollowing) {
                // 언팔로우 처리
                updates[`users/${currentUserId}/following/${userId}`] = null;
                updates[`users/${userId}/followers/${currentUserId}`] = null;
            } else {
                // 팔로우 처리
                const timestamp = Date.now();
                updates[`users/${currentUserId}/following/${userId}`] = true;
                updates[`users/${userId}/followers/${currentUserId}`] = { timestamp };
            }

            // 모든 업데이트를 단일 작업으로 수행
            await update(ref(db), updates);

            // 마켓 정보 업데이트
            await updateMarketFollowers(currentUserId, userId, !isCurrentlyFollowing);

            setIsFollowing(!isCurrentlyFollowing);
            setFollowersNum(prev => isCurrentlyFollowing ? Math.max(0, prev - 1) : prev + 1);

            if (onFollowUpdate) {
                onFollowUpdate(isCurrentlyFollowing ? "unfollow" : "follow");
            }
        } catch (error) {
            console.error("팔로우 업데이트 오류:", error);
            alert(`팔로우 처리 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 마켓 정보의 팔로워/팔로잉 카운트 업데이트
    const updateMarketFollowers = async (currentUserId, targetUserId, isFollowing) => {
        try {
            console.log("마켓 팔로워 정보 업데이트 중");

            // 대상 사용자의 마켓 정보 업데이트
            const targetMarketRef = ref(db, `markets/${targetUserId}`);
            const targetMarketSnapshot = await get(targetMarketRef);

            if (targetMarketSnapshot.exists()) {
                const targetMarketData = targetMarketSnapshot.val();
                const currentFollowers = targetMarketData.followers || 0;

                console.log("대상 마켓 팔로워 수 업데이트:", currentFollowers, "->",
                    isFollowing ? currentFollowers + 1 : Math.max(0, currentFollowers - 1));

                await update(targetMarketRef, {
                    followers: isFollowing ? currentFollowers + 1 : Math.max(0, currentFollowers - 1)
                });
            } else {
                console.log("대상 마켓 정보가 없습니다:", targetUserId);
            }

            // 내 마켓 정보의 팔로잉 카운트 업데이트
            const myMarketRef = ref(db, `markets/${currentUserId}`);
            const myMarketSnapshot = await get(myMarketRef);

            if (myMarketSnapshot.exists()) {
                const myMarketData = myMarketSnapshot.val();
                const currentFollowing = myMarketData.following || 0;

                console.log("내 마켓 팔로잉 수 업데이트:", currentFollowing, "->",
                    isFollowing ? currentFollowing + 1 : Math.max(0, currentFollowing - 1));

                await update(myMarketRef, {
                    following: isFollowing ? currentFollowing + 1 : Math.max(0, currentFollowing - 1)
                });
            } else {
                console.log("내 마켓 정보가 없습니다:", currentUserId);
            }

            console.log("마켓 팔로워 정보 업데이트 완료");
            return true;
        } catch (error) {
            console.error("마켓 팔로워 정보 업데이트 오류:", error);
            return false;
        }
    };

    return (
        <button
            className={`Follow_button ${isFollowing ? 'following' : 'not-following'}`}
            onClick={toggleFollow}
            disabled={loading}
            style={{cursor: loading ? 'wait' : 'pointer'}}
        >
            <span className="Follow_text">
                {isFollowing ? '팔로잉' : '팔로우'}
            </span>
            <span className="Follow_text">{followersNum}</span>
        </button>
    );
}

export default Follow_button;