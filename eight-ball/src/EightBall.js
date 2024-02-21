import React, { useState } from 'react';
import './styles/EightBall.css';

const EightBall = ({ list }) => {
    const genRandom = () => Math.floor(Math.random() * list.length);
    const defaultColor = 'black';
    const defaultMessage = 'Think of a Question';
    const [color, setColor] = useState(defaultColor);
    const [message, setMessage] = useState(defaultMessage);
    const [count, setCount] = useState(0);

    const handleClick = () => {
        const randomIndex = genRandom();
        const selectedAnswer = list[randomIndex];
        setColor(selectedAnswer.color);
        setMessage(selectedAnswer.msg);
        setCount(count + 1);
    };

    const reset = () => {
        setColor(defaultColor);
        setMessage(defaultMessage);
        setCount(0);
    };

    return (
        <>
            <div className="EightBall" onClick={handleClick} style={{ backgroundColor: color }}>
                <p className="EightBall-msg">{message}</p>
            </div>
            <p className="EightBall-count">Count: {count}</p>
            <button onClick={reset} className="EightBall-resetBtn">
                RESET
            </button>
        </>
    );
};

export default EightBall;
