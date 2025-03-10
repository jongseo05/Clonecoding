import './My_market_image.css'
import Market_icon from './Market_icon.png'

function My_market_image() {
    return(
        <>
            <div className = "My_market_image_container">

                <div className = "My_market_image_info_container">

                    <div className = "Market_icon_container">
                        <img src = {Market_icon} alt = "Market_icon" className = "Market_icon"/>
                    </div>

                    <div className = "Market_name">
                        <p>종서상점</p>
                    </div>

                    <div className = "Market_manage_button_section">
                        <button className = "Market_manage_button">
                            내 상점 관리</button>

                    </div>

                </div>

            </div>


        </>
    )
}

export default My_market_image