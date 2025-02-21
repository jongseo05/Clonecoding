import './Dibs_button.css';
import Heart_icon from './Heart_icon.png'
import React from 'react';

function Dibs_button() {
  return (
      <button className="Dibs_button">
          <img src={Heart_icon} alt="Dibs_icon" className="Dibs_icon"/>
          <span className="Dibs_text">찜</span>
          <span className="Dibs_text">36</span>
      </button>
  );
}

export default Dibs_button;
