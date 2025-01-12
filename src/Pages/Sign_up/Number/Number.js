import React, { useState, useEffect } from "react";
import "./Number.css";
import TextField from "@mui/material/TextField";
import { auth } from "../../../firebase";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Number = () => {
    const [time, setTime] = useState(180); // 초기 타이머 시간
    const [inputValue, setInputValue] = useState(""); // 인증번호 입력 값 관리
    const navigate = useNavigate();

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

    const saveUserToDatabase = async (user, formData) => {
        try {
            if (!formData) {
                throw new Error("Form data is missing");
            }

            const db = getDatabase(); // Realtime Database 초기화
            const userRef = ref(db, `users/${user.uid}`); // 사용자 UID 경로 설정

            await set(userRef, {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                birthdate: formData.birthdate,
                carrier: formData.carrier,
                createdAt: new Date().toISOString(), // 현재 시간 저장
            });
            console.log("User saved to Realtime Database successfully!");
        } catch (error) {
            console.error("Error saving user to Realtime Database:", error);
        }
    };

    const verifyCode = () => {
    const code = inputValue; // 사용자가 입력한 인증번호
    Promise.race([
        window.confirmationResult.confirm(code),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout during verification")), 120000) // 120초 제한으로 변경
        ),
    ])
        .then(async (result) => {
            const user = result.user; // 인증된 사용자 정보
            console.log("Phone number verified!", user);

            // localStorage에서 formData를 가져옴
            const formData = JSON.parse(localStorage.getItem("formData"));
            console.log("FormData from localStorage:", formData);

            if (!formData) {
                throw new Error("Form data not found in localStorage");
            }

            // 사용자 정보를 Realtime Database에 저장
            await saveUserToDatabase(user, formData);

            // 로컬 스토리지 초기화
            localStorage.removeItem("formData");

            // 세션 정보 저장
            localStorage.setItem("user", JSON.stringify(user));

            // 홈 페이지로 이동
            navigate("/");
            alert("회원가입이 완료되었습니다!");
        })
        .catch((error) => {
            console.error("Verification failed:", error);
            alert(error.message || "인증 실패: 입력한 인증번호를 확인해주세요.");
        });
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
                </div>
            </div>
        </div>
    );
};

export default Number;
