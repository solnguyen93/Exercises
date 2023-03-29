//START SCREEN & GAME OVER
const startScreen = document.querySelector('#startScreen');
const startGame = document.querySelector('#startGame');
const gameOver = document.querySelector('#gameOver');
const sliderSelect = document.querySelector('div output');
const resetBtn = document.querySelector('div button');
const gameContainer = document.getElementById('game');
let gameScore = document.querySelector('h3 span');
let gameBest = document.querySelector('#startGame h4 span');
const COLORS = [];

startScreen.addEventListener('click', function (e) {
    if (e.target.tagName === 'H4' && sliderSelect.value !== '#') {
        startScreen.style.display = 'none';
        startGame.style.display = 'block';

        for (let i = 0; i < sliderSelect.value / 2; i++) {
            randomRgb();
            COLORS.push(randomColor);
            COLORS.push(randomColor);
        }
    }
    function randomRgb() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return (randomColor = `rgb(${r},${g},${b})`);
    }

    // const COLORS = [
    //   'red',
    //   'blue',
    //   'green',
    //   'orange',
    //   'purple',
    //   'red',
    //   'blue',
    //   'green',
    //   'orange',
    //   'purple',
    // ];

    // here is a helper function to shuffle an array
    // it returns the same array with values shuffled
    // it is based on an algorithm called Fisher Yates if you want ot research more
    function shuffle(array) {
        let counter = array.length;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    let shuffledColors = shuffle(COLORS);
    // this function loops over the array of colors
    // it creates a new div and gives it a class with the value of the color
    // it also adds an event listener for a click for each card
    function createDivsForColors(colorArray) {
        for (let color of colorArray) {
            // create a new div
            const newDiv = document.createElement('div');
            // give it a class attribute for the value we are looping over
            newDiv.classList.add(color);
            // call a function handleCardClick when a div is clicked on
            newDiv.addEventListener('click', handleCardClick);
            // append the div to the element with an id of game
            gameContainer.append(newDiv);
        }
    }

    if (localStorage.getItem('sliderSelectValue') == sliderSelect.value || localStorage.getItem('sliderSelectValue') == null) {
        gameBest.textContent = localStorage.getItem('best');
    } else if (localStorage.getItem('sliderSelectValue') != sliderSelect.value && localStorage.getItem('sliderSelectValue') != null) {
        localStorage.clear();
        gameBest.textContent = '';
    }

    createDivsForColors(shuffledColors);
});
gameOver.addEventListener('click', function () {
    gameOver.style.display = 'none';
    startGame.style.display = 'block';
});

let endOfMove = false;
let firstCard, secondCard;
let score = 0;
let matchedCount = 0;
// TODO: Implement this function!
resetBtn.addEventListener('click', function (e) {
    if (e.target.tagName == 'BUTTON') {
        localStorage.removeItem('best');
        gameBest.textContent = localStorage.getItem('best');
    }
});

function handleCardClick(event) {
    // you can use event.target to see which element was clicked
    if (endOfMove) {
        return;
    }

    if (!firstCard && !event.target.style.backgroundColor) {
        firstCard = event.target;
        score++;
    } else if (!secondCard && !event.target.style.backgroundColor) {
        secondCard = event.target;
        score++;
        endOfMove = true;
    }

    gameScore.textContent = score;

    event.target.style.backgroundColor = event.target.getAttribute('class');

    if (secondCard) {
        if (firstCard.style.backgroundColor !== secondCard.style.backgroundColor) {
            console.log('NO MATCH!');

            setTimeout(() => {
                firstCard.style.backgroundColor = null;
                secondCard.style.backgroundColor = null;
                firstCard = null;
                secondCard = null;
                endOfMove = false;
            }, 1000);
        }
        if (firstCard.style.backgroundColor === secondCard.style.backgroundColor) {
            matchedCount++;
            if (matchedCount < sliderSelect.value / 2) {
                console.log('YAY MATCHED!');
            } else {
                setTimeout(() => {
                    localStorage.setItem('sliderSelectValue', sliderSelect.value);
                    if (score < parseInt(localStorage.getItem('best')) || localStorage.getItem('best') == null) {
                        localStorage.setItem('best', score);
                        gameBest.textContent = score;
                    }
                    gameScore.textContent = 0;
                    matchedCount = 0;
                    score = 0;
                    for (let i = 0; i < COLORS.length; i++) {
                        gameContainer.querySelectorAll('div')[i].style.backgroundColor = null;
                    }
                    gameOver.style.display = 'block';
                    startGame.style.display = 'none';
                }, 1000);
            }
            setTimeout(() => {
                firstCard = null;
                secondCard = null;
                endOfMove = false;
            }, 500);
        }
    }
}
