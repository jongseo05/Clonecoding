import './My_market.css'
import Top_navbar from '../../Components/Top_navbar/Top_navbar'
import Context from '../../Components/Context/Context'
import My_market_image from "./My_market_image/My_market_image";
import Home_icon from './icon/Home.png'
import People_icon from './icon/People.png'
import Market_icon from './icon/Marekt.png'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Market_tabs from './Market_tabs/Market_tabs';

function My_market() {
    /* URL에서 userId 파라미터 가져오기 */
    const { userId } = useParams();

    /* 현재 로그인한 사용자 정보 */
    const auth = getAuth();
    const currentUser = auth.currentUser;

    /* 현재 보고 있는 상점이 자신의 상점인지 확인 */
    const isOwnMarket = currentUser && userId === currentUser.uid;

    /* 상점 정보 상태 관리 */
    const [marketInfo, setMarketInfo] = useState({
        marketName: `상점${Math.floor(Math.random() * 10000000)}호`,
        description: '',
        visitCount: 0,
        salesCount: 0,
        openDate: new Date().toISOString(),
        products: [],
        reviews: [],
        likes: 0,
        following: 0,
        followers: 0
    });

    /* 편집 모드 상태 관리 */
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [newMarketName, setNewMarketName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    /* 데이터베이스 참조 */
    const database = getDatabase();

    /* 데이터 로드 */
    useEffect(() => {
        if (!userId) return;

        const marketRef = ref(database, `markets/${userId}`);

        const unsubscribe = onValue(marketRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setMarketInfo(data);
                setNewMarketName(data.marketName);
                setNewDescription(data.description || '');
            } else {
                /* 샘플 데이터 생성 */
                const sampleProducts = [
                    {
                        id: '1',
                        name: '샘플 상품 1',
                        price: 10000,
                        imageUrl: 'https://via.placeholder.com/200',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        name: '샘플 상품 2',
                        price: 15000,
                        imageUrl: 'https://via.placeholder.com/200',
                        createdAt: new Date().toISOString()
                    }
                ];

                const initialData = {
                    marketName: `상점${Math.floor(Math.random() * 10000000)}호`,
                    description: '',
                    visitCount: 0,
                    salesCount: 0,
                    openDate: new Date().toISOString(),
                    products: sampleProducts,
                    reviews: [],
                    likes: 0,
                    following: 0,
                    followers: 0
                };

                update(marketRef, initialData)
                    .then(() => {
                        setMarketInfo(initialData);
                        setNewMarketName(initialData.marketName);
                    })
                    .catch(error => {
                        console.error("초기 상점 정보 저장 오류:", error);
                    });
            }
        }, (error) => {
            console.error("상점 정보 로드 오류:", error);
        });

        return () => unsubscribe();
    }, [userId, database]);

    /* 상점명 수정 처리 */
    const handleUpdateName = async () => {
        if (!isOwnMarket || !newMarketName.trim()) return;

        try {
            const marketNameRef = ref(database, `markets/${userId}`);

            await update(marketNameRef, {
                marketName: newMarketName
            });

            setIsEditingName(false);
        } catch (error) {
            console.error("상점명 업데이트 실패:", error);
        }
    };

    /* 소개글 수정 처리 */
    const handleUpdateDescription = async () => {
        if (!isOwnMarket) return;

        try {
            const descriptionRef = ref(database, `markets/${userId}`);

            await update(descriptionRef, {
                description: newDescription
            });

            setIsEditingDesc(false);
        } catch (error) {
            console.error("소개글 업데이트 실패:", error);
        }
    };

    /* 키 입력 처리 (Enter: 저장, Shift+Enter: 줄바꿈) */
    const handleDescKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUpdateDescription();
        }
    };

    /* 날짜 포맷팅 함수 */
    const formatDate = (dateString) => {
        if (!dateString) return '정보 없음';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return `${diffDays}일전`;
    };

    return (
        <div>
            <Top_navbar />
            <Context />

            <div className="My_market_section">
                <div className="My_market_container">
                    <div className="My_Market_info_section">
                        <My_market_image
                            marketName={marketInfo.marketName}
                            isOwnMarket={isOwnMarket}
                        />

                        <div className="My_market_info_container">
                            <div className="My_market_market_name_section">
                                {isOwnMarket && isEditingName ? (
                                    <div className="My_market_edit_container">
                                        <input
                                            type="text"
                                            value={newMarketName}
                                            onChange={(e) => setNewMarketName(e.target.value)}
                                            className="My_market_input"
                                        />
                                        <button onClick={handleUpdateName} className="My_market_button">확인</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="My_market_name">{marketInfo.marketName}</div>
                                        {isOwnMarket && (
                                            <button className="My_market_button" onClick={() => setIsEditingName(true)}>
                                                상점명 수정
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* 상점 상세 정보 */}
                            <div className="My_market_information_section">
                                <div className="My_market_information_container">
                                    {/* 상점 오픈 일 */}
                                    <div className="My_market_information_box">
                                        <img src={Home_icon} alt="Home_icon"
                                             style={{
                                                 width: "14px",
                                                 height: "13px",
                                                 paddingRight: "10px"
                                             }}/>

                                        <div className="My_market_information_text1">
                                            상점오픈일
                                        </div>

                                        <div className="My_market_information_text2">
                                            {formatDate(marketInfo.openDate)}
                                        </div>
                                    </div>

                                    {/* 상점 방문 수 */}
                                    <div className="My_market_information_box">
                                        <img src={People_icon} alt="People_icon"
                                             style={{
                                                 width: "14px",
                                                 height: "13px",
                                                 paddingRight: "10px"
                                             }}/>

                                        <div className="My_market_information_text1">
                                            상점방문수
                                        </div>

                                        <div className="My_market_information_text2">
                                            {marketInfo.visitCount} 명
                                        </div>
                                    </div>

                                    {/* 상점 판매 */}
                                    <div className="My_market_information_box">
                                        <img src={Market_icon} alt="Market_icon"
                                             style={{
                                                 width: "14px",
                                                 height: "13px",
                                                 paddingRight: "10px"
                                             }}/>

                                        <div className="My_market_information_text1">
                                            상품판매
                                        </div>

                                        <div className="My_market_information_text2">
                                            {marketInfo.salesCount} 회
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 상점 소개글 */}
                            <div className="My_market_info_text_section">
                                {isOwnMarket && isEditingDesc ? (
                                    <div className="My_market_desc_edit">
                                        <textarea
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            onKeyDown={handleDescKeyDown}
                                            placeholder="상점 소개글을 입력해주세요. 수정 완료 후 Enter를 누르세요. (줄바꿈은 Shift+Enter)"
                                            className="My_market_textarea"
                                            rows={5}
                                        />
                                    </div>
                                ) : (
                                    <div className="My_market_desc_display">
                                        {marketInfo.description ?
                                            marketInfo.description.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    {index < marketInfo.description.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            )) :
                                            '소개글이 없습니다.'
                                        }
                                    </div>
                                )}
                            </div>

                            {/* 소개글 수정 버튼 - 자신의 상점일 경우에만 표시 */}
                            {isOwnMarket && (
                                <div className="My_market_info_button_section">
                                    {isEditingDesc ? (
                                        <button className="My_market_info_button" onClick={handleUpdateDescription}>
                                            수정완료
                                        </button>
                                    ) : (
                                        <button className="My_market_info_button" onClick={() => setIsEditingDesc(true)}>
                                            소개글 수정
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 컴포넌트 */}
            <Market_tabs marketData={marketInfo} isOwnMarket={isOwnMarket} />
        </div>
    )
}

export default My_market