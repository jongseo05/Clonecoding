import React from "react";
import PropTypes from "prop-types";
import { useCurrentUser, timeFormat } from "./frontend";
import './Message.css';

const Message = ({
                     createdAt = null,
                     uid = "",
                     text = "",
                     displayName = "",
                     photoURL = "",
                     isRead = false,
                 }) => {
    const { currentUser } = useCurrentUser();
    if (!text) return null;

    const isCurrentUser = uid === currentUser?.id;

    return (
        <div className="message-wrapper">
            <div className={`message-container ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                {/* 메시지 내용 */}
                <div className={`message-content ${isCurrentUser ? "current-user" : "other-user"}`}>
                    <span className="message-name">{displayName}</span>
                    <span className="message-text">{text}</span>
                </div>

                {/* 읽음 여부 & 시간 */}
                <div className="message-status">
                    {createdAt?.seconds ? (
                        <span className={`message-time ${isCurrentUser ? "text-right" : ""}`}>
                            {/* 읽음 상태 표시 */}
                            {isCurrentUser && (
                                <div className={`read-status ${isRead ? "read" : "unread"}`}>
                                    {isRead ? "읽음" : "안읽음"}
                                </div>
                            )}
                            {/* 메시지 전송 시간 */}
                            {timeFormat(new Date(createdAt.seconds * 1000))}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

Message.propTypes = {
    text: PropTypes.string,
    createdAt: PropTypes.shape({
        seconds: PropTypes.number,
    }),
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
    uid: PropTypes.string,
    isRead: PropTypes.bool,
};

export default Message;
