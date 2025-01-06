import React  from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import Top_navbar from "../../Components/Top_navbar/Top_navbar";
import Context  from "../../Components/Context/Context";


function Homepage() {
  return (
    <div>

      <Top_navbar />
        <Context />
      <div className = 'Main_Content_section'>

      </div>



    </div>
  );
}

export default Homepage;
