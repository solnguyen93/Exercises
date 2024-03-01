import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';

it('renders', function () {
    render(<TodoList />);
});

it('matches snapshot', function () {
    const { asFragment } = render(<TodoList />);
    expect(asFragment()).toMatchSnapshot();
});

it('should add new todo', function () {
    const { queryByText, getByLabelText } = render(<TodoList />);
    const input = getByLabelText('Task');
    const addBtn = queryByText('Add Task');

    expect(queryByText('X')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'eat, sleep, study' } });
    fireEvent.click(addBtn);

    expect(queryByText('eat, sleep, study')).toBeInTheDocument();
});

it('should delete todo', function () {
    const { queryByText, getByLabelText } = render(<TodoList />);
    const input = getByLabelText('Task');
    const addBtn = queryByText('Add Task');

    expect(queryByText('X')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'eat, sleep, study' } });
    fireEvent.click(addBtn);

    expect(queryByText('eat, sleep, study')).toBeInTheDocument();

    const deleteBtn = queryByText('X');
    fireEvent.click(deleteBtn);
    expect(queryByText('X')).not.toBeInTheDocument();
    expect(queryByText('eat, sleep, study')).not.toBeInTheDocument();
});
