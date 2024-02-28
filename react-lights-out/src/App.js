import React from 'react';
import Board from './Board.js';
import './App.css';

/** Simple app that just shows the LightsOut game. */

function App() {
    return (
        <div className="App">
            <Board nrows={6} ncols={6} chanceLightStartsOn={0.25} />
        </div>
    );
}

export default App;
