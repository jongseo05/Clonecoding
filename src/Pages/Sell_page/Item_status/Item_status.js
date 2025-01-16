import './Item_staus.css';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

const CustomRadio = styled(Radio)({
    color: '#B2B2B2', // 기본 회색
    '&.Mui-checked': {
        color: 'red', // 선택된 상태의 빨간색
    },
});

function Item_status() {
    return (
        <div className="Item_status_section">
            <div className="Item_status_head2_section">
                <p className="Item_status_head2">상품상태</p>
            </div>

            <div className="Item_status_select_section">
                <FormControl>
                    <RadioGroup
                        defaultValue="new"
                        name="item-status-group"
                    >
                        <FormControlLabel
                            value="new"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">새 상품 (미사용)</span>
                                    <span className="Item_status_description">사용하지 않은 새 상품</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="no_use"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">사용감 없음</span>
                                    <span className="Item_status_description">사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="slight_use"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">사용감 적음</span>
                                    <span className="Item_status_description">눈에 띄는 흔적이나 얼룩이 약간 있음</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="much_use"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">사용감 많음</span>
                                    <span className="Item_status_description">눈에 띄는 흔적이나 얼룩이 많이 있음</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="damaged"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">고장/파손 상품</span>
                                    <span className="Item_status_description">기능 이상이나 외관 손상 등으로 수리/수선 필요</span>
                                </div>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
}

export default Item_status;
