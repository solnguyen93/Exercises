import { MarkovMachine } from './markov.js';

describe('MarkovMachine', () => {
    describe('makeText', () => {
        let machines;

        beforeEach(() => {
            machines = [
                new MarkovMachine('the cat in the hat'),
                new MarkovMachine('test with jest on markov'),
                new MarkovMachine('node.js run server-side JavaScript'),
                new MarkovMachine('1 14 05 1954 -5 -88'),
                new MarkovMachine('one'),
            ];
        });

        test('generates some text', () => {
            machines.forEach((mm, index) => {
                const generatedText = mm.makeText();
                expect(generatedText).toBeTruthy();
                expect(generatedText).toBeDefined();
                expect(generatedText.length).toBeGreaterThan(0);
                expect(typeof generatedText).toBe('string');
            });
        });

        test('generates some text for the fifth MarkovMachine', () => {
            const fifthMachine = machines[4];
            const generatedText = fifthMachine.makeText();
            expect(generatedText).toBe('one');
        });
    });
});
