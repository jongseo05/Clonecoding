import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Sign_up from "./Pages/Sign_up/Sign_up/Sign_up";
import Number from "./Pages/Sign_up/Number/Number";
import Sell_page from "./Pages/Sell_page/Sell_page";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/sign_up/number" element={<Number />} />
            <Route path="/sell_page" element={<Sell_page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;