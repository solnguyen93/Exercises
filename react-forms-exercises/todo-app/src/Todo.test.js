import React from 'react';
import { render } from '@testing-library/react';
import Todo from './Todo';

it('renders', function () {
    render(<Todo />);
});

it('matches snapshot', function () {
    const { asFragment } = render(<Todo />);
    expect(asFragment()).toMatchSnapshot();
});
