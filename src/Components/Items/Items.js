import React from "react";
import './Items.css';
import Eye_img from './Eye_logo.png';

function items(){
    return(
        <div className = "Items">
            <div className = "Items_container">

                <div className = "Items_reserve_section">
                    <div className = "Items_reserve_text_section">
                        <p className = 'Items_reserve_text'>찜한상품</p>
                    </div>

                    <div className = "Items_reserve_hearts_container">
                        <div className = "Items_reserve_text">♥️</div>
                        <div className = "Items_reserve_text">0</div>
                    </div>


               </div>

                <div className = "Items_recent_section">

                    <div className = "Items_recent_text_section">
                        <p className = 'Items_recent_text_head'>최근본상품</p>
                    </div>

                    <div className = "Divider_container">
                        <div className = "Horizontal_divider"/>
                    </div>

                    <div className = "Recent_Items_container">
                        <div className = "Recent_Items_img_section">
                            <img src={Eye_img} alt="Eye_img" className = "Recent_Items_img"/>
                        </div>
                        <div className="Recent_Items_Text_container">
                            <p className="Recent_Items_Text">최근 본 상품이 없습니다.</p>
                        </div>
                    </div>



                </div>


            </div>

        </div>
    )
}

export default items;