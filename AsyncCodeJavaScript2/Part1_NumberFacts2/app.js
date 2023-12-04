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
    const type = 'trivia';
    //
    // 1.
    //
    async function fetchNumberFact(num) {
        const Url = `${baseUrl}${num}/${type}?json`;
        try {
            const response = await axios.get(Url);
            return response.data;
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    }

    (async () => {
        try {
            const favNumFact = await fetchNumberFact(4);
            console.log('Fact about my favorite number:', favNumFact.text);
        } catch (error) {
            console.error('Error:', error);
        }
    })();
    //
    // 2.
    //
    (async () => {
        try {
            const batchNumber = getRandomNumbers(4, 1, 100);
            const facts = await fetchNumberFact(batchNumber);
            console.log('Random Number Facts:');
            for (const number in facts) {
                const numberFact = facts[number];
                const paragraph = document.createElement('p');
                paragraph.textContent = `${numberFact}`;
                document.body.appendChild(paragraph);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })();
    //
    // 3.
    //
    (async () => {
        try {
            const numberOfFacts = 4;
            const promises = Array.from({ length: numberOfFacts }, () => fetchNumberFact(4));

            const facts = await Promise.all(promises);

            facts.forEach((fact, index) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = `Fact ${index + 1}: ${fact.text}`;
                document.body.appendChild(paragraph);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    })();
});
