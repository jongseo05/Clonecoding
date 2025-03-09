import './Item_status.css'

function Item_detail_status(){
    return(
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
    )
}

export default Item_detail_status;