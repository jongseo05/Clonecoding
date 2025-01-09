import React, { useState } from 'react';
import './Sign_up.css';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


function Sign_up() {
    const [name, setName] = useState("");
    const [passwordChar, setPasswordChar] = useState(""); // Password input의 단일 글자 상태

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        const input = event.target.value;
        if (input.length <= 1) {
            setPasswordChar(input);
        }
    };

    return (
        <div className="Sign_up_background">
            <div className="Sign_up_container">
                <div className="Sign_up_title">
                    본인 정보를 입력해주세요
                </div>

                {/* 이름 입력 필드 */}
                <TextField
                    id="name-input"
                    label="이름"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    onChange={handleNameChange}
                    sx = {{ textAlign: "center",
                        '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555' }, } }
                />

                <div className="Sign_up_birth_input">
                    {/* 생년월일 입력 필드 */}
                    <TextField
                        id="birthdate-input"
                        label="생년월일"
                        variant="standard"
                        margin="normal"
                        placeholder="예시 900101"
                        sx={{
                            width: "215px",
                            height: "60px",
                            '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                        }}
                    />

                    <p>-</p>

                    {/* 한 글자만 입력 가능한 패스워드 필드 */}
                    <TextField
                        id="password-input"
                        variant="standard"
                        margin="normal"
                        sx={{
                            width: "36px",
                            textAlign: "center",
                            paddingTop : "8px",
                            '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555',textAlign: "center" },
                        }}
                        onChange={handlePasswordChange}
                        value={passwordChar}
                    />
                    ●●●●●●
                </div>

                {/* 전화번호 입력 필드 */}
                <TextField
                    id="전화번호 입력"
                    label="전화번호"
                    variant="standard"
                    placeholder="01012345678"
                    fullWidth
                    margin="normal"
                    onChange={handleNameChange}
                    sx = {{ textAlign: "center",
                        '& .MuiInputBase-input': { fontSize: '18px', fontWeight: 'bold', color: '#555' }, } }
                />

                {/* 통신사 선택 필드 */}
                <FormControl
                    fullWidth
                    sx={{
                        marginTop: "16px",
                        '& .MuiInputLabel-root': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                        '& .MuiSelect-root': { fontSize: '18px', fontWeight: 'bold', color: '#555' },
                    }}
                >
                    <InputLabel id="demo-simple-select-label">통신사</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        variant="standard"
                        label="통신사"
                    >
                        <MenuItem value={"KT"}>KT</MenuItem>
                        <MenuItem value={"SKT"}>SKT</MenuItem>
                        <MenuItem value={"LG_U+"}>LG U+</MenuItem>
                        <MenuItem value={"KT_saving"}>KT 알뜰폰</MenuItem>
                        <MenuItem value={"SKT_saving"}>SKT 알뜰폰</MenuItem>
                        <MenuItem value={"LG_U+_saving"}>LG U+ 알뜰폰</MenuItem>
                    </Select>
                </FormControl>


                <button className = "Sign_up_button">
                    <p className = "Sign_up_button_text">다음</p>
                </button>

            </div>
        </div>
    );
}

export default Sign_up;
