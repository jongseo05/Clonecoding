import './Major_category_button.css'
import Arrow_img from './arrow_img.png'

function Major_category_button({ categoryName, categoryCount }) {
    return (
        <div className = "Major_category_button_section">
            <button className = "Major_category_button" >
                <div className = "Major_category_button_icon">
                    <img src={Arrow_img} alt="arrow_img" className="Major_category_button_img"/>
                </div>
                <span className= "Major_category_button_text">{categoryName || '패딩'}</span>
                <span className= "Major_category_button_num">{categoryCount || '16'}</span>
            </button>
        </div>
    )
}

export default Major_category_button