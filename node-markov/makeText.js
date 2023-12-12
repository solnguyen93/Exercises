/** Command-line tool to generate Markov text. */
import { MarkovMachine } from './markov.js';
import { readFile } from 'fs/promises';
import axios from 'axios';

// //Input text for testing
// const inputText = 'the cat in the hat';
// // Create an instance of the MarkovMachine class
// const markovMachine = new MarkovMachine(inputText);
// // Generate random text based on the Markov chain
// const generatedText = markovMachine.makeText();
// // Print the generated text
// console.log(generatedText);

const type = process.argv[2];
const source = process.argv[3];

async function scriptMakeText(type, source) {
    try {
        let data;
        if (type === 'file') {
            if (!source) {
                console.error('Please provide a file. Usage: node makeText.js file <file>');
                process.exit(1);
            } else {
                data = await readFile(source, 'utf8');
            }
        } else if (type === 'url') {
            if (!source) {
                console.error('Please provide a url. Usage: node makeText.js url <url>');
                process.exit(1);
            } else if (source.startsWith('http')) {
                const res = await axios.get(source);
                data = res.data;
            } else {
                console.error('Invalid URL format');
                process.exit(1);
            }
        } else {
            console.error('Usage: node makeText.js [file|url] <fileOrUrl>');
            process.exit(1);
        }
        const mm = new MarkovMachine(data);
        console.log(mm.makeText());
    } catch (err) {
        if (type === 'file') {
            console.error(`Error reading file: ${err.message}`);
        } else if (type === 'url') {
            console.error(`Error fetching URL: ${err.message}`);
        } else {
            console.error(`Unexpected error: ${err.message}`);
        }
        process.exit(1);
    }
}
scriptMakeText(type, source);
