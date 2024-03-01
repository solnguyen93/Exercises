import React from 'react';
import { render } from '@testing-library/react';
import Box from './Box';

it('renders', function () {
    render(<Box />);
});

it('matches snapshot', function () {
    const { asFragment } = render(<Box />);
    expect(asFragment()).toMatchSnapshot();
});
