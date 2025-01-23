import React, { useState } from "react";
import "./Tag.css";
import Tag_icon from "../../../Components/Tag_icon/Tag_icon";

function Tag({ onTagsChange }) {
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const addTag = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            if (tags.length < 5 && inputValue.length <= 9) {
                const newTags = [...tags, inputValue.trim()];
                setTags(newTags);
                onTagsChange(newTags); // 부모로 태그 전달
                setInputValue("");
            } else if (tags.length >= 5) {
                alert("최대 5개의 태그만 추가할 수 있습니다.");
            } else if (inputValue.length > 9) {
                alert("태그는 최대 9자까지 가능합니다.");
            }
        }
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        onTagsChange(newTags); // 부모로 태그 전달
    };

    return (
        <div className="Tag_section">
            <div className="Tag_head2_section">
                <p className="Tag_head2">태그</p>
            </div>
            <div className="Tag_input_section">
                <div className="Tag_input_container">
                    <div className="Tag_list">
                        {tags.map((tag, index) => (
                            <Tag_icon key={index} Tag_text={tag} onDelete={() => removeTag(index)} />
                        ))}
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={addTag}
                            placeholder="태그를 입력해주세요(최대 5개)"
                            className="Tag_input"
                        />
                    </div>
                </div>
                <p className="Tag_input_guide_text">- 태그는 띄어쓰기로 구분되며 최대 9자까지 입력할 수 있어요.</p>
                <p className="Tag_input_guide_text">- 내 상품을 다양한 태그로 표현해 보세요.</p>
                <p className="Tag_input_guide_text">- 사람들이 내 상품을 더 잘 찾을 수 있어요.</p>
                <p className="Tag_input_guide_text">- 상품과 관련 없는 태그를 입력할 경우, 판매에 제재를 받을 수 있어요.</p>
            </div>
        </div>
    );
}

export default Tag;
