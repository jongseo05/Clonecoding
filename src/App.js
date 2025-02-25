import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Homepage from "./Pages/Homepage/Homepage";
import Sign_up from "./Pages/Sign_up/Sign_up/Sign_up";
import Number from "./Pages/Sign_up/Number/Number";
import MyMarket from "./Pages/MyMarket/MyMarket";
import SellRegister from "./Pages/SellPage/SellRegister";
import SellManage from "./Pages/SellPage/SellManage";
import LightningTalk from "./Pages/LightningTalk/LightningTalk";
import Products from "./Pages/Products/Products";
import ChatRoom from "./ChatRoom";
import { fireStore } from "./firebase";

// ✅ LightningTalkWrapper: chatId를 LightningTalk에 전달하는 래퍼 컴포넌트
const LightningTalkWrapper = () => {
    const { chatId } = useParams();
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

                    {/* ✅ LightningTalk 내부에서 ChatRoom을 Outlet을 통해 렌더링 */}
                    <Route path="/lightningtalk" element={<LightningTalkWrapper />}>
                        <Route path=":chatId" element={<ChatRoom />} />
                    </Route>

                    <Route path="/products" element={<Products />} />
                </Routes>
            </div>

            {/* Firestore 프로젝트 ID 표시 */}
            <div>{fireStore._databaseId.projectId}</div>
        </Router>
    );
}

export default App;
