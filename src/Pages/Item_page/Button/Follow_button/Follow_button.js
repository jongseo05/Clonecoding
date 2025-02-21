import './Follow_button.css'
import Follow_icon from './Follow_icon.png'

function Follow_button(){
    return(
        <button className = "Follow_button">
            <img src={Follow_icon} className="Follow_icon"/>
            <span className = "Follow_text">팔로우</span>

        </button>
    )
}

export default Follow_button;