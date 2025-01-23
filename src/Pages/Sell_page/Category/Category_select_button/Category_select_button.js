import './Category_select_button.css';

function Category_select_button({ button_text, onClick }) {
    return (
        <div className="Category_select_button" onClick={onClick}>
            <p className="Category_select_button_text">
                {button_text}
            </p>
        </div>
    );
}

export default Category_select_button;
