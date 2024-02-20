import React from 'react';
import './styles/Pokecard.css';

const Pokecard = ({ id, name, type, base_experience }) => {
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
        <div className="Pokecard">
            <h4 className="Pokecard-name">{name}</h4>
            <img src={imageUrl} alt="" />
            <p className="Pokecard-type">Type: {type}</p>
            <p className="Pokecard-exp">EXP: {base_experience}</p>
        </div>
    );
};

export default Pokecard;
