import React from "react";
import "./Temporary_save_modal.css";
import { createPortal } from "react-dom";

const Temporary_save_modal = ({ onClose, onNewRegister, onContinue }) => {

    {/*modalRoot 설정*/}
    const modalRoot = document.getElementById("modal-root") || (() => {
        const modalRootElement = document.createElement("div");
        modalRootElement.id = "modal-root";
        document.body.appendChild(modalRootElement);
        return modalRootElement;
    })();

    {/*뒷 배경 클릭시 나가짐*/}
    const handleBackgroundClick = (e) => {
        if (e.target.className.includes("Temporary_save_back")) {
            onClose(false); // 모달 닫기
        }
    };

    return createPortal(
        <div className="Temporary_save_back" onClick={handleBackgroundClick}>
            <div className="Temporary_save_modal_container" onClick={(e) => e.stopPropagation()}>
                <div className="Temporary_save_modal_text_container">
                    <div className="Temporary_save_modal_text">
                        임시저장된 글이 있습니다.<br />
                        이어서 등록하시겠습니까?
                    </div>
                </div>
                <div className="Temporary_save_modal_divider"></div>

                <div className="Temporary_save_modal_button_container">
                    <div
                        className="Temporary_save_modal_button1"
                        onClick={() => {
                            onNewRegister(); // 새로 등록 동작
                            onClose(false); // 모달 닫기
                        }}
                    >
                        새로등록
                    </div>
                    <div
                        className="Temporary_save_modal_button2"
                        onClick={() => {
                            onContinue(); // 이어서 등록 동작
                            onClose(false); // 모달 닫기
                        }}
                    >
                        이어서 하기
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default Temporary_save_modal;
