import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';

const DogDetails = ({ defaultProps }) => {
    // Extract the name parameter from the URL
    const { name } = useParams();

    // Find the dog object with the matching name (case-insensitive)
    const dog = defaultProps.find((dog) => dog.name.toLowerCase() === name);

    // If the dog is not found, navigate to the "/dogs" page
    if (!dog) {
        return <Navigate to="/not-found" />;
    }

    // Destructure dog object to get specific properties
    const { name: dogName, src, ...details } = dog;

    return (
        <div>
            <img src={src} alt={`${dogName} Image`} style={{ width: '200px' }} />
            <h2>{dogName}</h2>
            <ul>
                {Object.entries(details).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}: </strong>
                        {value}
                    </li>
                ))}
            </ul>
            <Link to="/dogs">Back to Dog List</Link>
        </div>
    );
};

export default DogDetails;
