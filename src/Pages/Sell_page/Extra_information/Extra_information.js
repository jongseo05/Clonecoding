import './Extra_information.css';
import '../Item_price/Item_price.css'
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

// 커스텀 Radio 스타일 정의
const CustomRadio = styled(Radio)({
    color: '#B2B2B2', // 기본 회색
    '&.Mui-checked': {
        color: 'red', // 선택된 상태의 빨간색
    },
});

function Extra_information() {
    return(
        <div className="Extra_information_section">
            <div className="Extra_information_head1_section">
                <p className="Extra_information_head1">추가 정보</p>
            </div>


            {/*직거래*/}
            <div className="Extra_information_container">
                <div className="Extra_information_head2_section">
                    직거래
                </div>

                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel
                            value="possible"
                            control={<CustomRadio />}
                            label="가능"
                        />
                        <FormControlLabel
                            value="impossible"
                            control={<CustomRadio />}
                            label="불가"
                        />
                    </RadioGroup>
                </FormControl>
            </div>

            {/*수량*/}
            <div className="Extra_information_container">
                <div className="Extra_information_head2_section">
                    수량
                </div>
                <div className="Item_price_input_container">
                    <input
                        className="Item_price_input"
                        placeholder="수량을 입력하세요"
                    />
                    개
                </div>
            </div>


        </div>
    )
}

export default Extra_information;