import React from 'react';
import './styles/Pokedex.css';
import Pokecard from './Pokecard';

const Pokedex = ({ pokemons }) => {
    return (
        <div className="Pokedex">
            <h1 className="Pokedex-header">Pokedex</h1>
            <div className="Pokedex-pokemons">
                {pokemons.map((p) => (
                    <Pokecard key={p.id} id={p.id} name={p.name} img={p.img} type={p.type} base_experience={p.base_experience} />
                ))}
            </div>
        </div>
    );
};

export default Pokedex;
