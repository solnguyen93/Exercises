document.addEventListener('DOMContentLoaded', function () {
    function getRandomNumbers(count, min, max) {
        const randomNumbers = [];
        for (let i = 0; i < count; i++) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            randomNumbers.push(randomNumber);
        }
        return randomNumbers;
    }

    const baseUrl = 'http://numbersapi.com/';
    const favoriteNumber = 4;
    const type = 'trivia';

    const favoriteNumberUrl = `${baseUrl}${favoriteNumber}/${type}?json`;
    //
    // 1.
    //
    axios
        .get(favoriteNumberUrl)
        .then((res) => {
            console.log('Fact about my favorite number:', res.data.text);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    //
    // 2.
    //
    const batchNumber = getRandomNumbers(4, 1, 100);
    const batchNumberUrl = `${baseUrl}${batchNumber}/${type}?json`;

    axios
        .get(batchNumberUrl)
        .then((res) => {
            const facts = res.data;
            console.log('Random Number Facts:');
            for (const number in facts) {
                const numberFact = facts[number];
                const paragraph = document.createElement('p');
                paragraph.textContent = `${numberFact}`;
                document.body.appendChild(paragraph);
            }
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    //
    // 3.
    //
    function getFact(number) {
        return new Promise((resolve, reject) => {
            const numberUrl = `${baseUrl}${number}/${type}?json`;
            axios
                .get(numberUrl)
                .then((res) => {
                    const fact = res.data.text;
                    resolve(fact);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const numberOfFacts = 4;
    const promises = Array.from({ length: numberOfFacts }, () => getFact(4));

    Promise.all(promises)
        .then((facts) => {
            facts.forEach((fact, index) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = `Fact ${index + 1}: ${fact}`;
                document.body.appendChild(paragraph);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
