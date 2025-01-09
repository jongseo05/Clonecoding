import React, { useState, useEffect } from "react";
import "./Number.css";
import TextField from "@mui/material/TextField";
import '../Sign_up/Sign_up.css';

const Number = () => {
    const [time, setTime] = useState(180); // 초기 타이머 시간 (180초 = 3분)
    const [inputValue, setInputValue] = useState(""); // 입력 값 관리

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 제거
        }
    }, [time]);

    // 타이머 형식 변환 함수 (mm:ss)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
                            id="name-input"
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

                    <button className="Sign_up_button">
                        <p className="Sign_up_button_text">확인</p>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Number;
