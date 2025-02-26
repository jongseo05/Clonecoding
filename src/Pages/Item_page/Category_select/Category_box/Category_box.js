import './Category_box.css'
import '../Category_select.css'
import React from 'react';
import Down_arrow from '../Down_arrow.png'

function Category_box({ categoryName }) {
    return(
        <div className= "Category_box">
            <span className='Item_page_Category_text'>{categoryName || '카테고리 없음'}</span>
            <img src = {Down_arrow} alt = "Down_arrow" className = "Down_arrow"/>
        </div>
    )
}

export default Category_box;