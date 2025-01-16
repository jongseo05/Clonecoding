import React, { useState } from "react";
import "./MyMarket.css";
import StoreInfo from "../../Components/StoreInfo";
import Tabs from "../../Components/Tabs";
import TabContent from "../../Components/TabContent";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context from "../../Components/Context/Context";

function MyMarket() {
    const [activeTab, setActiveTab] = useState("상품");

    return (
        <div className="container">
            <Top_navbar />
            <Context />
            <StoreInfo />
            <Tabs activeTab={activeTab} handleTabClick={setActiveTab} />
            <TabContent activeTab={activeTab} />
        </div>
    );
}

export default MyMarket;