import { getDatabase, ref, get, update, set } from 'firebase/database';

/**
 * 사용자 팔로우 관계를 확인하는 유틸리티 함수
 */
export const checkFollowStatus = async (currentUserId, targetUserId) => {
    if (!currentUserId || !targetUserId) return false;

    try {
        const db = getDatabase();
        const followingRef = ref(db, `users/${currentUserId}/following/${targetUserId}`);
        const snapshot = await get(followingRef);

        return snapshot.exists() && snapshot.val();
    } catch (error) {
        console.error("팔로우 상태 확인 오류:", error);
        return false;
    }
};

// 사용자들의 팔로워 목록을 가져오는 함수
export const fetchUserFollowers = async (userId) => {
    if (!userId) return [];

    try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        // 사용자 데이터가 없으면 빈 배열 반환
        if (!snapshot.exists()) {
            console.log("사용자 데이터가 없습니다");
            return [];
        }

        const userData = snapshot.val();

        // 팔로워 필드가 없으면 초기화하고 빈 배열 반환
        if (!userData.followers) {
            await update(userRef, { followers: {} });
            console.log("팔로워 필드 초기화됨");
            return [];
        }

        const followersData = userData.followers;

        // 팔로워가 없으면 빈 배열 반환
        if (Object.keys(followersData).length === 0) {
            return [];
        }

        // 각 팔로워의 세부 정보 가져오기
        const followerPromises = Object.keys(followersData).map(async (followerId) => {
            // 사용자 정보 가져오기
            const followerUserRef = ref(db, `users/${followerId}`);
            const followerUserSnapshot = await get(followerUserRef);

            if (followerUserSnapshot.exists()) {
                const followerUserData = followerUserSnapshot.val();

                // 마켓 정보 가져오기
                const marketRef = ref(db, `markets/${followerId}`);
                const marketSnapshot = await get(marketRef);
                const marketData = marketSnapshot.exists() ? marketSnapshot.val() : {};

                return {
                    id: followerId,
                    name: marketData.marketName || followerUserData.displayName ||
                        followerUserData.username || followerUserData.name || "사용자",
                    avatar: followerUserData.photoURL || null,
                    following: followerUserData.following ? Object.keys(followerUserData.following).length : 0,
                    followers: followerUserData.followers ? Object.keys(followerUserData.followers).length : 0,
                    timestamp: followersData[followerId] === true ? Date.now() :
                        (followersData[followerId].timestamp || Date.now())
                };
            }

            // 유효하지 않은 팔로워는 자동으로 제거
            await set(ref(db, `users/${userId}/followers/${followerId}`), null);
            console.log("존재하지 않는 팔로워 제거:", followerId);
            return null;
        });

        const resolvedFollowers = await Promise.all(followerPromises);
        const validFollowers = resolvedFollowers.filter(follower => follower !== null);

        // 마켓 팔로워 수 동기화
        await syncMarketFollowerCount(userId, validFollowers.length);

        return validFollowers;
    } catch (error) {
        console.error("팔로워 목록 가져오기 오류:", error);
        return [];
    }
};

/**
 * 마켓의 팔로워 수를 동기화하는 함수
 */
export const syncMarketFollowerCount = async (userId, followerCount) => {
    try {
        const db = getDatabase();
        const marketRef = ref(db, `markets/${userId}`);
        const marketSnapshot = await get(marketRef);

        if (marketSnapshot.exists()) {
            const marketData = marketSnapshot.val();

            if (marketData.followers !== followerCount) {
                await update(marketRef, {
                    followers: followerCount
                });
                console.log("마켓 팔로워 수 동기화됨:", followerCount);
            }
        }
    } catch (error) {
        console.error("마켓 팔로워 수 동기화 오류:", error);
    }
};

/**
 * 팔로우/언팔로우 기능 구현 함수
 */
export const toggleFollowUser = async (currentUserId, targetUserId) => {
    if (!currentUserId || !targetUserId) {
        throw new Error("사용자 ID가 필요합니다.");
    }

    const db = getDatabase();

    // 현재 팔로우 상태 확인
    const isFollowing = await checkFollowStatus(currentUserId, targetUserId);

    // 나의 following 목록 업데이트
    const myFollowingRef = ref(db, `users/${currentUserId}/following/${targetUserId}`);

    // 대상 사용자의 followers 목록 업데이트
    const targetFollowersRef = ref(db, `users/${targetUserId}/followers/${currentUserId}`);

    try {
        if (isFollowing) {
            // 언팔로우 처리
            await set(myFollowingRef, null);
            await set(targetFollowersRef, null);

            // 마켓 정보 업데이트
            await updateMarketsFollowCount(currentUserId, targetUserId, false);

            return { success: true, action: 'unfollow' };
        } else {
            // 팔로우 처리
            const timestamp = Date.now();
            await set(myFollowingRef, true);

            // 대상 사용자의 followers에 timestamp 포함하여 저장
            await set(targetFollowersRef, {
                timestamp: timestamp
            });

            // 마켓 정보 업데이트
            await updateMarketsFollowCount(currentUserId, targetUserId, true);

            return { success: true, action: 'follow' };
        }
    } catch (error) {
        console.error("팔로우 토글 오류:", error);
        throw error;
    }
};

/**
 * 마켓 정보의 팔로워/팔로잉 카운트 업데이트
 */
export const updateMarketsFollowCount = async (currentUserId, targetUserId, isFollowing) => {
    const db = getDatabase();

    try {
        // 대상 사용자의 마켓 정보 업데이트
        const targetMarketRef = ref(db, `markets/${targetUserId}`);
        const targetMarketSnapshot = await get(targetMarketRef);

        if (targetMarketSnapshot.exists()) {
            const targetMarketData = targetMarketSnapshot.val();
            const currentFollowers = targetMarketData.followers || 0;

            await update(targetMarketRef, {
                followers: isFollowing ? currentFollowers + 1 : Math.max(0, currentFollowers - 1)
            });
        }

        // 내 마켓 정보의 팔로잉 카운트 업데이트
        const myMarketRef = ref(db, `markets/${currentUserId}`);
        const myMarketSnapshot = await get(myMarketRef);

        if (myMarketSnapshot.exists()) {
            const myMarketData = myMarketSnapshot.val();
            const currentFollowing = myMarketData.following || 0;

            await update(myMarketRef, {
                following: isFollowing ? currentFollowing + 1 : Math.max(0, currentFollowing - 1)
            });
        }

        return true;
    } catch (error) {
        console.error("마켓 팔로워 정보 업데이트 오류:", error);
        throw error;
    }
};