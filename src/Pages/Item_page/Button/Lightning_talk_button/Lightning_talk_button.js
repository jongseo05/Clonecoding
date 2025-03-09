// Lightning_talk_button.js
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Lightning_talk_button.css'
import Lightning_talk_icon from './Lightning_talk_button_icon.png'
// 경로 수정
import { createChat } from '../../../../util/chatServices';
import { auth } from '../../../../firebase';

function Lightning_talk_button({ sellerId, itemId }) {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    const handleClick = async () => {
        if (isCreating) return;
        setIsCreating(true);

        try {
            // 로그인 확인
            if (!auth.currentUser) {
                navigate('/login', { state: { from: window.location.pathname } });
                return;
            }

            // sellerId와 itemId 확인
            if (!sellerId) {
                console.error("판매자 ID가 없습니다:", sellerId);
                alert("판매자 정보를 찾을 수 없습니다.");
                return;
            }

            if (!itemId) {
                console.error("상품 ID가 없습니다:", itemId);
                alert("상품 정보를 찾을 수 없습니다.");
                return;
            }

            console.log("채팅방 생성 시도:", { sellerId, itemId });

            // 자신과의 채팅 방지
            if (sellerId === auth.currentUser.uid) {
                alert("자신의 상품에는 번개톡을 보낼 수 없습니다.");
                setIsCreating(false);
                return;
            }

            // 채팅방 생성
            const chatId = await createChat(sellerId, itemId);

            if (chatId) {
                console.log("생성된 채팅방 ID:", chatId);
                navigate('/lightning-talk', { state: { selectedChatroom: chatId } });
            } else {
                alert('채팅방을 생성할 수 없습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('채팅방 생성 오류:', error);
            alert(`채팅방 생성 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <button
            className="Lightning_talk_button"
            onClick={handleClick}
            disabled={isCreating}
        >
            <img src={Lightning_talk_icon} alt="Lightning_talk_icon" className="Lightning_talk_icon"/>
            <span className="Lightning_talk_button_text">
                {isCreating ? '생성 중...' : '번개톡'}
            </span>
        </button>
    );
}

export default Lightning_talk_button;