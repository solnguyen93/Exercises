import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

const NewTodoForm = ({ addTodo }) => {
    const INITIAL_STATE = {
        id: uuid(),
        task: '',
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
        addTodo({ ...formData });
        setFormData(INITIAL_STATE);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="task">Task</label>
            <input id="task" type="text" placeholder="task" name="task" value={formData.task} onChange={handleChange} />
            <button>Add Task</button>
        </form>
    );
};
export default NewTodoForm;
