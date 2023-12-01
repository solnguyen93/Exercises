document.addEventListener('DOMContentLoaded', function () {
    document.body.style.backgroundColor = 'green';

    const cardsContainer = document.getElementById('cardsContainer');
    const drawButton = document.getElementById('drawButton');
    let currentDeckId = null;
    let zIndexCounter = 1;

    function drawNewCard(deckId) {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
                .then((draw) => {
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
                    resolve(card);
                })
                .catch((err) => {
                    console.error('Error:', err);
                    reject(err);
                });
        });
    }

    drawButton.addEventListener('click', () => {
        if (!currentDeckId) {
            axios
                .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
                .then((deck) => {
                    console.log('New Deck!');
                    currentDeckId = deck.data.deck_id;
                    return drawNewCard(currentDeckId);
                })
                .then((card) => {
                    console.log(`First card drawn! ${card.value} of ${card.suit}`);
                })
                .catch((err) => {
                    console.error('Error:', err);
                });
        } else {
            drawNewCard(currentDeckId)
                .then((card) => {
                    console.log(`Next card drawn. ${card.value} of ${card.suit}`);
                })
                .catch((err) => {
                    console.error('Error:', err);
                });
        }
    });
});
