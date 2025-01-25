import './Lightning_talk.css';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import Chating_list from './Chating_list/Chat_list'
import Three_dot from './Images/tabler_dots.png'
import Arrow_down from "./Images/ei_arrow-down.png"
import Chat_icon from './Images/채팅방 아이콘.png'
import Ex_icon from './Images/market_icon.png'

function Lightning_talk() {
    return(
        <div>
            <Top_navbar/>
            <Context/>

            <div className="Lightning_talk_section">

                <div className = "Lightning_talk_container">

                    {/* 대화 목록 리스트 */}
                    <div className = "Lightning_talk_talkList_section">

                        <div className = "Lightning_talk_other_info_section">
                            <div className = "Dot_container">
                                <img src = {Three_dot} className = "Dot_image"/>
                            </div>
                        </div>

                        <div className = "Lightning_talk_list_container">
                            <div className = "Lightning_talk_category_section">

                                <div className = "Lightning_talk_category_container">
                                    <div className = "Lightning_talk_category_text_section">
                                    전체대화
                                    <img src={Arrow_down} className = "Lightning_talk_category_img"/>
                                </div>
                                </div>

                                <Chating_list/>
                                <Chating_list/>
                                <Chating_list/>


                        </div>
                        </div>
                    </div>

                    {/* 대화 창 */}
                    <div className="Lightning_talk_talk_section">

                        {/* 상점 정보 */}
                        <div className = "Lightning_talk_market_info_container">
                            <div className = "Text_container"
                            style = {{
                                flexDirection: 'column'
                            }}>
                                <p style={{
                                    fontWeight: 'bold',
                                    fontSize : '16px',
                                    cursor: 'pointer',
                                    margin: '0'
                                }}>상점명0928</p>
                                <p style={{
                                    fontSize : '12px',
                                    color : "gray",
                                    alignItems: 'center',
                                    margin : '0'
                                }}>2일전 접속</p>
                            </div>

                            <div>
                                <img src = {Three_dot} className = "Dot_image"/>
                            </div>

                        </div>

                        {/* 물품 정보 */}
                        <div className = "Lightning_talk_item_section">

                            {/*물품 사진*/}
                            <img src = {Ex_icon} className = "Lightning_talk_item_img"/>

                            {/*물품 정보*/}
                            <div className = "Lightning_talk_item_info_text_section">
                                <span style={{
                                    fontSize : '12px',
                                    color : "gray",
                                    alignItems: 'center',
                                    margin : '0'
                                }}>예시</span>
                                <span style={{
                                    fontSize : '12px',
                                    color : "gray",
                                    alignItems: 'center',
                                    margin : '0'
                                }}>1000원
                                    <span style={{
                                        fontSize : '12px',
                                        textDecoration : 'underline',
                                        color : "76,76,76",
                                        alignItems: 'center',
                                        marginLeft: '6px',
                                        cursor: 'pointer',
                                    }}>가격변경</span>
                                </span>


                            </div>


                        </div>


                    </div>
                </div>


            </div>


        </div>
    )
}

export default Lightning_talk;