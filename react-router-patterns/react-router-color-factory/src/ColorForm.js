import React, { useState } from 'react';

const ColorForm = ({ addColor }) => {
    // Initial state for form data
    const INITIAL_STATE = {
        name: '',
        value: '#000000',
    };

    // State to manage form data
    const [formData, setFormData] = useState(INITIAL_STATE);

    // Function to handle changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((data) => ({
            ...data,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        addColor(formData); // Adding new color
        setFormData(INITIAL_STATE); // Resetting form data
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Color Name: </label>
            <input id="name" type="text" placeholder="Black" name="name" value={formData.name} onChange={handleChange} />

            <label htmlFor="value">Color Value: </label>
            <input id="value" type="color" placeholder="#000000" name="value" value={formData.value} onChange={handleChange} />

            <button>Add Color</button>
        </form>
    );
};

export default ColorForm;
