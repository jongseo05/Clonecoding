import React  from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import './Img_dashboard/Img_dashboard.css';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context  from "../../Components/Context/Context";
import Items from "../../Components/Items/Items";
import Img_dashboard from "./Img_dashboard/Img_dashboard";
import banner from './homepage_banner.png';
import Card_Ex from "../../Components/Card/Card_Ex";

function Homepage() {
  return (
    <div>

        <Top_navbar />
        <Context />
        <Items />
        <div className='Main_Content_section'>

            {/*Image section*/}
            <Img_dashboard/>
            <img src={banner} className="Banner_img"/>


            {/*Card section*/}
            <div className="Card_section">
                <p className="Card_text_head">오늘의 상품 추천</p>

                <div className = "Card_container">
                    <Card_Ex/>
                    <Card_Ex/>

                </div>
            </div>

        </div>


    </div>
  );
}

export default Homepage;
