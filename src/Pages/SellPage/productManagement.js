import React from "react";
import "./productManagement.css"; // 스타일은 별도로 작성

const ProductManagement = () => {
    return (
        <div className="product-management">
            <div className="header">
                <input type="text" placeholder="상품명을 입력해주세요."/>
                <select>
                    <option value="10">10개씩</option>
                    <option value="20">20개씩</option>
                    <option value="50">50개씩</option>
                    <option value="100">100개씩</option>
                </select>
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
                <tr>
                    <td>사진</td>
                    <td>판매중</td>
                    <td>아디다스 스탠스미스</td>
                    <td>70,000원</td>
                    <td>0</td>
                    <td>2025-01-14 16:30</td>
                    <td>
                        <button style={{color: "red"}}>UP</button>
                        <button style={{color: "blue"}}>수정</button>
                        <button style={{color: "blue"}}>상품숨김</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;
