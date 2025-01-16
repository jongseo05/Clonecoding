import './Item_description.css';

function Item_description() {
    return (
        <div className="Item_description_section">
            <div className="Item_description_head2_section">
                <p className="Item_description_head2">설명</p>
            </div>

            <div className="Item_description_input_section">
                <textarea
                    className="Item_description_input"
                    placeholder={`브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요.
전화번호, SNS 계정 등 개인정보 입력은 제한될 수 있어요.
안전하고 건전한 거래 환경을 위해 과학기술정보통신부, 한국인터넷진흥원과 번개장터(주)가 함께합니다.`}
                />
            </div>
        </div>
    );
}

export default Item_description;
