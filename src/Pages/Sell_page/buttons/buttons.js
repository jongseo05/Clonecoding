import './buttons.css';

function Buttons({ formData }) {

    const handleTemporarySave = () => {
        try {
            localStorage.setItem("sellPageFormData", JSON.stringify(formData));
            console.log(formData);
            alert("임시저장이 완료되었습니다!");
        } catch (error) {
            console.error("로컬스토리지 저장 오류:", error);
        }
    };

    return (
        <div className="Buttons_section">
            <div className="Buttons_container">
                <button className="Temporary_button" onClick={handleTemporarySave}>
                    임시저장
                </button>

                <button className="Item_register_button">
                    등록하기
                </button>
            </div>
        </div>
    );
}

export default Buttons;
