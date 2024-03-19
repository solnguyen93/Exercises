import React, { Component } from 'react';
import Joke from './Joke';

class JokeList extends Component {
    state = {
        jokes: [], // Initialize state to hold fetched jokes
    };

    componentDidMount() {
        this.fetchRandomJokes(); // Call fetchRandomJokes() when component mounts
    }

    // Repeatedly fetches random jokes until it accumulates 10 unique jokes, which are stored in an array.
    // The array is then assigned as the new state for the 'jokes' key within the component, triggering a re-render.
    fetchRandomJokes = async () => {
        try {
            const jokes = []; // Initialize array to hold fetched jokes
            while (jokes.length < 10) {
                // Fetch 10 random jokes
                const response = await fetch('https://icanhazdadjoke.com/', {
                    headers: {
                        Accept: 'application/json', // Request JSON response
                    },
                });
                const data = await response.json(); // Extract JSON data

                if (!jokes.some((joke) => joke.id === data.id)) {
                    // Check if joke is unique
                    jokes.push({
                        // Add unique joke to jokes array
                        id: data.id,
                        text: data.joke,
                    });
                }
            }
            this.setState({ jokes }); // Update state with fetched jokes
        } catch (error) {
            console.error('Error fetching jokes:', error); // Log any errors encountered
        }
    };

    render() {
        const { jokes } = this.state; // Destructure jokes from state

        // Pass jokes data to the Joke component for rendering
        return (
            <div>
                <ul>
                    {jokes.map((joke, index) => (
                        <Joke key={joke.id} text={joke.text} index={index + 1} />
                    ))}
                </ul>
            </div>
        );
    }
}

export default JokeList;
