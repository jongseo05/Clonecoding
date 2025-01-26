import './Chat_list.css';
import market from '../Images/market_icon.png'


function ChatList() {
    return(
        <div className="Chat_list_section">
            <img src = {market} className = "Chat_list_img"/>

            {/*상점명,최근 대화,최근 대화 일자*/}
            <div className = "Chat_list_text_section">
                <div className = "Chat_list_strong_section">
                    <strong>상점명</strong>
                </div>
                <div className = "Chat_list_normal_text_section">
                    <div className= "Chat_list_recent_chat_text">
                        ㅎㅇ
                    </div>
                    <div className = "Chat_list_recent_date_text">
                        ・ 1월19일
                    </div>
                </div>
            </div>

            {/*상품 이미지*/}
            <div className = "Chat_list_item_img_section">
                <img src = {market} className = "Chat_list_item_img"/>
            </div>

        </div>

    )
}

export default ChatList;