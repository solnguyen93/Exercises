import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('renders', function () {
    render(<App />);
});

it('matches snapshot', function () {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
});
