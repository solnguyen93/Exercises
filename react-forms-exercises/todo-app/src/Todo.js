import React from 'react';

function Todo({ task, onDelete }) {
    return (
        <div className="Todo">
            <div className="Todo-content">{task}</div>
            <button className="Todo-delete-button" onClick={onDelete}>
                X
            </button>
        </div>
    );
}

export default Todo;
