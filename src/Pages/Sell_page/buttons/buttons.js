import './buttons.css';
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

function Buttons({ formData }) {
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleTemporarySave = () => {
        try {
            localStorage.setItem("sellPageFormData", JSON.stringify(formData));
            console.log(formData);
            alert("임시저장이 완료되었습니다!");
        } catch (error) {
            console.error("로컬스토리지 저장 오류:", error);
        }
    };

    const handleRegister = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.uid) {
                alert("로그인이 필요합니다.");
                return;
            }

            const { mainCategory, subCategory, smallCategory } = formData.Category;

            // 카테고리 필수 체크
            if (!mainCategory || !subCategory || !smallCategory) {
                alert("카테고리를 모두 선택해주세요.");
                return;
            }

            const db = getDatabase(); // Firebase Realtime Database 초기화
            const itemRef = ref(
                db,
                `items/${mainCategory}/${subCategory}/${smallCategory}/${user.uid}/${Date.now()}`
            ); // 카테고리별로 데이터 저장 경로 설정

            set(itemRef, { ...formData, uid: user.uid }) // 데이터 저장
                .then(() => {
                    alert("등록이 완료되었습니다!");
                    navigate('/'); // 등록 후 홈페이지로 리다이렉션
                })
                .catch((error) => {
                    console.error("데이터베이스 저장 오류:", error);
                    alert("등록에 실패했습니다.");
                });
        } catch (error) {
            console.error("등록 처리 오류:", error);
        }
    };

    return (
        <div className="Buttons_section">
            <div className="Buttons_container">
                <button className="Temporary_button" onClick={handleTemporarySave}>
                    임시저장
                </button>

                <button className="Item_register_button" onClick={handleRegister}>
                    등록하기
                </button>
            </div>
        </div>
    );
}

export default Buttons;
