import React from 'react';
import Card from './Card.js';
import { render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';

it('renders', () => {
    render(<Card />);
});

it('matches snapshot', () => {
    const { asFragment } = render(<Card />);
    expect(asFragment()).toMatchSnapshot();
});

test('matches snapshot with custom props', () => {
    const { asFragment } = render(<Card caption="Custom Caption" src="custom.jpg" currNum={1} totalNum={3} />);
    expect(asFragment()).toMatchSnapshot();
});
