import './UserIcon.css';

function UserChatIcon({ text, time }) {
    return(
        <div className="User_chatIcon_section">
            <div className='User_chatIcon_time_container'>
                {time || "오후 1:43"}
            </div>
            <div className="User_chatIcon_container">
                {text || "ㅎㅇ"}
            </div>
        </div>
    )
}

export default UserChatIcon;