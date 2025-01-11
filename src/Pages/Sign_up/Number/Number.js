import React, { useState, useEffect } from "react";
import "./Number.css";
import TextField from "@mui/material/TextField";
import { auth } from "../../../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { signInWithPhoneNumber } from "firebase/auth"; // 누락된 부분 추가
import { useNavigate } from "react-router-dom";


const Number = () => {
    const [time, setTime] = useState(180); // 초기 타이머 시간 (180초 = 3분)
    const [inputValue, setInputValue] = useState(""); // 입력 값 관리
    const navigate = useNavigate();
    const db = getFirestore(); // Firestore 초기화

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 제거
        }
    }, [time]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const saveUserToDatabase = async (user) => {
        try {
            const formData = JSON.parse(localStorage.getItem("formData")); // Sign_up에서 저장된 정보 가져오기
            await setDoc(doc(db, "users", user.uid), {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                birthdate: formData.birthdate,
                carrier: formData.carrier,
                createdAt: new Date()
            });
            console.log("User saved successfully!");
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const verifyCode = () => {
        const code = inputValue; // 사용자가 입력한 인증번호
        window.confirmationResult
            .confirm(code)
            .then(async (result) => {
                const user = result.user;
                console.log("Phone number verified!", user);

                // 1. 사용자 정보 Firestore에 저장
                await saveUserToDatabase(user);

                // 2. 세션 유지
                localStorage.setItem("user", JSON.stringify(user));

                // 3. 다음 페이지로 이동
                navigate("/");
                alert("회원가입이 완료되었습니다!");
            })
            .catch((error) => {
                console.error("Verification failed: ", error);
                alert("인증 실패: 입력한 인증번호를 확인해주세요.");
            });
    };

    const resendCode = async () => {
        try {
            const formData = JSON.parse(localStorage.getItem("formData")); // Sign_up에서 저장된 정보 가져오기
            const phoneNumber = formData.phoneNumber.trim();
            const internationalPhoneNumber = `+82${phoneNumber.slice(1)}`;
            const appVerifier = window.recaptchaVerifier;

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                internationalPhoneNumber,
                appVerifier
            );
            window.confirmationResult = confirmationResult;
            console.log("Verification code resent successfully!");
            alert("새로운 인증번호가 발송되었습니다.");
        } catch (error) {
            console.error("Resend failed: ", error);
            alert("인증번호 재전송에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="Number_background">
            <div className="Number_section">
                <div className="Number_container">
                    <div className="Number-Title">
                        <h3 className="Number-Title-Text">인증번호를 입력해주세요</h3>
                    </div>

                    <div className="Number-Input">
                        <TextField
                            id="verification-code-input"
                            variant="standard"
                            placeholder="인증번호 입력"
                            fullWidth
                            margin="normal"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "#FF0000",
                                            marginLeft: "8px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatTime(time)}
                                    </span>
                                ),
                            }}
                            sx={{
                                textAlign: "center",
                                "& .MuiInputBase-input": {
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#555",
                                },
                            }}
                        />
                    </div>

                    <button className="Sign_up_button" onClick={verifyCode}>
                        <p className="Sign_up_button_text">확인</p>
                    </button>

                    {/* 인증번호 재전송 버튼 기입 예정 */}
                    
                </div>
            </div>
        </div>
    );
};

export default Number;
