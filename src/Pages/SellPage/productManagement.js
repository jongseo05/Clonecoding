import React, { useState } from "react";
import "./productManagement.css"; // 스타일은 별도로 작성
import ExImg1 from "../../Components/Card/Ex_img/Ex_img1.png";
import { SlArrowDown } from "react-icons/sl";

const CustomDropdown = ({ options, value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className={`custom-dropdown ${className}`}>
            <div className="custom-dropdown-selected" onClick={handleToggle}>
                <span>{value || "선택해주세요"}</span>
                <SlArrowDown className={`dropdown-icon ${isOpen ? "open" : ""}`} />
            </div>
            {isOpen && (
                <ul className="custom-dropdown-options">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="custom-dropdown-option"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label || option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const ProductManagement = () => {
    const [itemsPerPage, setItemsPerPage] = useState("10");
    const [saleStatus, setSaleStatus] = useState("전체");
    const [activeTab, setActiveTab] = useState("전체");

    // 상품 목록 예시
    const products = [
        { id: 1, name: "아디다스 스탠스미스", price: "70,000원", status: "판매중", image: ExImg1 },
    ];

    // 페이지 수는 1로 고정
    const totalPages = 1;

    // 상태에 따른 필터링된 상품 목록
    const filteredProducts = products.filter((product) =>
        saleStatus === "전체" || product.status === saleStatus
    );

    return (
        <div className="product-management">
            <div className="header">
                <input type="text" placeholder="상품명을 입력해주세요." />
                <CustomDropdown
                    options={["10개씩", "20개씩", "50개씩", "100개씩"]}
                    value={itemsPerPage}
                    onChange={setItemsPerPage}
                    className="items-dropdown"
                />
                <div className="status-tabs">
                    {/* 탭 네비게이션 */}
                    <button
                        className={activeTab === "전체" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("전체");
                            setSaleStatus("전체");
                        }}
                    >
                        전체
                    </button>
                    <button
                        className={activeTab === "판매중" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("판매중");
                            setSaleStatus("판매중");
                        }}
                    >
                        판매중
                    </button>
                    <button
                        className={activeTab === "예약중" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("예약중");
                            setSaleStatus("예약중");
                        }}
                    >
                        예약중
                    </button>
                    <button
                        className={activeTab === "판매완료" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("판매완료");
                            setSaleStatus("판매완료");
                        }}
                    >
                        판매완료
                    </button>
                    <button
                        className={activeTab === "숨김" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("숨김");
                            setSaleStatus("숨김");
                        }}
                    >
                        숨김
                    </button>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th>사진</th>
                    <th>판매상태</th>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>찜</th>
                    <th>최근수정일</th>
                    <th>기능</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product) => (
                    <tr key={product.id}>
                        <td>
                            <img
                                src={product.image}
                                alt="상품 이미지"
                                className="product-management-img"
                            />
                        </td>
                        <td>
                            <CustomDropdown
                                options={["판매중", "예약중", "삭제", "판매완료"]}
                                value={product.status}
                                onChange={(status) => {
                                    // 상태 업데이트 로직 추가
                                }}
                                className="status-dropdown"
                            />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>0</td>
                        <td>
                            2025-01-14
                            <br />
                            16:30
                        </td>
                        <td className="button-column">
                            <button className={"btn-up"}>UP</button>
                            <button className={"btn-edit"}>수정</button>
                            <button className={"btn-hide"}>상품숨김</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이지 번호 표시 */}
            <div className="pagination">
                <button>{totalPages}</button>
            </div>
        </div>
    );
};

export default ProductManagement;
