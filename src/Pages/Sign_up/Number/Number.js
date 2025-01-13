// Number.js
import React, { useState, useEffect } from "react";
import "./Number.css";
import TextField from "@mui/material/TextField";
import { auth } from "../../../firebase";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Number = () => {
    const [time, setTime] = useState(180); // 초기 타이머 시간
    const [inputValue, setInputValue] = useState(""); // 인증번호 입력 값
    const [isVerifying, setIsVerifying] = useState(false); // 인증 처리 상태
    const navigate = useNavigate();

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
        }

        // 컴포넌트 언마운트 시 confirmationResult 초기화
        return () => {
            if (window.confirmationResult) {
                console.log("confirmationResult 초기화");
                window.confirmationResult = null;
            }
        };
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
            throw error;
        }
    };

    const verifyCode = async () => {
        if (!inputValue.trim()) {
            alert("인증번호를 입력해주세요.");
            return;
        }

        let timeoutHandle;
        setIsVerifying(true);

        try {
            if (!window.confirmationResult) {
                throw new Error("인증 정보가 없습니다. 다시 시도해주세요.");
            }

            // Promise.race로 타임아웃 처리
            const result = await Promise.race([
                window.confirmationResult.confirm(inputValue),
                new Promise((_, reject) => {
                    timeoutHandle = setTimeout(() => {
                        reject(new Error("인증 시간이 초과되었습니다."));
                    }, 180000); // 3분
                })
            ]);

            clearTimeout(timeoutHandle); // 타임아웃 정리

            try {
                const formData = JSON.parse(localStorage.getItem("formData"));
                if (!formData) {
                    throw new Error("회원가입 정보를 찾을 수 없습니다.");
                }

                await saveUserToDatabase(result.user, formData);
                localStorage.removeItem("formData");
                localStorage.setItem("user", JSON.stringify(result.user));

                window.confirmationResult = null;
                alert("회원가입이 완료되었습니다!");
                navigate("/");
            } catch (dbError) {
                console.error("Database error:", dbError);
                alert("회원 정보 저장 중 오류가 발생했습니다. 고객센터로 문의해주세요.");
                navigate("/"); // 에러 발생 시 홈으로 이동
            }
        } catch (error) {
            if (timeoutHandle) clearTimeout(timeoutHandle); // 타임아웃 정리

            let errorMessage = "인증에 실패했습니다.";
            if (error.message.includes("초과")) {
                errorMessage = "인증 시간이 초과되었습니다. 처음부터 다시 시도해주세요.";
                navigate("/sign_up");
            } else if (error.code === "auth/code-expired") {
                errorMessage = "인증 코드가 만료되었습니다. 처음부터 다시 시도해주세요.";
                navigate("/sign_up");
            } else if (error.code === "auth/invalid-verification-code") {
                errorMessage = "올바른 인증번호를 입력해주세요.";
            } else {
                errorMessage = "네트워크 상태를 확인하고 잠시 후 다시 시도해주세요.";
            }

            alert(errorMessage);
        } finally {
            setIsVerifying(false); // 인증 상태 초기화
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
                    <button
                        className="Sign_up_button"
                        onClick={verifyCode}
                        disabled={isVerifying}
                    >
                        <p className="Sign_up_button_text">
                            {isVerifying ? "처리중" : "확인"}
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Number;