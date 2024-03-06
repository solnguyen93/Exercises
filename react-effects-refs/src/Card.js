import React, { useState, useEffect } from 'react';
import './Card.css';

function Card({ card }) {
    const [transform, setTransform] = useState({});

    useEffect(() => {
        const randomRotation = Math.floor(Math.random() * 81) - 40;
        const randomPositionX = Math.floor(Math.random() * 61) - 30;
        const randomPositionY = Math.floor(Math.random() * 61) - 30;

        setTransform({ rotation: randomRotation, positionX: randomPositionX, positionY: randomPositionY });
    }, [card]);

    return (
        <div className="Card">
            <div className="Card-container">
                {card ? (
                    <img
                        src={card.image}
                        alt={`${card.value} of ${card.suit}`}
                        style={{
                            transform: `translate(${transform.positionX}px, ${transform.positionY}px) rotate(${transform.rotation}deg)`,
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default Card;
