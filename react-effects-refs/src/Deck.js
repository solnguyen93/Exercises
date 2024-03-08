import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

function Deck() {
    const [deckId, setDeckId] = useState(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [timerStarted, setTimerStarted] = useState(false);

    // Load the deck when the component mounts
    useEffect(() => {
        async function loadDeck() {
            const res = await axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/`);
            setDeckId(res.data.deck_id);
        }
        loadDeck();
    }, []);

    // Start or stop the auto draw timer based on timerStarted state
    useEffect(() => {
        if (timerStarted) {
            const intervalId = setInterval(() => {
                drawCard();
            }, 500);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [timerStarted]);

    // Function to draw a card from the deck
    async function drawCard() {
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            if (res.data.remaining === 0) {
                throw new Error('No cards remaining!');
            }
            // Add the drawn card to the list of drawn cards
            setDrawnCards((drawnCards) => [...drawnCards, res.data.cards[0]]);
            // setDrawnCards([...drawnCards, res.data.cards[0]]);   *DOES NOT WORK*
        } catch (e) {
            setTimerStarted(false);
            alert(e.message);
        }
    }

    return (
        <div>
            <button onClick={drawCard}>Draw a card</button>
            <button onClick={() => setTimerStarted(!timerStarted)}>{timerStarted ? 'Stop Auto Draw' : 'Start Auto Draw'}</button>
            <div>
                {drawnCards.map((card) => (
                    <Card key={card.code} card={card} />
                ))}
            </div>
        </div>
    );
}

export default Deck;
