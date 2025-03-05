import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Sign_up from "./Pages/Sign_up/Sign_up/Sign_up";
import Number from "./Pages/Sign_up/Number/Number";
import Sell_page from "./Pages/Sell_page/Sell_page";
import Lightning_talk from "./Pages/Lightning_talk/Lightning_talk";
import Item_page from "./Pages/Item_page/Item_page";
import Search_page from "./Pages/Search_page/Search_page";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/sign_up/number" element={<Number />} />
            <Route path="/sell_page" element={<Sell_page />} />
            <Route path="/lightning_talk" element={<Lightning_talk />} />
            <Route path="/item/*" element={<Item_page />} />
            <Route path="/search_page" element={<Search_page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;