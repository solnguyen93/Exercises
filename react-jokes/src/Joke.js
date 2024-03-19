import React, { Component } from 'react';
import './Joke.css';

class Joke extends Component {
    state = {
        upvotes: 0,
        downvotes: 0,
    };

    // Function to handle upvoting
    handleUpvote = () => {
        this.setState((prevState) => ({
            upvotes: prevState.upvotes + 1,
        }));
    };

    // Function to handle downvoting
    handleDownvote = () => {
        this.setState((prevState) => ({
            downvotes: prevState.downvotes + 1,
        }));
    };

    // Function to calculate the score based on upvotes and downvotes
    calculateScore = () => {
        return this.state.upvotes - this.state.downvotes;
    };

    render() {
        const { text, index } = this.props;
        const score = this.calculateScore();

        return (
            <div className="joke-container">
                <p className="joke-title">Joke {index}</p>
                <div className="joke-content">
                    <div className="joke-text">{text}</div>
                    <div className="joke-vote">
                        <button className="vote-button" onClick={this.handleUpvote}>
                            <i className="fas fa-thumbs-up"></i>
                        </button>
                        <button className="vote-button" onClick={this.handleDownvote}>
                            <i className="fas fa-thumbs-down"></i>
                        </button>
                        <span className="score">Score: {score}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Joke;
