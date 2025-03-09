import './Partner_chat_icon.css';

function PartnerChatIcon({ text, imageUrl, time, isImage }) {
    return (
        <div className="PartnerChatIcon_section">
            <div className="PartnerChatIcon_profile">
                {/* 프로필 이미지 */}
            </div>
            <div className="PartnerChatIcon_chat">
                {isImage ? (
                    <img
                        src={imageUrl}
                        alt="받은 이미지"
                        className="PartnerChatIcon_image"
                        style={{
                            maxWidth: '265px',
                            maxHeight: '265px',
                            borderRadius: '8px',
                            objectFit: 'contain'
                        }}
                    />
                ) : (
                    <p style={{
                        marginTop : '0px',
                        marginBottom : '0px'}}>{text}</p>
                )}
            </div>
            <div className="PartnerChatIcon_time_container">{time}</div>
        </div>
    );
}

export default PartnerChatIcon;