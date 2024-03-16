import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

const Nav = ({ dogs }) => {
    return (
        <nav className="Nav">
            <ul className="NavList">
                <li className="NavItem">
                    <Link to="/dogs">Home</Link>
                </li>
                {dogs.map((dog) => (
                    <li className="NavItem" key={dog.name}>
                        <Link to={`/dogs/${dog.name.toLowerCase()}`}>{dog.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Nav;
