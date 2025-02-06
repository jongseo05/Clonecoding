import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage/Homepage";
import Sign_up from "./Pages/Sign_up/Sign_up/Sign_up";
import Number from "./Pages/Sign_up/Number/Number";
import MyMarket from "./Pages/MyMarket/MyMarket";
import SellRegister from "./Pages/SellPage/SellRegister";
import SellManage from "./Pages/SellPage/SellManage";
import LightningTalk from "./Pages/LightningTalk/LightningTalk";
import Products from "./Pages/Products/Products";
import { useParams } from "react-router-dom";

const LightningTalkWrapper = () => {
    const { chatId } = useParams(); // ✅ URL에서 chatId 가져오기
    console.log("🚀 [App.js] chatId 확인:", chatId);
    return <LightningTalk chatId={chatId} />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/sign_up" element={<Sign_up />} />
                    <Route path="/sign_up/number" element={<Number />} />
                    <Route path="/mymarket" element={<MyMarket />} />
                    <Route path="/sell/register" element={<SellRegister />} />
                    <Route path="/sell/manage" element={<SellManage />} />
                    <Route path="/lightningtalk" element={<LightningTalk />} />
                    <Route path="/lightningtalk/:chatId" element={<LightningTalkWrapper/>} /> {/* ✅ chatId를 URL에서 받아서 전달 */}
                    <Route path="/products" element={<Products />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
