import './Item_price.css';
import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const CustomCheckbox = styled(Checkbox)({
    color: '#B2B2B2',
    '&.Mui-checked': {
        color: 'red',
    },
});

function Item_price({ onPriceChange, formDataPrice }) {
    const [price, setPrice] = React.useState("");
    const [allowNegotiation, setAllowNegotiation] = React.useState(false);

    React.useEffect(() => {
        if (formDataPrice) {
            setPrice(formDataPrice.price || "");
            setAllowNegotiation(formDataPrice.allowNegotiation || false);
        }
    }, [formDataPrice]);

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPrice(newPrice);
        onPriceChange({ price: newPrice, allowNegotiation });
    };

    const handleNegotiationChange = (e) => {
        const newAllowNegotiation = e.target.checked;
        setAllowNegotiation(newAllowNegotiation);
        onPriceChange({ price, allowNegotiation: newAllowNegotiation });
    };

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
                            value={price}
                            onChange={handlePriceChange}
                        />
                        원
                    </div>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <CustomCheckbox
                                    checked={allowNegotiation}
                                    onChange={handleNegotiationChange}
                                />
                            }
                            label="가격제안 받기"
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

export default Item_price;
