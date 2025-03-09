// src/Pages/Lightning_talk/Modal/Image_upload_modal/Image_upload_modal.js
import { useState, useRef, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../../../firebase';
import './Image_upload_modal.css';

// 채팅 서비스의 sendMessage 함수를 가져옴 - 경로 확인 필요
import { sendMessage } from '../../../../util/chatServices'

function Image_upload_modal({ isOpen, onClose, chatId }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const fileInputRef = useRef(null);

    // 컴포넌트 마운트 시 초기 설정 확인
    useEffect(() => {
        console.log("이미지 업로드 모달 마운트, 설정 확인:");
        console.log("- Firebase Storage 객체:", storage ? "초기화됨" : "초기화 안됨");
        console.log("- 인증 상태:", auth.currentUser ? "로그인됨" : "로그인 안됨");
        console.log("- 사용자 UID:", auth.currentUser?.uid);
        console.log("- 채팅방 ID:", chatId);
    }, [chatId]);

    // 미리보기 상태 로깅
    useEffect(() => {
        console.log("미리보기 상태:", preview ? "이미지 있음" : "이미지 없음");
        if (preview) {
            console.log("이미지 선택됨, 업로드 준비 완료");
        }
    }, [preview]);

    // 이미지 선택 핸들러
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 이미지 파일만 허용
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }

            console.log('이미지 선택됨:', file.name);
            console.log('파일 정보:', {
                타입: file.type,
                크기: file.size + " 바이트",
                마지막수정: new Date(file.lastModified).toLocaleString()
            });

            setSelectedImage(file);
            setErrorMessage(null);

            // 이미지 미리보기 생성
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 업로드 및 전송 핸들러
    const handleUploadAndSend = async () => {
        if (!selectedImage || !chatId || isUploading) return;

        setIsUploading(true);
        setErrorMessage(null);

        try {
            console.log("이미지 업로드 시작, 채팅 ID:", chatId);

            // 이미지 리사이징
            const resizedImage = await resizeImage(selectedImage, 265, 265);

            // 스토리지 경로 생성
            const timestamp = Date.now();
            const fileExt = selectedImage.name.split('.').pop();
            const fileName = `chat_images/${chatId}/${timestamp}.${fileExt}`;
            const storageRef = ref(storage, fileName);

            // Firebase Storage에 업로드
            const snapshot = await uploadBytes(storageRef, resizedImage);

            // 업로드된 이미지 URL 가져오기
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 중요: 텍스트를 null로 설정하고, mediaContent 객체를 명확하게 구성
            const mediaContent = {
                type: 'image',
                url: downloadURL,
                width: 265,
                height: 265
            };

            // 여기서 text는 null로, mediaContent는 올바른 객체로 전달
            await sendMessage(chatId, null, mediaContent);

            // 모달 닫기 및 상태 초기화
            onClose();
            setSelectedImage(null);
            setPreview(null);
        } catch (error) {
            console.error("이미지 업로드 오류:", error);
            setErrorMessage(`업로드 실패: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // 이미지 리사이징 함수
    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            try {
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                    try {
                        // 캔버스 생성 및 크기 설정
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        console.log("원본 이미지 크기:", width, "x", height);

                        // 비율 유지하면서 리사이징
                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }

                        width = Math.round(width);
                        height = Math.round(height);
                        console.log("리사이징 후 크기:", width, "x", height);

                        canvas.width = width;
                        canvas.height = height;

                        // 이미지 그리기
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Blob으로 변환
                        canvas.toBlob((blob) => {
                            if (blob) {
                                console.log("리사이징된 블롭 생성 완료:", blob.size, "바이트");
                                resolve(blob);
                            } else {
                                reject(new Error("이미지 변환 실패"));
                            }
                        }, file.type);
                    } catch (canvasError) {
                        console.error("캔버스 처리 오류:", canvasError);
                        reject(canvasError);
                    }
                };

                img.onerror = () => {
                    reject(new Error("이미지 로딩 실패"));
                };
            } catch (error) {
                console.error("리사이징 초기화 오류:", error);
                reject(error);
            }
        });
    };

    // 파일 선택 클릭 핸들러
    const handleSelectClick = () => {
        fileInputRef.current.click();
    };



    // 모달이 닫혀있으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        <div className="image_modal_overlay">
            <div className="image_modal_container">
                <div className="image_modal_header">
                    <h3>이미지 업로드</h3>
                    <button className="image_modal_close_button" onClick={onClose}>×</button>
                </div>

                <div className="image_modal_content">
                    {preview ? (
                        <div className="image_preview_container">
                            <img src={preview} alt="선택한 이미지" className="image_preview" />
                        </div>
                    ) : (
                        <div className="image_placeholder" onClick={handleSelectClick}>
                            <div className="image_icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 15L16 10L5 21" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p>이미지를 선택해주세요</p>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="file_input"
                    />
                    

                    {errorMessage && (
                        <div style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center', padding: '5px', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
                            {errorMessage}
                        </div>
                    )}

                </div>

                <div className="image_modal_footer">
                    <button
                        className="image_placeholder_button"
                        onClick={handleSelectClick}
                        style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                    >
                        사진 다시 선택하기
                    </button>

                    {preview && (
                        <button
                            className="image_send_button"
                            onClick={handleUploadAndSend}
                            disabled={!selectedImage || isUploading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: selectedImage && !isUploading ? '#4e4edd' : '#aaa',
                                color: 'white',
                                border: '2px solid #3e3edd',
                                borderRadius: '4px',
                                cursor: selectedImage && !isUploading ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {isUploading ? '업로드 중...' : '사진 보내기'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Image_upload_modal;