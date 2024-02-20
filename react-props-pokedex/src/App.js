import React from 'react';
// import './App.css';
import Pokedex from './Pokedex';
import eightPokemons from './data/eightPokemons';

function App() {
    return (
        <div>
            <Pokedex pokemons={eightPokemons} />
        </div>
    );
}
export default App;
