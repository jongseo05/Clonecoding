import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Sign_up from "./Pages/Sign_up/Sign_up/Sign_up";
import Number from "./Pages/Sign_up/Number/Number";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/sign_up/number" element={<Number />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;