/** Textual markov chain generator */

export class MarkovMachine {
    /** build markov machine; read in text.*/

    constructor(text) {
        let words = text.split(/[ \r\n]+/);
        this.words = words.filter((c) => c !== '');
        this.makeChains();
    }

    /** set markov chains:
     *
     *  for text of "the cat in the hat", chains will be
     *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

    makeChains() {
        this.chains = {};

        // Iterate through the words in the input text up to the second-to-last word
        for (let i = 0; i < this.words.length - 1; i++) {
            const word = this.words[i];
            const nextWord = this.words[i + 1];

            // If the current word is not yet a key in the chains object, add it
            if (!this.chains[word]) {
                this.chains[word] = [];
            }

            // Add the next word to the list of possible next words for the current word
            this.chains[word].push(nextWord);
        }

        // Handle the last word in the input text
        // Add the last word as a key if it's not already present. If the word is already a key, append null to its associated value.
        const lastWord = this.words[this.words.length - 1];
        if (!this.chains[lastWord]) {
            this.chains[lastWord] = [null];
        } else {
            this.chains[lastWord].push(null);
        }
    }

    /** return random text from chains */
    makeText(numWords = 100) {
        // Initialize an array to store the generated words
        const sentence = [];

        // Start with a random key from the chains as the current word
        let currentWord = this.getRandomKey();

        // Continue generating words until reaching the desired number or encountering null
        while (sentence.length < numWords && currentWord !== null) {
            // Add the current word (key) to the list of generated words
            sentence.push(currentWord);

            // Get the next random word (value) based on the current word (key)
            currentWord = this.getRandomNextWord(currentWord);
        }

        // Join the generated words into a space-separated string
        return sentence.join(' ');
    }

    // Helper function to get a random key from the chains
    getRandomKey() {
        const keys = Object.keys(this.chains);
        const randomIndex = Math.floor(Math.random() * keys.length);
        return keys[randomIndex];
    }

    // Helper function to get a random next word (value) based on the current word (key)
    getRandomNextWord(word) {
        const possibleNextWords = this.chains[word];
        const randomIndex = Math.floor(Math.random() * possibleNextWords.length);
        return possibleNextWords[randomIndex];
    }
}
