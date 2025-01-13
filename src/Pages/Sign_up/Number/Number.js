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

    const verifyCode = async () => {

        const maxRetries = 2;
        let retryCount = 0;

        const attemptVerification = async () => {
            try {
                if (!window.confirmationResult) {
                    throw new Error("인증 정보가 없습니다. 다시 시도해주세요.");
                }

                const result = await window.confirmationResult.confirm(inputValue);

                // 인증 성공 시 처리
                const formData = JSON.parse(localStorage.getItem("formData"));
                if (!formData) {
                    throw new Error("회원가입 정보를 찾을 수 없습니다.");
                }

                await saveUserToDatabase(result.user, formData);
                localStorage.removeItem("formData");
                localStorage.setItem("user", JSON.stringify(result.user));

                navigate("/");
                alert("회원가입이 완료되었습니다!");
                return true;

            } catch (error) {
                console.error(`Verification attempt ${retryCount + 1} failed:`, error);

                if (error.code === "auth/timeout" || error.code === "auth/network-request-failed") {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`Retrying verification (${retryCount}/${maxRetries})...`);
                        return false;
                    }
                }

                // 다른 에러이거나 최대 재시도 횟수를 초과한 경우
                throw error;
            }
        };

        try {
            let success = false;
            while (!success && retryCount <= maxRetries) {
                success = await attemptVerification();
                if (!success) {
                    // 재시도 전 잠시 대기
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (!success) {
                throw new Error("인증에 실패했습니다. 다시 시도해주세요.");
            }

        } catch (error) {
            console.error("Final verification error:", error);

            // 사용자 친화적인 에러 메시지 표시
            let errorMessage = "인증에 실패했습니다. ";

            if (error.code === "auth/invalid-verification-code") {
                errorMessage += "올바른 인증번호를 입력해주세요.";
            } else if (error.code === "auth/network-request-failed") {
                errorMessage += "네트워크 연결을 확인해주세요.";
            } else if (error.code === "auth/timeout") {
                errorMessage += "시간이 초과되었습니다. 다시 시도해주세요.";
            } else {
                errorMessage += "잠시 후 다시 시도해주세요.";
            }

            alert(errorMessage);
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
                </div>
            </div>
        </div>
    );
};

export default Number;
