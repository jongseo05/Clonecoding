import './Item_staus.css';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {useEffect} from "react";

const CustomRadio = styled(Radio)({
    color: '#B2B2B2',
    '&.Mui-checked': {
        color: 'red',
    },
});

function Item_status({ onStatusChange , formDataStatus}) {
    const [status, setStatus] = React.useState("new");

    useEffect(() => {
        if(formDataStatus){
            setStatus(formDataStatus);
        }
    }, [formDataStatus]);

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);
        onStatusChange(value); // 선택된 상태 값을 부모로 전달
    };

    return (
        <div className="Item_status_section">
            <div className="Item_status_head2_section">
                <p className="Item_status_head2">상품상태</p>
            </div>

            <div className="Item_status_select_section">
                <FormControl>
                    <RadioGroup
                        name="item-status-group"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <FormControlLabel
                            value="새 상품(미사용)"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">새 상품 (미사용)</span>
                                    <span className="Item_status_description">사용하지 않은 새 상품</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="사용감 없음"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">사용감 없음</span>
                                    <span className="Item_status_description">사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="사용감 적음"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">사용감 적음</span>
                                    <span className="Item_status_description">눈에 띄는 흔적이나 얼룩이 약간 있음</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="사용감 많음"
                            control={<CustomRadio />}
                            label={
                                <div className="Item_status_label_horizontal">
                                    <span className="Item_status_label_title">사용감 많음</span>
                                    <span className="Item_status_description">눈에 띄는 흔적이나 얼룩이 많이 있음</span>
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="고장/파손 상품"
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
