import './Item_page.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../../firebase";
import { ref, get, query, orderByKey, equalTo } from "firebase/database";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from '../../Components/Context/Context';
import Category_select from "./Category_select/Category_select";
import Item_info from "./Item_info/Item_info";
import Item_explanation from "./Item_explanation/Item_explanation";

function Item_page() {
    // URL에서 아이템 UID만 추출
    const { '*': itemUID } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                setLoading(true);

                if (!itemUID) {
                    throw new Error("상품 ID가 유효하지 않습니다.");
                }

                console.log("찾는 상품 ID:", itemUID);

                // 모든 카테고리를 검색하기 위한 함수
                const findItemInDatabase = async () => {
                    // 데이터베이스 루트에서 시작
                    const itemsRef = ref(db, "items");
                    const snapshot = await get(itemsRef);

                    if (!snapshot.exists()) {
                        throw new Error("상품 데이터가 없습니다.");
                    }

                    // 재귀적으로 데이터베이스를 검색하여 해당 ID를 찾는 함수
                    const findItemById = async (node, path) => {
                        // 현재 노드가 찾는 ID와 일치하는 경우
                        if (path.endsWith(itemUID)) {
                            return { data: node, path };
                        }

                        // 객체가 아니거나 배열인 경우 스킵
                        if (typeof node !== 'object' || node === null || Array.isArray(node)) {
                            return null;
                        }

                        // 모든 자식 노드 검색
                        for (const key in node) {
                            const result = await findItemById(node[key], `${path}/${key}`);
                            if (result) {
                                return result;
                            }
                        }

                        return null;
                    };

                    // 상품 검색 시작
                    const result = await findItemById(snapshot.val(), "items");

                    if (!result) {
                        throw new Error("해당 ID의 상품을 찾을 수 없습니다.");
                    }

                    return result;
                };

                // 방법 1: 직접 경로로 시도
                try {
                    // 가장 최근 상품 데이터 구조 형식 시도
                    const pathsToTry = [
                        `items/여성의류/아우터/패딩/u8OSJtpEEFTe4QyTCcAvBZYjpdE3/${itemUID}`,
                        `items/여성의류/아우터/패딩/u80SJtpEEFTe4QyTCcAvBZYjpdE3/${itemUID}`,
                        `items/여성의류/아우터/패딩/ybiaQrIgUlXhaeNarcBg71EvvnL2/${itemUID}`
                    ];

                    let data = null;
                    let path = null;

                    for (const tryPath of pathsToTry) {
                        console.log("경로 시도:", tryPath);
                        const tryRef = ref(db, tryPath);
                        const trySnapshot = await get(tryRef);

                        if (trySnapshot.exists()) {
                            data = trySnapshot.val();
                            path = tryPath;
                            console.log("성공한 경로:", tryPath);
                            break;
                        }
                    }

                    // 직접 경로로 찾지 못한 경우 재귀 검색 시도
                    if (!data) {
                        console.log("직접 경로로 찾지 못해 전체 검색 시도 중...");
                        const searchResult = await findItemInDatabase();
                        data = searchResult.data;
                        path = searchResult.path;
                    }

                    console.log("찾은 상품 데이터:", data);
                    console.log("상품 경로:", path);

                    // 가격 정보 처리
                    let price = "0";
                    if (data.price && data.price.price) {
                        price = data.price.price;
                    } else if (data.extraInfo && data.extraInfo.price) {
                        price = data.extraInfo.price;
                    }

                    // 이미지 URL 처리
                    let imageUrl = null;
                    if (Array.isArray(data.images) && data.images.length > 0) {
                        imageUrl = data.images[0];
                        if (imageUrl === "이미지 url" || !imageUrl) {
                            imageUrl = null;
                        }
                    }

                    // 상품 데이터 구성
                    const itemData = {
                        id: itemUID,
                        name: data.name || "상품명 없음",
                        price: price,
                        timestamp: parseInt(itemUID) || Date.now(),
                        imageUrl: imageUrl,
                        description: data.description || "",
                        allowNegotiation: data.price?.allowNegotiation || false,
                        status: data.status || "",
                        category: {
                            main: data.Category?.mainCategory || "",
                            sub: data.Category?.subCategory || "",
                            small: data.Category?.smallCategory || ""
                        },
                        extraInfo: data.extraInfo || {},
                        tags: data.tags || [],
                        seller: {
                            uid: data.uid || ""
                        }
                    };

                    setItem(itemData);

                    // 판매자 정보 가져오기 (필요한 경우)
                    if (data.uid) {
                        try {
                            const userRef = ref(db, `users/${data.uid}`);
                            const userSnapshot = await get(userRef);

                            if (userSnapshot.exists()) {
                                const userData = userSnapshot.val();
                                setItem(prev => ({
                                    ...prev,
                                    seller: {
                                        ...prev.seller,
                                        name: userData.name || "판매자",
                                        // 기타 판매자 정보
                                    }
                                }));
                            }
                        } catch (userError) {
                            console.error("판매자 정보 가져오기 오류:", userError);
                        }
                    }

                } catch (searchError) {
                    console.error("상품 검색 오류:", searchError);
                    throw new Error(`상품을 찾을 수 없습니다: ${searchError.message}`);
                }

            } catch (error) {
                console.error("상품 데이터 가져오기 오류:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (itemUID) {
            fetchItemData();
        }
    }, [itemUID]);

    if (loading) {
        return (
            <div>
                <Top_navbar />
                <Context />
                <div className="Item_page_section">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>상품 정보를 불러오는 중입니다...</p>
                        <p>상품 ID: {itemUID}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Top_navbar />
                <Context />
                <div className="Item_page_section">
                    <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                        <p>오류 발생: {error}</p>
                        <p>상품 ID: {itemUID}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Top_navbar />
            <Context />
            <div className="Item_page_section">
                <Category_select />
                {/* 상품 정보를 각 컴포넌트에 전달 */}
                {item && (
                    <>
                        <Item_info item={item} />
                        <Item_explanation item={item} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Item_page;