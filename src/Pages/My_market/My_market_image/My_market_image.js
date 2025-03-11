import './My_market_image.css'
import Market_icon from './Market_icon.png'
import { useNavigate } from 'react-router-dom';

function My_market_image({ marketName, isOwnMarket }) {
    const navigate = useNavigate();

    /* 상점 관리 페이지로 이동하는 함수 */
    const handleManageMarket = () => {
        navigate('/market-management');
    };

    return(
        <>
            <div className="My_market_image_container">
                <div className="My_market_image_info_container">
                    {/* 상점 아이콘 */}
                    <div className="Market_icon_container">
                        <img src={Market_icon} alt="Market_icon" className="Market_icon"/>
                    </div>

                    {/* 상점 이름 */}
                    <div className="Market_name">
                        <p>{marketName || '상점명 미설정'}</p>
                    </div>

                    {/* 상점 관리 버튼 - 자신의 상점일 경우에만 표시 */}
                    {isOwnMarket && (
                        <div className="Market_manage_button_section">
                            <button
                                className="Market_manage_button"
                                onClick={handleManageMarket}
                            >
                                내 상점 관리
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default My_market_image