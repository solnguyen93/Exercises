document.addEventListener('DOMContentLoaded', function () {
    document.body.style.backgroundColor = 'green';

    const cardsContainer = document.getElementById('cardsContainer');
    const drawButton = document.getElementById('drawButton');
    let currentDeckId = null;
    let zIndexCounter = 1;

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    async function drawNewCard(deckId) {
        try {
            const draw = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            if (draw.data.remaining === 0) drawButton.remove();
            if (draw.data.remaining === 51) drawButton.innerText = 'DRAW CARD';
            const card = draw.data.cards[0];
            const img = document.createElement('img');
            img.src = card.images.png;
            img.style.zIndex = zIndexCounter++;
            img.style.position = 'absolute';
            const centerX = window.innerWidth / 2 - 50;
            const centerY = window.innerHeight / 2 - 50;
            const offsetX = Math.floor(Math.random() * 20) + 1;
            const offsetY = Math.floor(Math.random() * 20) + 1;
            const positionLeft = centerX + offsetX;
            const positionTop = centerY + offsetY;
            img.style.left = `${positionLeft}px`;
            img.style.top = `${positionTop}px`;
            const rotation = Math.floor(Math.random() * (45 - -45 + 1)) + -45;
            img.style.transform = `rotate(${rotation}deg)`;
            cardsContainer.append(img);
            return card;
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    }

    drawButton.addEventListener('click', async () => {
        try {
            if (!currentDeckId) {
                const deck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                console.log('New Deck!');
                currentDeckId = deck.data.deck_id;
                const firstCard = await drawNewCard(currentDeckId);
                console.log(`First card drawn! ${capitalizeFirstLetter(firstCard.value)} of ${firstCard.suit.toLowerCase()}`);
            } else {
                const nextCard = await drawNewCard(currentDeckId);
                console.log(`Next card drawn. ${capitalizeFirstLetter(nextCard.value)} of ${nextCard.suit.toLowerCase()}`);
            }
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    });
});
