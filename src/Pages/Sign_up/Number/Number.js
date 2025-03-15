// Number.js
import React, { useState, useEffect } from "react";
import "./Number.css";
import TextField from "@mui/material/TextField";
import { auth } from "../../../firebase";
import { getDatabase, ref, get, query, orderByChild, equalTo, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Number = () => {
    const [time, setTime] = useState(180);
    const [inputValue, setInputValue] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

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

    // 전화번호로 기존 사용자 찾기
    const findUserByPhoneNumber = async (phoneNumber) => {
        try {
            const db = getDatabase();
            const usersRef = ref(db, 'users');

            // 전화번호로 사용자 검색
            const userQuery = query(usersRef, orderByChild('phoneNumber'), equalTo(phoneNumber));
            const snapshot = await get(userQuery);

            if (snapshot.exists()) {
                // 사용자가 존재하면 첫 번째 사용자 반환
                const users = snapshot.val();
                const userId = Object.keys(users)[0];
                return {
                    userId,
                    userData: users[userId]
                };
            }

            return null; // 사용자가 없으면 null 반환
        } catch (error) {
            console.error("사용자 검색 오류:", error);
            return null;
        }
    };

    // 새 사용자 등록
    const saveUserToDatabase = async (user, formData) => {
        try {
            if (!formData) {
                throw new Error("Form data is missing");
            }

            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);

            // 팔로워 및 팔로잉 필드 초기화
            await set(userRef, {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                birthdate: formData.birthdate,
                carrier: formData.carrier,
                createdAt: new Date().toISOString(),
                followers: {},
                following: {}
            });

            // 마켓 정보 초기화
            const marketRef = ref(db, `markets/${user.uid}`);
            await set(marketRef, {
                marketName: `${formData.name}의 상점`,
                description: '',
                visitCount: 0,
                salesCount: 0,
                openDate: new Date().toISOString(),
                products: [],
                reviews: [],
                likes: 0,
                following: 0,
                followers: 0
            });

            console.log("User saved to Realtime Database successfully!");
            return true;
        } catch (error) {
            console.error("Error saving user to Realtime Database:", error);
            throw error;
        }
    };

    // 기존 사용자 데이터 업데이트
    const updateExistingUser = async (userId, formData) => {
        try {
            const db = getDatabase();
            const userRef = ref(db, `users/${userId}`);

            // 주요 필드만 업데이트
            await update(userRef, {
                carrier: formData.carrier,
                lastLogin: new Date().toISOString()
            });

            console.log("기존 사용자 정보 업데이트 완료");
            return true;
        } catch (error) {
            console.error("사용자 업데이트 오류:", error);
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

            {/* 타임아웃 처리 */}
            const result = await Promise.race([
                window.confirmationResult.confirm(inputValue),
                new Promise((_, reject) => {
                    timeoutHandle = setTimeout(() => {
                        reject(new Error("인증 시간이 초과되었습니다."));
                    }, 180000);
                })
            ]);

            clearTimeout(timeoutHandle);

            try {
                const formData = JSON.parse(localStorage.getItem("formData"));
                if (!formData) {
                    throw new Error("회원가입 정보를 찾을 수 없습니다.");
                }

                // 전화번호로 기존 사용자 확인
                const existingUser = await findUserByPhoneNumber(formData.phoneNumber);

                if (existingUser) {
                    console.log("기존 계정 발견:", existingUser.userId);

                    // 기존 사용자 정보 업데이트
                    await updateExistingUser(existingUser.userId, formData);

                    alert("기존 계정으로 로그인 되었습니다!");
                } else {
                    // 새 사용자 등록
                    await saveUserToDatabase(result.user, formData);
                    alert("회원가입이 완료되었습니다!");
                }

                localStorage.removeItem("formData");
                localStorage.setItem("user", JSON.stringify(result.user));
                window.confirmationResult = null;

                navigate("/");
            } catch (dbError) {
                console.error("Database error:", dbError);
                alert("회원 정보 저장 중 오류가 발생했습니다. 고객센터로 문의해주세요.");
                navigate("/");
            }
        } catch (error) {
            if (timeoutHandle) clearTimeout(timeoutHandle);

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
            setIsVerifying(false);
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