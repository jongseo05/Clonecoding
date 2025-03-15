import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login_modal.css";
import Logo from './img/Logo.png';
import Kakao from './img/kakaotalki_icon.png';
import Naver from './img/naver_icon.png';
import Phone from './img/phone_icon.png';
import { createPortal } from "react-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";

const Login_modal = ({ onClose }) => {
    const navigate = useNavigate();
    const auth = getAuth();

    // 로그인 이벤트 감지 및 팔로워 데이터 확인
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("사용자 로그인 감지:", user.uid);
                verifyFollowerData(user.uid);
            }
        });

        // 컴포넌트 언마운트 시 리스너 제거
        return () => unsubscribe();
    }, [auth]);

    // 팔로워 데이터 확인 및 복구 함수
    const verifyFollowerData = async (userId) => {
        try {
            console.log("팔로워 데이터 확인 시작, 사용자 ID:", userId);
            const db = getDatabase();

            // 사용자 데이터 가져오기
            const userRef = ref(db, `users/${userId}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                console.log("사용자 데이터:", userData);

                // 마켓 데이터 가져오기
                const marketRef = ref(db, `markets/${userId}`);
                const marketSnapshot = await get(marketRef);

                if (marketSnapshot.exists()) {
                    const marketData = marketSnapshot.val();
                    console.log("마켓 데이터:", marketData);

                    // 팔로워 필드 확인
                    if (!userData.followers) {
                        console.log("팔로워 필드 없음");

                        // 마켓에 팔로워 수가 있지만 실제 데이터가 없는 경우
                        if (marketData.followers > 0) {
                            console.log("팔로워 데이터 불일치 감지: 마켓 팔로워 수 초기화");
                            await update(marketRef, { followers: 0 });
                            console.log("마켓 팔로워 수 0으로 초기화 완료");
                        }

                        // 팔로워 필드 초기화
                        await update(userRef, { followers: {} });
                        console.log("사용자 팔로워 필드 빈 객체로 초기화 완료");
                    } else {
                        // 팔로워 필드가 존재하는 경우 수 동기화
                        const followerCount = Object.keys(userData.followers).length;
                        console.log("팔로워 수:", followerCount, "마켓 팔로워 수:", marketData.followers);

                        if (marketData.followers !== followerCount) {
                            await update(marketRef, { followers: followerCount });
                            console.log("마켓 팔로워 수 동기화 완료:", followerCount);
                        }

                        // 팔로워 데이터 검증
                        await validateFollowerData(userId, userData.followers);
                    }

                    // 팔로잉 필드 확인 및 동기화
                    if (!userData.following) {
                        console.log("팔로잉 필드 없음");

                        if (marketData.following > 0) {
                            console.log("팔로잉 데이터 불일치 감지: 마켓 팔로잉 수 초기화");
                            await update(marketRef, { following: 0 });
                            console.log("마켓 팔로잉 수 0으로 초기화 완료");
                        }

                        // 팔로잉 필드 초기화
                        await update(userRef, { following: {} });
                        console.log("사용자 팔로잉 필드 빈 객체로 초기화 완료");
                    } else {
                        // 팔로잉 필드가 존재하는 경우 수 동기화
                        const followingCount = Object.keys(userData.following).length;
                        console.log("팔로잉 수:", followingCount, "마켓 팔로잉 수:", marketData.following);

                        if (marketData.following !== followingCount) {
                            await update(marketRef, { following: followingCount });
                            console.log("마켓 팔로잉 수 동기화 완료:", followingCount);
                        }
                    }
                } else {
                    console.log("마켓 데이터가 존재하지 않습니다:", userId);
                }
            } else {
                console.log("사용자 데이터가 존재하지 않습니다:", userId);
            }

            console.log("팔로워 데이터 확인 완료");
        } catch (error) {
            console.error("팔로워 데이터 확인 오류:", error);
        }
    };

    // 팔로워 데이터 유효성 검증 함수
    const validateFollowerData = async (userId, followers) => {
        try {
            const db = getDatabase();
            let isDataModified = false;

            // 각 팔로워 ID가 실제로 존재하는지 확인
            for (const followerId in followers) {
                const followerUserRef = ref(db, `users/${followerId}`);
                const followerUserSnapshot = await get(followerUserRef);

                if (!followerUserSnapshot.exists()) {
                    console.log("존재하지 않는 팔로워 ID 발견:", followerId);

                    // 존재하지 않는 팔로워 ID 제거
                    await update(ref(db, `users/${userId}/followers`), {
                        [followerId]: null
                    });

                    isDataModified = true;
                    console.log("존재하지 않는 팔로워 ID 제거 완료:", followerId);
                } else {
                    // 해당 사용자의 following에 현재 사용자가 있는지 확인
                    const followerData = followerUserSnapshot.val();

                    if (!followerData.following || !followerData.following[userId]) {
                        console.log("양방향 팔로우 관계 불일치 발견:", followerId);

                        // 타임스탬프 확인 및 설정
                        const timestamp = followers[followerId] && followers[followerId].timestamp
                            ? followers[followerId].timestamp
                            : Date.now();

                        // 양방향 관계 복구
                        await update(ref(db, `users/${followerId}/following`), {
                            [userId]: true
                        });

                        console.log("양방향 팔로우 관계 복구 완료:", followerId);
                    }
                }
            }

            // 데이터가 수정된 경우 마켓 정보 업데이트
            if (isDataModified) {
                // 수정된 팔로워 데이터 다시 가져오기
                const updatedUserRef = ref(db, `users/${userId}`);
                const updatedUserSnapshot = await get(updatedUserRef);

                if (updatedUserSnapshot.exists()) {
                    const updatedUserData = updatedUserSnapshot.val();
                    const updatedFollowerCount = updatedUserData.followers
                        ? Object.keys(updatedUserData.followers).length
                        : 0;

                    // 마켓 팔로워 수 업데이트
                    await update(ref(db, `markets/${userId}`), {
                        followers: updatedFollowerCount
                    });

                    console.log("마켓 팔로워 수 재동기화 완료:", updatedFollowerCount);
                }
            }
        } catch (error) {
            console.error("팔로워 데이터 유효성 검증 오류:", error);
        }
    };

    {/* 배경 클릭 시 모달 닫기 */}
    const handleBackgroundClick = (e) => {
        if (e.target.className === "Login_back") {
            onClose(false);
        }
    };

    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) {
        console.error("#modal-root not found in DOM");
        return null; // modal-root가 없으면 렌더링하지 않음
    }

    return createPortal(
        <div className="Login_back" onClick={handleBackgroundClick}>
            <div className="Login_modal" onClick={(e) => e.stopPropagation()}>
                {/* 로고 */}
                <img src={Logo} alt="번개장터 로고" className="Login_logo" />

                {/* 제목 */}
                <div className="Login_title_section">
                    <p className="Login_title">번개장터로 중고거래 시작하기</p>
                </div>

                {/* 설명 */}
                <div className="Login_explain_section">
                    <p className="Login_explain">간편하게 가입하고 상품을 확인하세요</p>
                </div>

                {/* 로그인 버튼들 */}
                <div className="Login_button_section">
                    {/* 카카오 로그인 버튼 */}
                    <div className="Login_button">
                        <img src={Kakao} className="Login_button_img" alt="카카오" />
                        <p className="Login_button_text">카카오 로그인</p>
                    </div>
                    {/* 네이버 로그인 버튼 */}
                    <div className="Login_button">
                        <img src={Naver} className="Login_button_img" alt="네이버" />
                        <p className="Login_button_text">네이버 로그인</p>
                    </div>
                    {/* 일반 로그인 버튼 */}
                    <Link to="/sign_up" className="Login_button">
                        <img src={Phone} className="Login_button_img" alt="일반" />
                        <p className="Login_button_text">일반 로그인</p>
                    </Link>
                </div>

                <div className="Login_info_section">
                    <p className="Login_info_text">
                        도움이 필요하면 이메일 또는 고객센터1670-2910로 문의 부탁드립니다.
                    </p>
                </div>
            </div>
        </div>,
        modalRoot // HTML의 modal-root 요소에 렌더링
    );
};

export default Login_modal;