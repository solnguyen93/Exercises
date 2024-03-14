import React from 'react';
import { Link } from 'react-router-dom';

const DogList = ({ defaultProps }) => {
    return (
        <div>
            <h1>List of dogs:</h1>
            <ul>
                {defaultProps.map((dog) => (
                    <li key={dog.name}>
                        <Link to={`/dogs/${dog.name.toLowerCase()}`}>{dog.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DogList;
