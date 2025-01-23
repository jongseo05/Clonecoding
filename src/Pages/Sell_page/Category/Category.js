import React, { useState, useEffect } from 'react';
import Category_select_button from './Category_select_button/Category_select_button';
import './Category.css';

function Category({ onCategoryChange , formDataCategory }) {
    const [mainCategory, setMainCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [smallCategory, setSmallCategory] = useState(null);
    const [currentSubCategories, setCurrentSubCategories] = useState([]);
    const [currentSmallCategories, setCurrentSmallCategories] = useState([]);

    const mainCategories = [
        "여성의류", "남성의류", "신발", "가방/지갑", "시계", "쥬얼리",
        "패션 액세서리", "디지털", "가전제품", "스포츠/레저", "차량/오토바이",
        "스타굿즈", "키덜트", "예술/희귀/수집품", "음반/악기", "도서/티켓/문구",
        "뷰티/미용", "가구/인테리어", "생활/주방용품", "공구/산업용품", "식품",
        "유아동/출산", "반려동물용품", "기타", "재능"
    ];

    const subCategories = {
        "여성의류": [
            "아우터", "상의", "바지", "치마", "원피스", "점프수트",
            "셋업/세트", "언더웨어/홈웨어", "테마 이벤트"
        ]
    };

    const smallCategories = {
        "아우터": ["패딩", "점퍼", "코트", "자켓", "가디건", "조끼/베스트"]
    };


    useEffect(() => {
        if (formDataCategory) {
            setMainCategory(formDataCategory.mainCategory);
            setSubCategory(formDataCategory.subCategory);
            setSmallCategory(formDataCategory.smallCategory);
        }
    }, [formDataCategory]);


    useEffect(() => {
        if (mainCategory) {
            setCurrentSubCategories(subCategories[mainCategory] || []);
            setSubCategory(null);
            setSmallCategory(null);
            onCategoryChange(mainCategory, null, null);
        }
    }, [mainCategory]);

    useEffect(() => {
        if (subCategory) {
            setCurrentSmallCategories(smallCategories[subCategory] || []);
            setSmallCategory(null);
            onCategoryChange(mainCategory, subCategory, null);
        }
    }, [subCategory]);

    useEffect(() => {
        if (smallCategory) {
            onCategoryChange(mainCategory, subCategory, smallCategory);
        }
    }, [smallCategory]);

    return (
        <div className="Category_section">
            <div className="Category_head2_section">
                <p className="Category_head2">카테고리</p>
            </div>

            <div className="Category_select_section">
                <div className="Category_selection_section">
                    <div className="Category_selection_container_selected">
                        {mainCategories.map((category, index) => (
                            <Category_select_button
                                key={index}
                                button_text={category}
                                onClick={() => setMainCategory(category)}
                            />
                        ))}
                    </div>
                    <div className={
                        currentSubCategories.length > 0
                            ? "Category_selection_container_selected"
                            : "Category_selection_container_unselected"
                    }>
                        {currentSubCategories.map((subCategoryOption, index) => (
                            <Category_select_button
                                key={index}
                                button_text={subCategoryOption}
                                onClick={() => setSubCategory(subCategoryOption)}
                            />
                        ))}
                    </div>
                    <div className={
                        currentSmallCategories.length > 0
                            ? "Category_selection_container_selected"
                            : "Category_selection_container_unselected"
                    }>
                        {currentSmallCategories.map((smallCategoryOption, index) => (
                            <Category_select_button
                                key={index}
                                button_text={smallCategoryOption}
                                onClick={() => setSmallCategory(smallCategoryOption)}
                            />
                        ))}
                    </div>
                </div>
                <div className="Chosen_category_section">
                    <p className="Category_text">
                        선택한 카테고리: <span style={{ color: 'red', fontWeight: 800 }}>
                            {mainCategory ? mainCategory : "없음"}
                        {subCategory ? ` > ${subCategory}` : ""}
                        {smallCategory ? ` > ${smallCategory}` : ""}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Category;
