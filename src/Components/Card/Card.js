import React from "react";
import "./Card.css";
import Ex_img1 from './Ex_img/Ex_img1.png'

function Card(){





    return(
        <div className = "ItemCard_section">
            <div className = "ItemCard_container">

                <div className = "ItemCard_img_section">
                    <img src={Ex_img1} className="ItemCard_img"/>
                </div>

                <div className = "ItemCard_text_section">
                    <p className="ItemCard_text_title">상품명</p>

                    <div className = "ItemCard_info_section">

                        <div className="ItemCard_price_section">
                            <p className="ItemCard_price_text">120,000</p>
                            <p className="ItemCard_price_text">원</p>
                        </div>

                        <div className="ItemCard_time_section">
                            <p className="ItemCard_time_text">14시간전</p>
                        </div>

                    </div>

                </div>


            </div>
        </div>
    )
}

export default Card;