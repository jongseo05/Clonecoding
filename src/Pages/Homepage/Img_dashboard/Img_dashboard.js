import './Img_dashboard.css';
import React, { useState } from "react";
import dashboard_ex1 from './Images/dashboard_ex1.webp';
import dashboard_ex2 from './Images/dashboard_ex2.webp';
import dashboard_ex3 from './Images/dashboard_ex3.webp';
import dashboard_ex4 from './Images/dashboard_ex4.webp';
import dashboard_ex5 from './Images/dashboard_ex5.webp';
import dashboard_ex6 from './Images/dashboard_ex6.webp';

const images = [dashboard_ex1, dashboard_ex2, dashboard_ex3, dashboard_ex4, dashboard_ex5, dashboard_ex6];

function Img_dashboard() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="Img_dashboard">
            <button className="arrow prev" onClick={handlePrev}>&lt;</button>
            <img src={images[currentIndex]} className="Img" alt="Dashboard" />
            <button className="arrow next" onClick={handleNext}>&gt;</button>
        </div>
    );
}

export default Img_dashboard;
