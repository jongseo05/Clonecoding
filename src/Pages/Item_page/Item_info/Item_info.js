import './Item_info.css'
import Item_detail_status from "../Item_status/Item_status";
import Example_item_img from '../Images/Example_item.png'
import Home_icon from '../Images/Home_icon.png'
import Heart_icon from '../Images/Heart_icon.png'
import Time_icon from '../Images/Time_icon.png'
import Eye_icon from '../Images/Eye_icon.png'
import Call_icon from '../Images/Call_icon.png'
import Dibs_button from "../Button/Dibs_button/Dibs_button";
import Lightning_talk_button from "../Button/Lightning_talk_button/Lightning_talk_button";
import Purchase_button from "../Button/Purchase_button/Purchase_button";

function Item_info() {
    return (
        <div className = "Item_page_info_section">

            <div className = "Item_info_img_section">

                <div className = "Item_info_img_container">
                    <img src = {Example_item_img} className = "Item_info_img_container"/>
                </div>

            </div>

            <div className = "Item_info_container">

                {/* 상품명 / 상품가격 */}
                <div className = "Item_info_box">
                    <span className = "Item_info_item_title">소니 디지탈 8mm 캠코더 TRV-520</span>
                    <span className="Item_info_item_price">250,000
                        <span className="Item_info_item_title">원</span>
                    </span>
                </div>

                {/* 상품 상세정보 */}
                <div className = "Page_info_section">

                    {/* 상품 게시글 상세정보 */}
                    <div className = "Page_info_container">

                        {/* 상품 게시글 좋아요 수 */}
                        <div className="Page_info_box">

                            {/* 게시글 좋아요 */}
                            <img src={Heart_icon} className="Page_info_icon"/>
                            <span className="Page_info_text">36</span>

                            {/* 게시글 조회수 */}
                            <img src={Eye_icon} style={{width : "21px" , height : "13px"}}/>
                            <span className="Page_info_text">36</span>

                            {/* 게시글 업로드 시간 */}
                            <img src={Time_icon} className="Page_info_icon"/>
                            <span className="Page_info_text">36</span>

                        </div>



                    </div>

                    {/* 상품 신고버튼 */}
                    <div className="Page_info_report_section">
                        <img src={Call_icon} className="Page_info_icon"/>
                        <span className="Page_info_text">신고하기</span>
                    </div>
                </div>

                {/* 상품 상태,배송비,직거래 지역 */}
                <div className="Item_detail_status_section">
                    
                    {/* 상품상태 */}
                    <div className="Item_detail_status_container">
                        <span className="Item_detail_status_head">• 상품상태</span>
                        <span className="Item_detail_status_text">사용감 적음</span>
                    </div>
    
                    {/* 배송비*/}
                    <div className="Item_detail_status_container">
                        <span className="Item_detail_status_head">• 배송비</span>
                        <span className="Item_detail_status_text">4500원</span>
                    </div>
    
    
                    {/* 직거래지역 */}
                    <div className="Item_detail_status_container">
                        <span className="Item_detail_status_head">• 직거래지역</span>
                        <span className="Item_detail_status_text">경상남도 양산시 양주로 32</span>
                    </div>

                </div>

                {/* 찜 , 번개톡 , 바로구매 버튼 */}
                <div className = "Item_button_section">
                    <Dibs_button/>
                    <Lightning_talk_button/>
                    <Purchase_button/>
                </div>




            </div>


        </div>
    );
}

export default Item_info;