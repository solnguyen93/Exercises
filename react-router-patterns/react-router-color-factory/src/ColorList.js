import React from 'react';
import { Link } from 'react-router-dom';

const ColorList = ({ colors }) => {
    return (
        <div>
            <h1>Welcome to the color factory</h1>
            <Link className="App-newColorLink" to="/colors/new">
                Add a color
            </Link>
            <h3>Select a color:</h3>
            <ul>
                {colors.map((c) => (
                    <li key={c.name}>
                        <Link to={`/colors/${c.name}`}>
                            <span>{c.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ColorList;
