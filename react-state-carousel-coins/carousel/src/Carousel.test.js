import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Carousel from './Carousel';

it('renders', () => {
    render(<Carousel />);
});

it('matches snapshot', () => {
    const { asFragment } = render(<Carousel />);
    expect(asFragment()).toMatchSnapshot();
});

it('works when you click on the right arrow', function () {
    const { queryByTestId, queryByAltText } = render(<Carousel />);

    // expect the first image to show, but not the second
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).not.toBeInTheDocument();

    // move forward in the carousel
    const rightArrow = queryByTestId('right-arrow');
    fireEvent.click(rightArrow);

    // expect the second image to show, but not the first
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).not.toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).toBeInTheDocument();
});

it('works when you click on the right then left arrow', function () {
    const { queryByTestId, queryByAltText, getByText } = render(<Carousel />);

    expect(getByText('Image 1 of 3.')).toBeInTheDocument();

    // expect the first image to show, but not the second
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).not.toBeInTheDocument();

    // move forward in the carousel
    const rightArrow = queryByTestId('right-arrow');
    fireEvent.click(rightArrow);

    expect(getByText('Image 2 of 3.')).toBeInTheDocument();

    // expect the second image to show, but not the first
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).not.toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).toBeInTheDocument();

    // move backward in the carousel
    const leftArrow = queryByTestId('left-arrow');
    fireEvent.click(leftArrow);

    expect(getByText('Image 1 of 3.')).toBeInTheDocument();

    // expect the first image to show, but not the second
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).not.toBeInTheDocument();
});

it('does not show left arrow on first image', function () {
    const { queryByTestId, queryByAltText, getByText } = render(<Carousel />);

    expect(getByText('Image 1 of 3.')).toBeInTheDocument();

    // expect the first image to show, but not the second
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).not.toBeInTheDocument();

    // Check if the left arrow is hidden
    const leftArrow = queryByTestId('left-arrow');
    expect(leftArrow).toHaveStyle('display: none');

    // Check if the left arrow is hidden
    const rightArrow = queryByTestId('right-arrow');
    expect(rightArrow).toHaveStyle('display: block');
});

it('does not show right arrow on last image', function () {
    const { queryByTestId, queryByAltText, getByText } = render(<Carousel />);

    expect(getByText('Image 1 of 3.')).toBeInTheDocument();

    // expect the first image to show, but not the second
    expect(queryByAltText('Photo by Richard Pasquarella on Unsplash')).toBeInTheDocument();
    expect(queryByAltText('Photo by Pratik Patel on Unsplash')).not.toBeInTheDocument();

    // move forward in the carousel
    const rightArrow = queryByTestId('right-arrow');
    fireEvent.click(rightArrow);
    fireEvent.click(rightArrow);

    expect(getByText('Image 3 of 3.')).toBeInTheDocument();

    expect(rightArrow).toHaveStyle('display: none');

    // Check if the left arrow is hidden
    const leftArrow = queryByTestId('left-arrow');
    expect(leftArrow).toHaveStyle('display: block');
});
