import './Item_info.css';
import React from 'react';
import Home_icon from '../Images/Home_icon.png';
import Heart_icon from '../Images/Heart_icon.png';
import Time_icon from '../Images/Time_icon.png';
import Eye_icon from '../Images/Eye_icon.png';
import Call_icon from '../Images/Call_icon.png';
import Dibs_button from "../Button/Dibs_button/Dibs_button";
import Lightning_talk_button from "../Button/Lightning_talk_button/Lightning_talk_button";
import Purchase_button from "../Button/Purchase_button/Purchase_button";

function Item_info({ item, itemPath }) {
    // 가격 포맷팅 함수
    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 타임스탬프를 "n시간전" 형식으로 변환하는 함수
    const getTimeAgo = (timestamp) => {
        if (!timestamp) return "시간 정보 없음";

        const now = new Date().getTime();
        const postedTime = timestamp;
        const diffHours = Math.floor((now - postedTime) / (1000 * 60 * 60));

        if (diffHours < 1) {
            return "방금 전";
        } else if (diffHours < 24) {
            return `${diffHours}시간전`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}일 전`;
        }
    };

    // Base64 이미지 유효성 확인
    const isValidBase64Image = (url) => {
        if (!url) return false;
        return url.startsWith('data:image/');
    };

    // 신고하기 버튼 클릭 핸들러
    const handleReport = () => {
        alert("신고가 접수되었습니다. 관리자가 검토 후 조치하겠습니다.");
    };

    return (
        <div className="Item_page_info_section">
            <div className="Item_info_img_section">
                <div className="Item_info_img_container">
                    {item.imageUrl && isValidBase64Image(item.imageUrl) ? (
                        <img
                            src={item.imageUrl}
                            className="Item_info_img_container"
                            alt={item.name}
                        />
                    ) : (
                        <div
                            className="Item_info_img_container"
                            style={{
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <p>이미지 준비중</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="Item_info_container">
                {/* 상품명 / 상품가격 */}
                <div className="Item_info_box">
                    <span className="Item_info_item_title">{item.name}</span>
                    <span className="Item_info_item_price">{formatPrice(item.price)}
                        <span className="Item_info_item_title">원</span>
                    </span>
                </div>

                {/* 상품 상세정보 */}
                <div className="Page_info_section">
                    {/* 상품 게시글 상세정보 */}
                    <div className="Page_info_container">
                        {/* 상품 게시글 좋아요 수 */}
                        <div className="Page_info_box">
                            {/* 게시글 좋아요 */}
                            <img src={Heart_icon} className="Page_info_icon" alt="좋아요"/>
                            <span className="Page_info_text">{item.likeCount || 0}</span>

                            {/* 게시글 조회수 */}
                            <img src={Eye_icon} style={{width: "21px", height: "13px"}} alt="조회수"/>
                            <span className="Page_info_text">{item.viewCount || 0}</span>

                            {/* 게시글 업로드 시간 */}
                            <img src={Time_icon} className="Page_info_icon" alt="시간"/>
                            <span className="Page_info_text">{getTimeAgo(item.timestamp)}</span>
                        </div>
                    </div>

                    {/* 상품 신고버튼 */}
                    <div className="Page_info_report_section" onClick={handleReport} style={{ cursor: 'pointer' }}>
                        <img src={Call_icon} className="Page_info_icon" alt="신고하기"/>
                        <span className="Page_info_text">신고하기</span>
                    </div>
                </div>

                {/* 상품 상태,배송비,직거래 지역 */}
                <div className="Item_detail_status_section">
                    {/* 상품상태 */}
                    <div className="Item_detail_status_container">
                        <span className="Item_detail_status_head">• 상품상태</span>
                        <span className="Item_detail_status_text">{item.status || "판매중"}</span>
                    </div>

                    {/* 배송비*/}
                    <div className="Item_detail_status_container">
                        <span className="Item_detail_status_head">• 배송비</span>
                        <span className="Item_detail_status_text">
                            {item.extraInfo && item.extraInfo.shipping ?
                                formatPrice(item.extraInfo.shipping) + "원" :
                                item.package && item.package.packageOption === "included" ?
                                    "무료배송" : "별도 문의"}
                        </span>
                    </div>

                    {/* 직거래지역 */}
                    <div className="Item_detail_status_container">
                        <span className="Item_detail_status_head">• 직거래지역</span>
                        <span className="Item_detail_status_text">
                            {item.extraInfo && item.extraInfo.location ?
                                item.extraInfo.location :
                                item.extraInfo && item.extraInfo.tradeOption === "직거래_가능" ?
                                    "직거래 가능 (장소 문의)" : "직거래 불가"}
                        </span>
                    </div>
                </div>

                {/* 찜 , 번개톡 , 바로구매 버튼 */}
                <div className="Item_button_section">
                    <Dibs_button itemId={item.id} itemPath={itemPath} />
                    <Lightning_talk_button />
                    <Purchase_button />
                </div>
            </div>
        </div>
    );
}

export default Item_info;