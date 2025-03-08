import './UserIcon.css';

function UserChatIcon({ text, imageUrl, time, isImage }) {
    return (
        <div className="User_chatIcon_section">
            <div className="UserChatIcon_chat">
                {isImage ? (
                    <>
                        <div className="User_chatIcon_time_container">{time}</div>
                        <img
                            src={imageUrl}
                            alt="보낸 이미지"
                            className="UserChatIcon_image"
                            style={{
                                width: "128px",
                                maxHeight: '128px',
                                borderRadius: '25px',
                                objectFit: 'cover',
                            }}
                        />
                    </>
                ) : (
                    <>
                        <div className="User_chatIcon_time_container">{time}</div>
                        <div className="User_chatIcon_container">{text}</div>
                    </>
                        )
                }
            </div>

        </div>
    );
}
export default UserChatIcon