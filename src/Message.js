import React from "react";

// Message 컴포넌트
const Message = ({ text, displayName, photoURL, senderId }) => {
    return (
        <div className="message-container flex items-center space-x-2 p-3 border-b">
            {/* 사용자 프로필 이미지 */}
            {photoURL && (
                <img
                    src={photoURL}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                />
            )}

            {/* 사용자 이름과 메시지 내용 */}
            <div className="message-content flex flex-col">
                <span className="text-sm font-semibold">{displayName}</span>
                <span className="text-gray-800">{text}</span>
            </div>
        </div>
    );
};

export default Message;
