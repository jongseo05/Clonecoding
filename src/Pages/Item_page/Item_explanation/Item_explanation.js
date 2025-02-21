import './Item_explanation.css'
import Location_icon from './Images/location.png'
import Category_icon from './Images/Category.png'
import Tag_icon from './Images/Tag.png'
import Market_icon from './Images/Market.png'
import Follow_button from "../Button/Follow_button/Follow_button";

function Item_explanation() {
    return (
        <div className="Item_explanation_section">

            <div className = "Item_explanation_other_section"/>

            {/*상품 설명*/}
            <div className = "Item_explanation_container">

                <div className = "Item_explanation_head1_box">
                    <span className = "Item_explanation_container_text">상품정보</span>
                </div>


                <div className = "Item_explanation_box1">
                    <span className = "Item_explanation_text">
                        소니 디지탈 8mm 캠코더 TRV-520입니다
                        모든 8mm 방식상관없이 모두 재생가능합니다
                        발매가 400만원이 넘었던제품입니다
                        헤드및 메커니즘 점검받아 돈들어갈일없습니다
                        액정코팅이 벚겨짐이 조금있어 저렴히 분양합니다
                        이점감안하여 25만원입니다
                    </span>
                </div>

                <div className="Item_explanation_box2">

                    {/*직거래 위치 정보*/}
                    <div className="Item_info_box2">

                        <div className = "Item_info_box2_head">
                            <img src={Location_icon} className="Item_info_icon"/>
                            <span className = "Item_info_text">직거래 위치</span>
                        </div>

                        <div className = "Item_info_box2_text">
                            경기도 남양주시 별내동
                        </div>

                    </div>

                    {/*카테고리 정보*/}
                    <div className="Item_info_box2">

                        <div className="Item_info_box2_head">
                            <img src={Category_icon} className="Item_info_icon"/>
                            <span className="Item_info_text">카테고리</span>
                        </div>

                        <div className="Item_info_box2_text">
                            디지털 > 카메라/DSLR > 디지털 캠코더
                        </div>

                    </div>

                    {/*상품 태그*/}
                    <div className="Item_info_box2" style={{borderRight: "none"}}>

                        <div className="Item_info_box2_head">
                            <img src={Tag_icon} className="Item_info_icon"/>
                            <span className="Item_info_text">태그</span>
                        </div>

                        <div className="Item_info_box2_text">
                            카메라, 캠코더, 소니, 8mm
                        </div>

                    </div>
                </div>


            </div>

            {/*상점 정보*/}
            <div className="Market_info_section">

                <div className = "Market_info_head1_box">
                    <span>상점 정보</span>
                </div>

                {/*상점 정보*/}
                <div className = "Market_info_container">
                    <img src = {Market_icon} className = "Market_info_icon"/>

                    <div className = "Market_info_box">
                        <span className = "Market_info_head">종서 상점</span>
                        <span className = "Market_info_text">상품 18 | 팔로워 48</span>
                    </div>

                </div>

                {/*상점 팔로우 버튼*/}
                <Follow_button/>

                {/*상점 상품 이미지*/}





            </div>


        </div>
    );
}

export default Item_explanation;