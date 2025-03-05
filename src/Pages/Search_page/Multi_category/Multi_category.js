import './Multi_category.css'
import Major_category_button from './Major_category_button/Major_category_button'

function Multi_category() {
    return (
        <div>
            <div className = "Multi_category">

                <div className = "Major_category_section">
                    <div className="Major_category_container">

                        <div className="Major_category_title">
                            <span>카테고리</span>
                        </div>

                        <div className="Major_category_box">
                            <Major_category_button/>
                            <Major_category_button/>
                            <Major_category_button/>
                            <Major_category_button/>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Multi_category