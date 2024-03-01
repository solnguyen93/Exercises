import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

const NewBoxForm = ({ addBox }) => {
    const INITIAL_STATE = {
        id: uuid(),
        width: '',
        height: '',
        backgroundColor: '',
    };

    const [formData, setFormData] = useState(INITIAL_STATE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addBox({ ...formData });
        setFormData(INITIAL_STATE);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="width">Width</label>
            <input id="width" type="text" placeholder="width" name="width" value={formData.width} onChange={handleChange} />

            <label htmlFor="height">Height</label>
            <input id="height" type="text" placeholder="height" name="height" value={formData.height} onChange={handleChange} />

            <label htmlFor="backgroundColor">Background Color</label>
            <input
                id="backgroundColor"
                type="text"
                placeholder="backgroundColor"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
            />
            <button>Add Box</button>
        </form>
    );
};
export default NewBoxForm;
