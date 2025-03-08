// src/Pages/Lightning_talk/Lightning_talk.js - 수정된 부분
import './Lightning_talk.css';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import Chating_list from './Chating_list/Chat_list';
import Three_dot from './Images/tabler_dots.png';
import Arrow_down from "./Images/ei_arrow-down.png";
import Chat_icon from './Images/채팅방 아이콘.png';
import Ex_icon from './Images/market_icon.png';
import Chatroom from './Chatroom/Chatroom';
import { auth, db } from "../../firebase";
import { ref, get } from "firebase/database";

function Lightning_talk() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedChatroom, setSelectedChatroom] = useState(null);
    const [user, setUser] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // URL에서 또는 location state에서 선택된 채팅방 ID 확인
    useEffect(() => {
        // Lightning_talk_button에서 전달된 state 확인
        if (location.state?.selectedChatroom) {
            setSelectedChatroom(location.state.selectedChatroom);

            // URL history 업데이트 (state 삭제)
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    // 인증 상태 감지
    useEffect(() => {
        console.log("인증 상태 확인 중...");

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                console.log("로그인된 사용자:", currentUser.uid);
            } else {
                console.log("사용자가 로그인하지 않았습니다.");
                // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
                navigate('/login', { state: { from: '/lightning-talk' } });
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // 채팅방 정보 가져오기
    useEffect(() => {
        if (!selectedChatroom || !user) return;

        const fetchChatInfo = async () => {
            try {
                // 채팅방 정보 가져오기
                const chatInfoRef = ref(db, `chats/${selectedChatroom}/info`);
                const infoSnapshot = await get(chatInfoRef);

                if (!infoSnapshot.exists()) {
                    console.error("채팅방 정보가 없습니다:", selectedChatroom);
                    return;
                }

                const info = infoSnapshot.val();
                setChatInfo(info);

                // 파트너 ID 찾기
                let partnerId = null;

                // participants 배열에서 파트너 찾기
                if (info.participants && Array.isArray(info.participants)) {
                    partnerId = info.participants.find(id => id !== user.uid);
                }

                // participants 없으면 메시지에서 찾기
                if (!partnerId) {
                    const messagesRef = ref(db, `chats/${selectedChatroom}/messages`);
                    const messagesSnapshot = await get(messagesRef);

                    if (messagesSnapshot.exists()) {
                        const messages = messagesSnapshot.val();

                        for (const msgId in messages) {
                            const msg = messages[msgId];
                            if (msg.sender && msg.sender !== user.uid) {
                                partnerId = msg.sender;
                                break;
                            }
                        }
                    }
                }

                if (!partnerId) {
                    console.warn("파트너 ID를 찾을 수 없습니다.");
                    return;
                }

                // 파트너 정보 가져오기
                const partnerRef = ref(db, `users/${partnerId}`);
                const partnerSnapshot = await get(partnerRef);

                if (partnerSnapshot.exists()) {
                    setPartnerInfo(partnerSnapshot.val());
                } else {
                    console.warn("파트너 정보를 찾을 수 없습니다:", partnerId);
                    setPartnerInfo({ name: "알 수 없는 사용자" });
                }
            } catch (error) {
                console.error("파트너 정보 로딩 오류:", error);
                setPartnerInfo({ name: "알 수 없는 사용자" });
            }
        };

        fetchChatInfo();
    }, [selectedChatroom, user]);

    const openChatroom = (chatId) => {
        setSelectedChatroom(chatId);
    };

    if (loading) {
        return (
            <div>
                <Top_navbar/>
                <Context/>
                <div className="Lightning_talk_section">
                    <div className="Lightning_talk_container">
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <p>로딩 중...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div>
            <Top_navbar/>
            <Context/>

            <div className="Lightning_talk_section">
                <div className="Lightning_talk_container">

                    {/* 대화 목록 리스트 */}
                    <div className="Lightning_talk_talkList_section">
                        <div className="Lightning_talk_other_info_section">
                            <div className="Dot_container">
                                <img src={Three_dot} className="Dot_image" alt="메뉴" />
                            </div>
                        </div>

                        <div className="Lightning_talk_list_container">
                            <div className="Lightning_talk_category_section">
                                <div className="Lightning_talk_category_container">
                                    <div className="Lightning_talk_category_text_section">
                                        전체대화
                                        <img src={Arrow_down} className="Lightning_talk_category_img" alt="화살표" />
                                    </div>
                                </div>

                                <Chating_list onClick={openChatroom} />
                            </div>
                        </div>
                    </div>

                    {/* 대화 창 */}
                    <div className="Lightning_talk_talk_section">
                        {selectedChatroom ? (
                            <>
                                {/* 상점 정보 */}
                                <div className="Lightning_talk_market_info_container">
                                    <div className="Text_container" style={{flexDirection: 'column'}}>
                                        <p style={{
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            margin: '0'
                                        }}>
                                            {partnerInfo?.name || "알 수 없는 사용자"}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: "gray",
                                            alignItems: 'center',
                                            margin: '0'
                                        }}>
                                            {partnerInfo?.phoneNumber ? `연락처: ${partnerInfo.phoneNumber}` : "연락처 정보 없음"}
                                        </p>
                                    </div>

                                    <div>
                                        <img src={Three_dot} className="Dot_image" alt="메뉴" />
                                    </div>
                                </div>

                                {/* 채팅 섹션 */}
                                <div className="Lightning_talk_talk_container">
                                    <Chatroom chatId={selectedChatroom} />
                                </div>
                            </>
                        ) : (
                            /* 선택된 채팅방이 없을 때 */
                            <div className="Lightning_talk_talk_container">
                                <img src={Chat_icon} className="Chat_icon" alt="채팅 아이콘" />
                                <h3>대화상대를 선택하세요</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lightning_talk;