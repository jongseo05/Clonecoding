import React from "react";
import "./Tag_icon.css";
import Tag_delete_icon from "./Tag_delete.png";

function Tag_icon({ Tag_text, onDelete }) {
    return (
        <div className="Tag_icon_section">
            <div className="Tag_icon_container">
                <div className="Tag_icon_text_container">
                    <p className="Tag_icon_text"># {Tag_text}</p>
                </div>
                <div className="Tag_icon_icon_section" onClick={onDelete}>
                    <img src={Tag_delete_icon} className="Tag_icon_img" alt="delete" />
                </div>
            </div>
        </div>
    );
}

export default Tag_icon;
