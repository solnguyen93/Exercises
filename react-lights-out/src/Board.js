import React, { useState } from 'react';
import Cell from './Cell.js';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
    const [board, setBoard] = useState(createBoard());

    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
    function createBoard() {
        let initialBoard = [];
        let numLitCells = 0;

        for (let y = 0; y < nrows; y++) {
            let row = [];
            for (let x = 0; x < ncols; x++) {
                const isLit = Math.random() < chanceLightStartsOn;
                if (isLit) numLitCells++;
                row.push({ isLit });
            }
            initialBoard.push(row);
        }
        // // If all cells are initially unlit, turn first cell on
        // if (numLitCells === 0) {
        //     initialBoard[0][0].isLit = true;
        //     numLitCells++;
        // }
        // // Check if the number of lit cells is odd
        // if (numLitCells % 2 !== 0) {
        //     // Get the status of the last cell in the last row
        //     const lastCellLit = initialBoard[nrows - 1][ncols - 1].isLit;
        //     // If the last cell is currently lit, turn it off (make it false)
        //     if (lastCellLit) {
        //         initialBoard[nrows - 1][ncols - 1].isLit = false;
        //     }
        //     // If the last cell is currently not lit, turn it on (make it true)
        //     else {
        //         initialBoard[nrows - 1][ncols - 1].isLit = true;
        //     }
        // }
        return initialBoard;
    }

    function hasWon() {
        // TODO: check the board in state to determine whether the player has won.
        for (let y = 0; y < nrows; y++) {
            for (let x = 0; x < ncols; x++) {
                if (board[y][x].isLit) {
                    // If any cell isLit, the player hasn't won yet
                    return false;
                }
            }
        }
        // If all cells isLit=false, the player has won
        return true;
    }

    function flipCellsAround(coord) {
        setBoard((oldBoard) => {
            const [y, x] = coord.split('-').map(Number);

            const flipCell = (y, x, boardCopy) => {
                // if this coord is actually on board, flip it
                if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                    boardCopy[y][x].isLit = !boardCopy[y][x].isLit;
                }
            };

            // TODO: Make a (deep) copy of the oldBoard
            const newBoard = oldBoard.map((row) => [...row]);
            // TODO: in the copy, flip this cell and the cells around it
            flipCell(y, x, newBoard);
            flipCell(y + 1, x, newBoard); // Flip below
            flipCell(y - 1, x, newBoard); // Flip above
            flipCell(y, x + 1, newBoard); // Flip right
            flipCell(y, x - 1, newBoard); // Flip left
            // TODO: return the copy
            return newBoard;
        });
    }

    // if the game is won, just show a winning msg & render nothing else

    // TODO
    if (hasWon()) {
        return <div>You Won!</div>;
    }

    // make table board

    // TODO
    const tableRows = [];
    for (let y = 0; y < nrows; y++) {
        const tableCells = [];
        for (let x = 0; x < ncols; x++) {
            const coord = `${y}-${x}`;
            tableCells.push(<Cell key={coord} flipCellsAroundMe={() => flipCellsAround(coord)} isLit={board[y][x].isLit} />);
        }
        tableRows.push(<tr key={`row-${y}`}>{tableCells}</tr>);
    }

    return (
        <table>
            <tbody>{tableRows}</tbody>
        </table>
    );
}

export default Board;
