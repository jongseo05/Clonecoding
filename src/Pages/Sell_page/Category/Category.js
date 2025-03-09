import React, { useState, useEffect } from 'react';
import categoriesData from '../../../Data/categories.json'; // JSON 파일 import
import Category_select_button from './Category_select_button/Category_select_button';
import './Category.css';

function Category({ onCategoryChange, formDataCategory }) {
    // JSON에서 동적으로 카테고리 데이터 추출
    const mainCategories = Object.keys(categoriesData);

    // 메인 카테고리에 따른 중간 카테고리 추출
    const subCategories = Object.fromEntries(
        Object.entries(categoriesData).map(([mainCategory, subCategoryData]) => [
            mainCategory,
            Object.keys(subCategoryData)
        ])
    );

    // 중간 카테고리에 따른 소분류 카테고리 추출
    const smallCategories = Object.fromEntries(
        Object.entries(categoriesData).flatMap(([mainCategory, subCategoryData]) =>
            Object.entries(subCategoryData).map(([subCategory, smallCategoryList]) => [
                subCategory,
                smallCategoryList
            ])
        )
    );

    // 상태 관리를 위한 useState 훅
    const [mainCategory, setMainCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [smallCategory, setSmallCategory] = useState(null);

    // 현재 선택 가능한 중간, 소분류 카테고리 상태
    const [currentSubCategories, setCurrentSubCategories] = useState([]);
    const [currentSmallCategories, setCurrentSmallCategories] = useState([]);

    // formDataCategory가 있을 경우 초기 카테고리 설정
    useEffect(() => {
        if (formDataCategory) {
            setMainCategory(formDataCategory.mainCategory);
            setSubCategory(formDataCategory.subCategory);
            setSmallCategory(formDataCategory.smallCategory);
        }
    }, [formDataCategory]);

    // 메인 카테고리 선택 시 동작
    useEffect(() => {
        if (mainCategory) {
            // 선택된 메인 카테고리의 중간 카테고리 설정
            setCurrentSubCategories(subCategories[mainCategory] || []);

            // 중간, 소분류 카테고리 초기화
            setSubCategory(null);
            setSmallCategory(null);

            // 부모 컴포넌트에 카테고리 변경 알림
            onCategoryChange(mainCategory, null, null);
        }
    }, [mainCategory]);

    // 중간 카테고리 선택 시 동작
    useEffect(() => {
        if (subCategory) {
            // 선택된 중간 카테고리의 소분류 카테고리 설정
            setCurrentSmallCategories(smallCategories[subCategory] || []);

            // 소분류 카테고리 초기화
            setSmallCategory(null);

            // 부모 컴포넌트에 카테고리 변경 알림
            onCategoryChange(mainCategory, subCategory, null);
        }
    }, [subCategory]);

    // 소분류 카테고리 선택 시 동작
    useEffect(() => {
        if (smallCategory) {
            // 부모 컴포넌트에 최종 카테고리 변경 알림
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
                    {/* 메인 카테고리 선택 영역 */}
                    <div className="Category_selection_container_selected">
                        {mainCategories.map((category, index) => (
                            <Category_select_button
                                key={index}
                                button_text={category}
                                onClick={() => setMainCategory(category)}
                            />
                        ))}
                    </div>

                    {/* 중간 카테고리 선택 영역 */}
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

                    {/* 소분류 카테고리 선택 영역 */}
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

                {/* 선택된 카테고리 표시 */}
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