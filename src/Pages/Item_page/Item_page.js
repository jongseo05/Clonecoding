import './Item_page.css'
import React, { Component } from 'react';
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from '../../Components/Context/Context'
import Category_select from "./Category_select/Category_select";
import Item_info from "./Item_info/Item_info";
import Item_explanation from "./Item_explanation/Item_explanation";


function Item_page() {
    return (
        <div>
            <Top_navbar />
            <Context />
            <div className = "Item_page_section">
                <Category_select/>
                <Item_info/>
                <Item_explanation/>
            </div>

        </div>
    );
}

export default Item_page;