import React from 'react';
import './Follower.css';
import Market_icon from './Normal_icon.png';

function Follower({ followerData }) {
    // followerData가 없는 경우 기본값 사용
    const { name, avatar, following = 0, followers = 0 } = followerData || {};

    return (
        <div className="Follower_section">
            {/*팔로워 아이콘*/}
            <div className="Follower_icon_section">
                {avatar ? (
                    <img src={avatar} alt={`${name}의 프로필`} className="Follower_icon" />
                ) : (
                    <img src={Market_icon} alt="기본 프로필" className="Follower_icon" />
                )}
            </div>

            {/*팔로워 이름*/}
            <span className="Follower_name">{name || "사용자"}</span>

            {/*팔로워 정보*/}
            <span className="Follower_info_text">상품 {following || 0}  |  팔로워 {followers || 0}</span>
        </div>
    );
}

export default Follower;