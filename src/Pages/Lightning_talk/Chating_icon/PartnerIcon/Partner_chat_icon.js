import './Partner_chat_icon.css';

function PartnerChatIcon({ text, time }) {
    return(
        <div className="Partner_chatIcon_section">
            <div className="Partner_chatIcon_container">
                {text || "ㅎㅇ"}
            </div>
            <div className='Partner_chatIcon_time_container'>
                {time || "오후 1:43"}
            </div>
        </div>
    )
}

export default PartnerChatIcon;