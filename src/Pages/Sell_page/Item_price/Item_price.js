import './Item_price.css';
import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

// 커스텀 체크박스 스타일 정의
const CustomCheckbox = styled(Checkbox)({
    color: '#B2B2B2', // 기본 체크박스 색상
    '&.Mui-checked': {
        color: 'red', // 체크된 상태의 빨간색
    },
});

function Item_price() {
    return (
        <div className="Item_price_section">
            <div className="head1_section">가격</div>

            <div className="Item_price_input_section">
                <div className="Item_price_head2_section">가격</div>
                <div className="Item_price_input_section2">
                    <div className="Item_price_input_container">
                        <input
                            className="Item_price_input"
                            placeholder="가격을 입력하세요"
                        />
                        원
                    </div>

                    <FormGroup>
                        <FormControlLabel
                            control={<CustomCheckbox defaultChecked />}
                            label="가격제안 받기"
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

export default Item_price;
