import './Category_select.css'
import Category_box from "./Category_box/Category_box";
import React, { useState, useEffect } from 'react';
import Home_icon from '../Images/Home_icon.png'
import Arrow_icon from '../Images/arrow_icon.png'
import { useParams } from 'react-router-dom';
import { db } from "../../../firebase";
import { ref, get } from "firebase/database";

function Category_select() {
    const { '*': itemUID } = useParams();
    const [categories, setCategories] = useState({
        mainCategory: '',
        subCategory: '',
        smallCategory: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (!itemUID) {
                setLoading(false);
                return;
            }

            try {

                const pathsToTry = [
                    `items/여성의류/아우터/패딩/u8OSJtpEEFTe4QyTCcAvBZYjpdE3/${itemUID}`,
                    `items/여성의류/아우터/패딩/u80SJtpEEFTe4QyTCcAvBZYjpdE3/${itemUID}`,
                    `items/여성의류/아우터/패딩/ybiaQrIgUlXhaeNarcBg71EvvnL2/${itemUID}`
                ];

                let itemData = null;

                // 각 경로를 시도하여 아이템 데이터 찾기
                for (const tryPath of pathsToTry) {
                    const tryRef = ref(db, tryPath);
                    const trySnapshot = await get(tryRef);

                    if (trySnapshot.exists()) {
                        itemData = trySnapshot.val();
                        break;
                    }
                }

                // 직접 경로에서 찾지 못한 경우 전체 검색
                if (!itemData) {
                    // 데이터베이스 루트에서 검색
                    const findItemInDatabase = async () => {
                        const itemsRef = ref(db, "items");
                        const snapshot = await get(itemsRef);

                        if (!snapshot.exists()) {
                            return null;
                        }

                        // 재귀적으로 검색
                        const findItemById = (node, path) => {
                            if (path.endsWith(itemUID)) {
                                return node;
                            }

                            if (typeof node !== 'object' || node === null || Array.isArray(node)) {
                                return null;
                            }

                            for (const key in node) {
                                const result = findItemById(node[key], `${path}/${key}`);
                                if (result) {
                                    return result;
                                }
                            }

                            return null;
                        };

                        return findItemById(snapshot.val(), "items");
                    };

                    itemData = await findItemInDatabase();
                }

                // 카테고리 정보 설정
                if (itemData && itemData.Category) {
                    setCategories({
                        mainCategory: itemData.Category.mainCategory || '',
                        subCategory: itemData.Category.subCategory || '',
                        smallCategory: itemData.Category.smallCategory || ''
                    });
                } else if (itemData && itemData.category) {
                    // 다른 형식의 카테고리 구조 확인
                    setCategories({
                        mainCategory: itemData.category.main || '',
                        subCategory: itemData.category.sub || '',
                        smallCategory: itemData.category.small || ''
                    });
                }
            } catch (error) {
                console.error("카테고리 데이터 가져오기 오류:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [itemUID]);

    if (loading) {
        return (
            <div className="Item_page_Category_section">
                <img src={Home_icon} alt="Home_icon" className="Item_page_Home_icon"/>
                <span className="Item_page_Category_text">홈</span>
                <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
                <span className="Item_page_Category_text">카테고리 로딩 중...</span>
            </div>
        );
    }

    return (
        <div className="Item_page_Category_section">
            <img src={Home_icon} alt="Home_icon" className="Item_page_Home_icon"/>
            <span className="Item_page_Category_text">홈</span>
            <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
            <Category_box categoryName={categories.mainCategory}/>
            <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
            <Category_box categoryName={categories.subCategory}/>
            <img src={Arrow_icon} alt="Arrow_icon" className="Item_page_Arrow_icon"/>
            <Category_box categoryName={categories.smallCategory}/>
        </div>
    );
}

export default Category_select;