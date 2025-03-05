import './Multi_category.css'
import Major_category_button from './Major_category_button/Major_category_button'
import Multi_category_button from "./Multi_category_button/Multi_category_button";

function Multi_category() {
    // 카테고리 데이터 (이미지에 표시된 내용으로 구성)
    const categories = [
        { name: '스타굿즈', count: '23' },
        { name: '도서/티켓/문구', count: '23' },
        { name: '키덜트', count: '18' },
        { name: '예술/회화/수집품', count: '13' },
        { name: '여성의류', count: '11' },
        { name: '기타', count: '10' },
        { name: '남성의류', count: '7' },
        { name: '스포츠/레저', count: '6' },
        { name: '패션 액세서리', count: '5' },
        { name: '신발', count: '4' },
        { name: '음반/악기', count: '4' },
        { name: '디지털', count: '3' },
        { name: '뷰티/미용', count: '2' },
        { name: '가방/지갑', count: '2' },
        { name: '쥬얼리', count: '2' },
        { name: '차량/오토바이', count: '2' },
        { name: '식품', count: '2' },
        { name: '시계', count: '1' },
        { name: '가전제품', count: '1' },
        { name: '가구/인테리어', count: '1' },
        { name: '공구/산업용품', count: '1' },
        { name: '유아동/출산', count: '1' },
        { name: '재능', count: '1' }
    ];

    return (
        <div>
            <div className="Multi_category">

                {/*주요 카테고리*/}
                <div className="Major_category_section">
                    <div className="Major_category_container">

                        <div className="Major_category_title">
                            <span>카테고리</span>
                        </div>

                        <div className="Major_category_box">
                            <Major_category_button/>
                            <Major_category_button/>
                            <Major_category_button/>
                            <Major_category_button/>
                        </div>
                    </div>
                </div>

                {/*전체 카테고리*/}
                <div className="Total_category_section">
                    <div className="Total_category_container">
                        {categories.map((category, index) => (
                            <CustomCategoryButton
                                key={index}
                                name={category.name}
                                count={category.count}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// 기존 Multi_category_button 컴포넌트를 활용하는 커스텀 버튼 컴포넌트
function CustomCategoryButton({ name, count }) {
    return (
        <button className="Multi_category_button">
            <div className="Multi_category_button_text">{name}</div>
            <div className="Multi_category_button_num">{count}</div>
        </button>
    );
}

export default Multi_category