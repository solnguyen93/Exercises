import React, { useState } from 'react';
import Todo from './Todo.js';
import NewTodoForm from './NewTodoForm';
import { v4 as uuid } from 'uuid';

function TodoList() {
    const INITIAL_STATE = [];

    const [Todos, setTodos] = useState(INITIAL_STATE);

    const addTodo = (newTodo) => {
        setTodos((Todos) => [...Todos, { ...newTodo, id: uuid() }]);
    };

    const handleDelete = (todoId) => {
        setTodos((Todos) => Todos.filter((todo) => todo.id !== todoId));
    };
    return (
        <div className="TodoList">
            <h3>Todo List</h3>
            <NewTodoForm addTodo={addTodo} />
            <div className="TodoList-Todos">
                {Todos.map(({ id, task }) => (
                    <Todo key={id} task={task} onDelete={() => handleDelete(id)} />
                ))}
            </div>
        </div>
    );
}

export default TodoList;
