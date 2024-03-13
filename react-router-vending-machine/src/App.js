import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendingMachine from './VendingMachine.js';
import Water from './Water';
import Coffee from './Coffee';
import Tea from './Tea';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/" element={<VendingMachine />} />
                    <Route path="/water" element={<Water />} />
                    <Route path="/coffee" element={<Coffee />} />
                    <Route path="/tea" element={<Tea />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
