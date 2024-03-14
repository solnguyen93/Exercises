import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import defaultProps from './defaultProps';
import DogList from './DogList';
import DogDetails from './DogDetails';
import Nav from './Nav';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Nav dogs={defaultProps.dogs} />
                <Routes>
                    <Route path="/dogs" element={<DogList defaultProps={defaultProps.dogs} />} />
                    <Route path="/dogs/:name" element={<DogDetails defaultProps={defaultProps.dogs} />} />
                    <Route path="*" element={<Navigate to="/dogs" />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
