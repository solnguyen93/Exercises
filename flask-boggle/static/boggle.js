class BoggleGame {
    constructor() {
        // Initialize game elements and properties
        this.form = document.getElementById('add-word');
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.score = 0;
        this.remainingTime = 60;
        this.timerElement = document.getElementById('timer');
        this.startTimer();
        this.validWords = [];
        this.validWordsElement = document.getElementById('valid-words');
        this.fetchInitialStatistics();
    }

    async handleSubmit(e) {
        // Handle the form submission when a word is submitted
        e.preventDefault();
        // Get the submitted word
        const wordInput = this.form.querySelector('input[name="word"]');
        const word = wordInput.value;
        const alphabeticRegex = /^[A-Za-z]+$/;

        if (this.validWords.includes(word)) {
            // check for duplicate
            this.showMessage('Word already submitted.');
        } else if (word === '') {
            // check for empty
            this.showMessage('Please enter a word');
            return false;
        } else if (!alphabeticRegex.test(word)) {
            // check for non alphabetic char (123@!')
            this.showMessage('Alphabetic characters only.');
            return false;
        } else {
            try {
                // Send a request to check the validity of the word
                const response = await axios.get('/check-word', { params: { word: word } });
                if (response.data.result === 'not-on-board') {
                    this.showMessage('Word not found on the board.');
                } else if (response.data.result === 'not-a-word') {
                    this.showMessage('Invalid word.');
                } else if (response.data.result === 'ok') {
                    this.showMessage('Valid word on the board!');
                    this.score += word.length;
                    this.updateScoreDisplay();
                    this.validWords.push(word);
                    this.updateValidWordsDisplay();
                } else {
                    this.showMessage('Unexpected response from the server.');
                }
            } catch (error) {
                console.error(error);
            }
        }

        wordInput.value = '';
    }

    showMessage(message) {
        // Show a message based on the submitted word DURING the game
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        setTimeout(() => {
            messageElement.textContent = '';
        }, 2000);
    }

    updateScoreDisplay() {
        // Update the score display DURING the game
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${this.score}`;
    }

    startTimer() {
        // Start the timer at the BEGINNING of the game
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
            this.remainingTime--;
        }, 1000);
    }

    updateTimerDisplay() {
        // Update the timer display DURING the game
        if (this.remainingTime >= 1) {
            this.timerElement.textContent = `Time Left: ${this.remainingTime}`;
        } else {
            this.timerElement.textContent = "Time's up!";
            this.form.querySelector('input[type="submit"]').disabled = true;
            clearInterval(this.timerInterval);
            this.sendScore();
        }
    }

    updateValidWordsDisplay() {
        // Update the display of all valid submitted words DURING the game
        const validWordsList = this.validWords.join(', ');
        this.validWordsElement.textContent = `${validWordsList}`;
    }

    async sendScore() {
        // Update and display statistics at the END of the game
        // Regular async func called EXPLICITLY in updateTimerDisplay
        try {
            const response = await axios.post('/update-score', { score: this.score });
            if (response.status === 200) {
                const { highestScore, totalPlays } = response.data;
                this.updateStatisticsDisplay(highestScore, totalPlays);
            }
        } catch (error) {
            console.error(error);
        }
    }

    updateStatisticsDisplay(highestScore, totalPlays) {
        // Callback function used inside sendScore() to update the statistics display
        const highestScoreElement = document.getElementById('highest-score');
        const totalPlaysElement = document.getElementById('total-plays');
        highestScoreElement.textContent = `Highest Score: ${highestScore}`;
        totalPlaysElement.textContent = `Total Plays: ${totalPlays}`;
    }
}

const game = new BoggleGame();
