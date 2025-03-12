import React, { useState, useEffect } from 'react';
import './Follower_tabs.css';
import { getDatabase, ref, get } from 'firebase/database';

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
                const allFollowers = [];

                // followers 데이터 가져오기
                const followersRef = ref(db, `followers/${userId}`);
                const snapshot = await get(followersRef);

                if (!snapshot.exists()) {
                    console.log("팔로워 데이터가 없습니다.");
                    setFollowers([]);
                    setLoading(false);
                    return;
                }

                const followersData = snapshot.val();

                // 각 팔로워 정보 처리
                const followerPromises = Object.keys(followersData).map(async (followerId) => {
                    // 사용자 정보 가져오기
                    const userRef = ref(db, `users/${followerId}`);
                    const userSnapshot = await get(userRef);

                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();

                        const follower = {
                            id: followerId,
                            name: userData.displayName || userData.username || "사용자",
                            avatar: userData.photoURL || null,
                            following: userData.following ? Object.keys(userData.following).length : 0,
                            followers: userData.followers ? Object.keys(userData.followers).length : 0,
                            timestamp: followersData[followerId].timestamp || Date.now()
                        };

                        console.log(`팔로워 발견: ${follower.name}, ID: ${follower.id}`);
                        return follower;
                    }
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

                <div className="followers-tab-header-filter">
                    {/* 필요한 경우 필터 옵션 추가 */}
                </div>
            </div>

            {/* 팔로워 그리드 */}
            <div className="followers-grid">
                {followers.map((follower) => (
                    <div key={follower.id} className="follower-item">
                        <div className="follower-avatar">
                            {follower.avatar ? (
                                <img src={follower.avatar} alt={`${follower.name}의 프로필`} />
                            ) : (
                                <div className="default-avatar">
                                    {follower.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="follower-name">{follower.name}</div>
                        <div className="follower-stats">
                            <span className="follower-stat">팔로잉 {follower.following}</span>
                            <span className="follower-stat-divider">|</span>
                            <span className="follower-stat">팔로워 {follower.followers}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowerTabs;