import { v4 as uuid } from 'uuid';

/* Select a random element from values array. */
function choice(values) {
    const randIdx = Math.floor(Math.random() * values.length);
    return values[randIdx];
}

// Formatter function to extract only the necessary data from the response
function formatPokemon(res) {
    return {
        id: uuid(),
        front: res.sprites.front_default,
        back: res.sprites.back_default,
        name: res.name,
        stats: res.stats.map((stat) => ({
            value: stat.base_stat,
            name: stat.stat.name,
        })),
    };
}

export { choice, formatPokemon };
