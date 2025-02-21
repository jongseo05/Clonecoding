import './Category_select.css'
import Category_box from "./Category_box/Category_box";
import React, { Component } from 'react';
import Home_icon from '../Images/Home_icon.png'
import Arrow_icon from '../Images/arrow_icon.png'

function Category_select() {
    return (
        <div className="Item_page_Category_section">
            <img src={Home_icon} alt="Home_icon" className="Item_page_Home_icon"/>
            <span className="Item_page_Category_text">홈</span>
            <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
            <Category_box/>
            <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
            <Category_box/>
            <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
            <Category_box/>
        </div>

    );
}

export default Category_select;