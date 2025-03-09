import './Lightning_talk_button_size.css'
import Lightning_talk_icon from './Lightning_talk_button_icon.png'

function Lightning_talk_button_size() {
    return (
        <button className="Lightning_talk_button_size">
            <img src={Lightning_talk_icon} alt="Lightning_talk_icon" className="Lightning_talk_icon"/>
            <span className="Lightning_talk_text">번개톡</span>
        </button>
    );
}

export default Lightning_talk_button_size;