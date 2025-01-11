import React, { useState , useEffect} from 'react';
import './Sign_up.css';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { auth } from "../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";


function Sign_up() {
    const [formData, setFormData] = useState({
        name: "",
        birthdate: "",
        First_Personal_number: "",
        phoneNumber: "",
        carrier: ""
    });

    // reCAPTCHA 초기화를 위한 useEffect 추가
    useEffect(() => {
        // auth 객체 확인
        console.log("Auth object:", auth);

        if (!window.recaptchaVerifier && auth) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        console.log("reCAPTCHA resolved");
                    }
                }
            );
        }

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);  // 빈 배열로 한 번만 실행

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };



    {/* SMS 발송 처리를 위한 별도 함수 */}


    const sendVerificationCode = async () => {
        try {
            const phoneNumber = formData.phoneNumber.trim();
            console.log("Phone number:", phoneNumber);

            if (!/^010\d{8}$/.test(phoneNumber)) {
                throw new Error("전화번호 형식이 잘못되었습니다. 01012345678 형식으로 입력해주세요.");
            }

            if (!auth) {
                throw new Error("Firebase 인증이 초기화되지 않았습니다.");
            }

            const internationalPhoneNumber = `+82${phoneNumber.slice(1)}`;
            console.log("International format:", internationalPhoneNumber);

            const appVerifier = window.recaptchaVerifier;
            if (!appVerifier) {
                throw new Error("reCAPTCHA가 초기화되지 않았습니다.");
            }

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                internationalPhoneNumber,
                appVerifier
            );
            window.confirmationResult = confirmationResult;
            alert("인증번호가 발송되었습니다.");

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);

            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    };

    // SMS 발송 처리를 위한 별도 함수
    const handleSendSMS = async (phoneNumber) => {
        try {
            const internationalPhoneNumber = `+82${phoneNumber.slice(1)}`;
            console.log("Sending verification code to:", internationalPhoneNumber);

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                internationalPhoneNumber,
                window.recaptchaVerifier
            );
            window.confirmationResult = confirmationResult;
            console.log("Verification code sent successfully!");
            alert("SMS 인증번호가 발송되었습니다.");
        } catch (error) {
            console.error("SMS sending error:", error);
            alert("SMS 인증번호 발송에 실패했습니다. 다시 시도해주세요.");

            // 에러 발생 시 reCAPTCHA 리셋
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    };

    return (
        <div className="Sign_up_background">
            <div className="Sign_up_container">
                <div className="Sign_up_title">본인 정보를 입력해주세요</div>

                <TextField
                    id="name-input"
                    name="name"
                    label="이름"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    sx={{
                        textAlign: "center",
                        '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                    }}
                />

                <div className="Sign_up_birth_input">
                    <TextField
                        id="birthdate-input"
                        name="birthdate"
                        label="생년월일"
                        variant="standard"
                        margin="normal"
                        placeholder="예시 900101"
                        onChange={handleChange}
                        sx={{
                            width: "215px",
                            height: "60px",
                            '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                        }}
                    />

                    <p>-</p>

                    <TextField
                        id="password-input"
                        name="First_Personal_number"
                        variant="standard"
                        margin="normal"
                        sx={{
                            width: "36px",
                            textAlign: "center",
                            paddingTop: "8px",
                            '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555', textAlign: "center" },
                        }}
                        onChange={handleChange}
                        value={formData.First_Personal_number}
                    />
                    ●●●●●●
                </div>

                <TextField
                    id="phoneNumber-input"
                    name="phoneNumber"
                    label="전화번호"
                    variant="standard"
                    placeholder="01012345678"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    sx={{
                        textAlign: "center",
                        '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                    }}
                />

                <FormControl
                    fullWidth
                    sx={{
                        marginTop: "16px",
                        '& .MuiInputLabel-root': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                        '& .MuiSelect-root': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                    }}
                >
                    <InputLabel id="carrier-select-label">통신사</InputLabel>
                    <Select
                        labelId="carrier-select-label"
                        id="carrier-select"
                        name="carrier"
                        variant="standard"
                        label="통신사"
                        onChange={handleChange}
                        value={formData.carrier}
                    >
                        <MenuItem value={"KT"}>KT</MenuItem>
                        <MenuItem value={"SKT"}>SKT</MenuItem>
                        <MenuItem value={"LG_U+"}>LG U+</MenuItem>
                        <MenuItem value={"KT_saving"}>KT 알뜰폰</MenuItem>
                        <MenuItem value={"SKT_saving"}>SKT 알뜰폰</MenuItem>
                        <MenuItem value={"LG_U+_saving"}>LG U+ 알뜰폰</MenuItem>
                    </Select>
                </FormControl>

                <div id="recaptcha-container" style={{ margin: '20px 0' }}></div>

                <button className="Sign_up_button" onClick={sendVerificationCode}>
                    <p className="Sign_up_button_text">다음</p>
                </button>
            </div>
        </div>
    );
}

export default Sign_up;