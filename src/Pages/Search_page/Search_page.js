import './Search_page.css'
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from '../../Components/Context/Context'
import Multi_category from './Multi_category/Multi_category'


function Search_page() {
    return (
        <div className="Search_page">
            <Top_navbar />
            <Context />
            <div className = "Search_page_section">
                <Multi_category/>
            </div>
        </div>
    )
}

export default Search_page