import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BoxList from './BoxList';

it('renders', function () {
    render(<BoxList />);
});

it('matches snapshot', function () {
    const { asFragment } = render(<BoxList />);
    expect(asFragment()).toMatchSnapshot();
});

it('should add new box', function () {
    const { queryByText, getByLabelText, container } = render(<BoxList />);
    const width = getByLabelText('Width');
    const height = getByLabelText('Height');
    const backgroundColor = getByLabelText('Background Color');
    const addBtn = queryByText('Add Box');

    expect(queryByText('X')).not.toBeInTheDocument();

    fireEvent.change(width, { target: { value: '1' } });
    fireEvent.change(height, { target: { value: '2' } });
    fireEvent.change(backgroundColor, { target: { value: 'blue' } });
    fireEvent.click(addBtn);

    const boxContent = container.querySelector('.Box-content');
    expect(boxContent).toHaveStyle({
        width: '1em',
        height: '2em',
        backgroundColor: 'blue',
    });
});

it('should delete box', () => {
    const { queryByText, getByLabelText, container } = render(<BoxList />);
    const width = getByLabelText('Width');
    const height = getByLabelText('Height');
    const backgroundColor = getByLabelText('Background Color');
    const addBtn = queryByText('Add Box');

    expect(queryByText('X')).not.toBeInTheDocument();

    fireEvent.change(width, { target: { value: '1' } });
    fireEvent.change(height, { target: { value: '2' } });
    fireEvent.change(backgroundColor, { target: { value: 'blue' } });

    fireEvent.click(addBtn);

    const boxContent = container.querySelector('.Box-content');
    expect(boxContent).toHaveStyle({
        width: '1em',
        height: '2em',
        backgroundColor: 'blue',
    });

    const deleteBtn = queryByText('X');
    fireEvent.click(deleteBtn);
    expect(queryByText('X')).not.toBeInTheDocument();
});
