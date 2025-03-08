import './Item_page.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../../firebase";
import { ref, get, runTransaction } from "firebase/database";
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
    const [itemPath, setItemPath] = useState("");

    // 조회수 증가 함수
    const incrementViewCount = async (path) => {
        try {
            // 로컬 스토리지에서 조회 이력 확인
            const viewedItems = JSON.parse(localStorage.getItem('viewedItems') || '{}');
            const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000; // 24시간 전

            // 이미 최근 24시간 내에 조회한 경우 증가하지 않음
            if (viewedItems[itemUID] && viewedItems[itemUID] > twentyFourHoursAgo) {
                console.log("최근 24시간 내에 이미 조회한 상품입니다.");
                return;
            }

            // 조회 이력 기록
            viewedItems[itemUID] = Date.now();
            localStorage.setItem('viewedItems', JSON.stringify(viewedItems));

            // 조회수 증가 (트랜잭션 사용)
            const itemRef = ref(db, path);

            await runTransaction(itemRef, (currentData) => {
                if (currentData === null) {
                    return null;
                }

                // 조회수 필드가 없으면 생성
                const viewCount = currentData.viewCount || 0;
                return { ...currentData, viewCount: viewCount + 1 };
            });

            console.log("조회수 증가 완료");

        } catch (error) {
            console.error("조회수 증가 오류:", error);
        }
    };

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
                        `items/여성의류/아우터/패딩/ybiaQrIgUlXhaeNarcBg71EvvnL2/${itemUID}`,
                        `items/여성의류/아우터/패딩/aErykvn45ahtIVxkah3skqL4OE43/${itemUID}`
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
                            setItemPath(tryPath); // 상품 경로 저장
                            break;
                        }
                    }

                    // 직접 경로로 찾지 못한 경우 재귀 검색 시도
                    if (!data) {
                        console.log("직접 경로로 찾지 못해 전체 검색 시도 중...");
                        const searchResult = await findItemInDatabase();
                        data = searchResult.data;
                        path = searchResult.path;
                        setItemPath(searchResult.path); // 상품 경로 저장
                    }

                    console.log("찾은 상품 데이터:", data);
                    console.log("상품 경로:", path);

                    // 조회수 증가
                    await incrementViewCount(path);

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

                    // 실제 데이터 구조에 맞게 판매자 정보 처리
                    let sellerInfo = data.sellerInfo || {};

                    // 판매자 정보가 없거나 판매자 ID가 없는 경우에만 uid를 사용하여 생성
                    if (!sellerInfo.sellerId && data.uid) {
                        sellerInfo = {
                            ...sellerInfo,
                            sellerId: data.uid,
                            sellerName: "판매자",
                            sellerCreatedAt: data.createdAt || Date.now()
                        };
                    }

                    // 상품 데이터 구성
                    const itemData = {
                        id: itemUID,
                        name: data.name || "상품명 없음",
                        price: price,
                        timestamp: data.createdAt || parseInt(itemUID) || Date.now(),
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
                            uid: data.uid || sellerInfo.sellerId || ""
                        },
                        sellerInfo: sellerInfo,  // 판매자 정보 전체 포함
                        likeCount: data.likeCount || 0,
                        viewCount: data.viewCount || 0,
                        package: data.package || {}
                    };

                    setItem(itemData);

                    // 판매자 정보가 sellerInfo에 없는 경우에만 추가로 가져오기
                    if (!sellerInfo.sellerName && data.uid) {
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
                                    },
                                    sellerInfo: {
                                        ...prev.sellerInfo,
                                        sellerName: userData.name || "판매자",
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
                        <Item_info item={item} itemPath={itemPath} />
                        <Item_explanation item={item} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Item_page;