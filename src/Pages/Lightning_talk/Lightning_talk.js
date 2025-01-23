import './Lightning_talk.css';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";
import Chating_list from './Chating_list/Chat_list'
import Three_dot from './Images/tabler_dots.png'
import Arrow_down from "./Images/ei_arrow-down.png"

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
                    <div className = "Lightning_talk_talk_section">

                    </div>
                </div>


            </div>


        </div>
    )
}

export default Lightning_talk;