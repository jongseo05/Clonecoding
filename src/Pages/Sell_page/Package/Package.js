import './Package.css';
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

function Package() {
    return (
        <div className="Package_section">
            <div className="Package_head1_section">
                <p className="Package_head1">택배거래</p>
            </div>

            <div className="Package_price_section">
                <div className="Package_price_head2_section">
                    배송비
                </div>
                <div className="Package_price_container">
                    <div className="Package_price_select_section">
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel
                                    value="included"
                                    control={<CustomRadio />}
                                    label="배송비포함"
                                />
                                <FormControlLabel
                                    value="excluded"
                                    control={<CustomRadio />}
                                    label="배송비별도"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Package;
