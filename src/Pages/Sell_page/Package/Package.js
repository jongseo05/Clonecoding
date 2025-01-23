import './Package.css';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

const CustomRadio = styled(Radio)({
    color: '#B2B2B2',
    '&.Mui-checked': {
        color: 'red',
    },
});

function Package({ formDataPackage, onPackageChange }) {
    const [packageOption, setPackageOption] = React.useState("included");

    React.useEffect(() => {
        if (formDataPackage) {
            setPackageOption(formDataPackage.packageOption || "included");
        }
    }, [formDataPackage]);

    const handlePackageChange = (e) => {
        const value = e.target.value;
        setPackageOption(value);
        onPackageChange(value);
    };

    return (
        <div className="Package_section">
            <div className="Package_head1_section">
                <p className="Package_head1">택배거래</p>
            </div>

            <div className="Package_price_section">
                <div className="Package_price_head2_section">배송비</div>
                <div className="Package_price_container">
                    <FormControl>
                        <RadioGroup
                            row
                            name="package-option"
                            value={packageOption}
                            onChange={handlePackageChange}
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
    );
}

export default Package;
