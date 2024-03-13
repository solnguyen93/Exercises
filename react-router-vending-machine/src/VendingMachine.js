import React from 'react';
import { Link } from 'react-router-dom';

const VendingMachine = () => {
    return (
        <div>
            <h1>Vending Machine</h1>
            <p>
                <Link to="/water">Water</Link>
            </p>
            <p>
                <Link to="/coffee">Coffee</Link>
            </p>
            <p>
                <Link to="/tea">Tea</Link>
            </p>
        </div>
    );
};

export default VendingMachine;
