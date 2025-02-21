import './Category_box.css'
import '../Category_select.css'
import React, { Component } from 'react';
import Down_arrow from '../Down_arrow.png'

function Category_box(){
    return(
        <div className= "Category_box">
            <span className='Item_page_Category_text'>디지털</span>
            <img src = {Down_arrow} alt = "Down_arrow" className = "Down_arrow"/>
        </div>
    )
}

export default Category_box;