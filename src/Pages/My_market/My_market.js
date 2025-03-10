import './My_market.css'
import Top_navbar from '../../Components/Top_navbar/Top_navbar'
import Context from '../../Components/Context/Context'
import My_market_image from "./My_market_image/My_market_image";
import Home_icon from './icon/Home.png'
import People_icon from './icon/People.png'
import Market_icon from './icon/Marekt.png'


function My_market() {
    return (
        <div>
            <Top_navbar />
            <Context />

            <div className="My_market_section">

                <div className="My_market_container">

                    <div className="My_Market_info_section">
                        <My_market_image/>

                        <div className = "My_market_info_container">

                            <div className = "My_market_market_name_section">
                                <div className = "My_market_name">종서 상점</div>
                                <button className = "My_market_button">상점명 수정</button>
                            </div>

                            {/* 상점 상세 정보 */}
                            <div className = "My_market_information_section">
                                <div className = "My_market_information_container">

                                    {/* 상점 오픈 일 */}
                                    <div className = "My_market_information_box">
                                        <img src = {Home_icon} alt = "Home_icon"
                                             style = {{
                                                 width: "14px",
                                                height: "13px",
                                                 paddingRight : "10px"
                                             }}/>

                                        <div className = "My_market_information_text1">
                                            상점방문수
                                        </div>

                                        <div className = "My_market_information_text2">
                                            62일전
                                        </div>


                                    </div>

                                    {/* 상점 방문 수 */}
                                    <div className = "My_market_information_box">
                                        <img src = {People_icon} alt = "Home_icon"
                                             style = {{
                                                 width: "14px",
                                                 height: "13px",
                                                 paddingRight : "10px"
                                             }}/>

                                        <div className = "My_market_information_text1">
                                            상품판매
                                        </div>

                                        <div className = "My_market_information_text2">
                                            62일전
                                        </div>


                                    </div>

                                    {/* 상점 판매 */}
                                    <div className = "My_market_information_box">
                                        <img src = {Market_icon} alt = "Home_icon"
                                             style = {{
                                                 width: "14px",
                                                 height: "13px",
                                                 paddingRight : "10px"
                                             }}/>

                                        <div className = "My_market_information_text1">
                                            상점오픈일
                                        </div>

                                        <div className = "My_market_information_text2">
                                            62일전
                                        </div>


                                    </div>

                                </div>
                            </div>

                            {/* 상점 소개글 */}
                            <div className = "My_market_info_text_section">



                            </div>

                            {/* 상품 버튼 */}
                            <div className = "My_market_info_button_section">
                                <button className = "My_market_info_button">소개글 수정</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default My_market