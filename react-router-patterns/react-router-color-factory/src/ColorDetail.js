import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';

const ColorDetail = ({ getColorValue }) => {
    const { color } = useParams();

    const colorValue = getColorValue(color);
    // If the color value does not exist, redirect to the colors index page
    if (!colorValue) {
        return <Navigate to="/colors" />;
    }

    return (
        <div className="ColorDetail" style={{ backgroundColor: colorValue }}>
            <h1>{color}</h1>
            <Link to="/colors" className="backLink">
                Go back to colors
            </Link>
        </div>
    );
};

export default ColorDetail;
