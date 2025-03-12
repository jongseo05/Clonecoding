import React, { useState, useEffect } from 'react';
import './Follower_tabs.css';
import { getDatabase, ref, get , update} from 'firebase/database';
import Follower from './Follower/Follower';

const FollowerTabs = ({ userId, isOwnProfile = false }) => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchFollowers = async () => {
            try {
                console.log("팔로워 데이터 불러오기 시작, 사용자 ID:", userId);
                const db = getDatabase();

                // 먼저 직접 사용자 데이터를 확인합니다
                const userRef = ref(db, `users/${userId}`);
                const userSnapshot = await get(userRef);

                console.log("사용자 데이터 존재 여부:", userSnapshot.exists());

                if (!userSnapshot.exists()) {
                    console.log("사용자 데이터가 없습니다");
                    setFollowers([]);
                    setLoading(false);
                    return;
                }

                const userData = userSnapshot.val();
                console.log("전체 사용자 데이터:", userData);

                // 마켓 정보도 확인
                const marketRef = ref(db, `markets/${userId}`);
                const marketSnapshot = await get(marketRef);
                console.log("마켓 데이터 존재 여부:", marketSnapshot.exists());
                if (marketSnapshot.exists()) {
                    console.log("마켓 데이터:", marketSnapshot.val());
                }

                // followers 필드가 없거나 비어있는 경우
                if (!userData.followers || Object.keys(userData.followers).length === 0) {
                    console.log("팔로워 데이터가 없습니다");
                    setFollowers([]);
                    setLoading(false);
                    return;
                }

                const followersData = userData.followers;
                console.log("팔로워 데이터:", followersData);

                // 각 팔로워 정보 처리
                const followerPromises = Object.keys(followersData).map(async (followerId) => {
                    console.log("팔로워 ID 처리 중:", followerId);

                    // 팔로워의 사용자 정보 가져오기
                    const followerUserRef = ref(db, `users/${followerId}`);
                    const followerUserSnapshot = await get(followerUserRef);

                    if (followerUserSnapshot.exists()) {
                        const followerUserData = followerUserSnapshot.val();
                        console.log("팔로워 사용자 데이터:", followerUserData);

                        // 팔로워의 마켓 정보 가져오기
                        const marketRef = ref(db, `markets/${followerId}`);
                        const marketSnapshot = await get(marketRef);
                        const marketData = marketSnapshot.exists() ? marketSnapshot.val() : {};
                        console.log("팔로워 마켓 데이터:", marketData);

                        const follower = {
                            id: followerId,
                            name: marketData.marketName || followerUserData.displayName ||
                                followerUserData.username || followerUserData.name || "사용자",
                            avatar: followerUserData.photoURL || null,
                            following: followerUserData.following ? Object.keys(followerUserData.following).length : 0,
                            followers: followerUserData.followers ? Object.keys(followerUserData.followers).length : 0,
                            timestamp: followersData[followerId] === true ? Date.now() :
                                (followersData[followerId].timestamp || Date.now())
                        };

                        console.log(`팔로워 처리 완료: ${follower.name}, ID: ${follower.id}`);
                        return follower;
                    }

                    console.log("팔로워 사용자 정보가 없습니다:", followerId);
                    return null;
                });

                const resolvedFollowers = await Promise.all(followerPromises);
                const validFollowers = resolvedFollowers.filter(follower => follower !== null);

                console.log(`총 ${validFollowers.length}명의 팔로워를 발견했습니다.`);

                // 최신순으로 정렬
                validFollowers.sort((a, b) => b.timestamp - a.timestamp);

                setFollowers(validFollowers);
            } catch (error) {
                console.error("팔로워 데이터 로드 오류:", error);
                setError(`데이터 로딩 실패: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [userId]);

    // 데이터 동기화 함수
    const synchronizeFollowerData = async (userId) => {
        try {
            const db = getDatabase();
            const marketRef = ref(db, `markets/${userId}`);
            const userRef = ref(db, `users/${userId}`);

            const [marketSnapshot, userSnapshot] = await Promise.all([
                get(marketRef),
                get(userRef)
            ]);

            if (marketSnapshot.exists() && userSnapshot.exists()) {
                const marketData = marketSnapshot.val();
                const userData = userSnapshot.val();

                // 팔로워 데이터 확인
                const followers = userData.followers || {};
                const followerCount = Object.keys(followers).length;

                console.log("마켓 팔로워 수:", marketData.followers, "실제 팔로워 수:", followerCount);

                // 카운트와 실제 데이터가 불일치하면 업데이트
                if (marketData.followers !== followerCount) {
                    await update(marketRef, {
                        followers: followerCount
                    });
                    console.log("마켓 팔로워 수 동기화 완료");
                }
            }
        } catch (error) {
            console.error("팔로워 데이터 동기화 오류:", error);
        }
    };

    // 로딩 중 표시
    if (loading) {
        return <div className="empty-follower-message"><p>팔로워를 불러오는 중입니다...</p></div>;
    }

    // 오류 발생 시 표시
    if (error) {
        return <div className="empty-follower-message"><p>{error}</p></div>;
    }

    // 팔로워가 없는 경우
    if (!followers || followers.length === 0) {
        return (
            <div className="empty-follower-message">
                <p>{isOwnProfile ? '아직 팔로워가 없습니다.' : '이 사용자를 팔로우한 사람이 없습니다.'}</p>
            </div>
        );
    }

    // 팔로워 목록 표시
    return (
        <div className="followers-tab-container">
            {/* 팔로워 탭 헤더 */}
            <div className="followers-tab-header">
                <div className="followers-tab-header-title">
                    <span className="followers-tab-header-text">팔로워</span>
                    <span className="followers-tab-header-count">{followers.length}</span>
                </div>
            </div>

            {/* 팔로워 그리드 */}
            <div className="followers-grid">
                {followers.map((follower) => (
                    <Follower key={follower.id} followerData={follower} />

                ))}
            </div>
        </div>
    );
};

export default FollowerTabs;