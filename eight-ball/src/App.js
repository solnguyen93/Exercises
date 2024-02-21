import React from 'react';
import './styles/App.css';
import EightBall from './EightBall';
import answers from './data/answers.js';

function App() {
    return (
        <div className="App">
            <EightBall list={answers} />
        </div>
    );
}
export default App;
