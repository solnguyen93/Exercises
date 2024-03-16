import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ColorList from './ColorList';
import ColorDetail from './ColorDetail';
import ColorForm from './ColorForm';
import './App.css';

const INITIAL_STATE = [
    { name: 'red', value: '#FF0000' },
    { name: 'green', value: '#00FF00' },
    { name: 'blue', value: '#0000FF' },
    { name: 'black', value: 'black' },
    { name: 'white', value: 'white' },
];

const App = () => {
    // State for managing colors
    const [colors, setColors] = useState(INITIAL_STATE);

    // Function to add a new color
    const addColor = (newColor) => {
        setColors((prevColors) => [newColor, ...prevColors]);
    };

    // Function to get color value based on color name
    const getColorValue = (colorName) => {
        const color = colors.find((c) => c.name === colorName);
        return color ? color.value : '';
    };

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/colors" element={<ColorList colors={colors} />} />

                    <Route path="/colors/:color" element={<ColorDetail getColorValue={getColorValue} />} />

                    <Route path="/colors/new" element={<ColorForm addColor={addColor} />} />

                    <Route path="*" element={<Navigate to="/colors" />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
