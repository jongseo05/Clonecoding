import React, { useState, useEffect } from "react";
import "./Card.css";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import CardItem from "./CardItem";

// 카드 목록 컴포넌트
function CardList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("카드 목록 컴포넌트 마운트됨");
        console.log("Firebase DB 객체:", db);

        async function fetchAllItems() {
            try {
                setLoading(true);
                console.log("데이터베이스에서 모든 상품 가져오기 시작");

                // 루트 경로 "items"에서 시작
                const itemsRef = ref(db, "items");
                const snapshot = await get(itemsRef);

                if (!snapshot.exists()) {
                    console.log("상품 데이터가 없습니다");
                    setItems([]);
                    setLoading(false);
                    return;
                }

                const data = snapshot.val();
                console.log("데이터 불러오기 성공");

                // 모든 상품 데이터를 재귀적으로 추출
                const allItems = [];

                // 데이터베이스를 재귀적으로 탐색하는 함수
                function traverseData(obj, path = []) {
                    // 상품 데이터인지 확인 (name 필드가 있는지)
                    if (obj && obj.name) {
                        try {
                            // 타임스탬프는 경로의 마지막 부분
                            const itemTimestamp = parseInt(path[path.length - 1]) || Date.now();

                            // 이미지 URL 처리
                            let imageUrl = null;
                            if (Array.isArray(obj.images) && obj.images.length > 0) {
                                imageUrl = obj.images[0];
                                // 이미지 URL 유효성 확인
                                if (imageUrl === "이미지 url" || !imageUrl) {
                                    imageUrl = null;
                                }
                            }

                            // 가격 정보 처리
                            let price = "0";
                            if (obj.price && obj.price.price) {
                                price = obj.price.price;
                            } else if (obj.extraInfo && obj.extraInfo.price) {
                                price = obj.extraInfo.price;
                            }

                            const item = {
                                id: path.join('/'),
                                name: obj.name,
                                price: price,
                                timestamp: itemTimestamp,
                                imageUrl: imageUrl,
                                description: obj.description || "",
                                allowNegotiation: obj.price?.allowNegotiation || false
                            };

                            console.log(`상품 발견: ${item.name}, 가격: ${item.price}, 타임스탬프: ${item.timestamp}`);
                            allItems.push(item);
                        } catch (e) {
                            console.error("아이템 파싱 오류:", e);
                        }
                        return;
                    }

                    // 객체이면서 상품 데이터가 아닌 경우 재귀적으로 탐색
                    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                        Object.keys(obj).forEach(key => {
                            traverseData(obj[key], [...path, key]);
                        });
                    }
                }

                traverseData(data);
                console.log(`총 ${allItems.length}개의 상품을 발견했습니다`);

                // 시간순으로 정렬 (최신순)
                allItems.sort((a, b) => b.timestamp - a.timestamp);

                setItems(allItems);
                console.log("상품 데이터 처리 완료");
            } catch (error) {
                console.error("상품 데이터 가져오기 오류:", error);
                setError(`데이터 로딩 실패: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchAllItems();
    }, []);

    if (loading) {
        return (
            <div className="card-list-container" style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <p>상품을 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card-list-container" style={{ display: "flex", justifyContent: "center", padding: "20px", color: "red" }}>
                <p>오류 발생: {error}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="card-list-container" style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <p>등록된 상품이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="card-list-container" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {items.map((item, index) => (
                <CardItem key={item.id || index} item={item} />
            ))}
        </div>
    );
}

export default CardList;