import React, { useState } from 'react';
import './Sign_up.css';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { auth } from "../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

function Sign_up() {
    const [formData, setFormData] = useState({
        name: "",
        birthdate: "",
        First_Personal_number: "",
        phoneNumber: "",
        carrier: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const sendVerificationCode = async () => {
        try {
            // 전화번호 유효성 검사
            const phoneNumber = formData.phoneNumber.trim(); // 공백 제거
            console.log("User entered phone number:", phoneNumber);

            if (!/^010\d{8}$/.test(phoneNumber)) {
                throw new Error("전화번호 형식이 잘못되었습니다. 01012345678 형식으로 입력해주세요.");
            }

            // RecaptchaVerifier 초기화
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,"recaptcha-container",
                    {
                        size: "invisible",
                        callback: (response) => {
                            console.log("Recaptcha verified successfully:", response);
                        },
                        'expired-callback': () => {
                            console.error("Recaptcha expired. Please try again.");
                        },
                    },

                );
            }

            // RecaptchaVerifier 초기화 확인
            console.log("RecaptchaVerifier instance:", window.recaptchaVerifier);

            const appVerifier = window.recaptchaVerifier;

            // 국제 전화번호로 변환
            const internationalPhoneNumber = `+82${phoneNumber.slice(1)}`;
            console.log("Sending verification code to:", internationalPhoneNumber);

            // Firebase로 SMS 인증 요청
            const confirmationResult = await signInWithPhoneNumber(auth, internationalPhoneNumber, appVerifier);
            window.confirmationResult = confirmationResult; // 전역에 저장
            console.log("Verification code sent successfully!");
            alert("SMS 인증번호가 발송되었습니다.");
        } catch (error) {
            console.error("Error sending verification code:", error.message);

            if (error.code === 'auth/missing-app-verifier') {
                console.error("RecaptchaVerifier instance is missing. Ensure it is initialized properly.");
            } else if (error.code === 'auth/invalid-phone-number') {
                console.error("The phone number format is invalid. Ensure the format includes the country code.");
            } else {
                console.error("Unexpected error:", error);
            }

            alert(error.message || "SMS 인증번호 발송 중 문제가 발생했습니다.");
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

                <div id="recaptcha-container"></div>

                <button className="Sign_up_button" onClick={sendVerificationCode}>
                    <p className="Sign_up_button_text">다음</p>
                </button>
            </div>
        </div>
    );
}

export default Sign_up;
