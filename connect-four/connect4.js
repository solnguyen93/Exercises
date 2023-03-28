/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    //loop through and make a 2d array filled with null
    //loop for each row
    for (let i = 0; i < HEIGHT; i++) {
        board[i] = [];
        //loop to make this many column per row
        for (let j = 0; j < WIDTH; j++) {
            board[i][j] = null;
        }
    }
    return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.querySelector('#board');
    // TODO: add comment for this code
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', handleClick);
    //Make the top row(clickable) for the board
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    // TODO: add comment for this code
    for (let y = 0; y < HEIGHT; y++) {
        //this loop will create the left to right
        //each loop add 1 (y-axis) to the board (make it higher), create <tr>
        const row = document.createElement('tr');
        //this loop will create the top to bottom
        // while inside the <tr> loop through and add <td>
        for (var x = 0; x < WIDTH; x++) {
            //create and add <td> with x,y coordinate
            const cell = document.createElement('td');
            cell.classList.add('slot');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}
/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (!board[y][x]) {
            return y;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    // TODO: make a div and insert into correct table cell
    //make the piece, add class 'piece' and 'player1' or 'player2'
    const piece = document.createElement('div');
    piece.classList.add('piece', `player${currPlayer}`);
    //get slot - select the td with the specify id & xy coord
    const slot = document.getElementById(`${y}-${x}`);
    slot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
    // TODO: pop up alert message
    alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(e) {
    // get x from ID of clicked cell
    const x = +e.target.id;
    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    const numberOfPieces = document.getElementsByClassName('piece').length;
    if (numberOfPieces === WIDTH * HEIGHT) {
        return endGame('DRAW');
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer === 1 ? currPlayer++ : currPlayer--;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(([y, x]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
    }

    // TODO: read and understand this code. Add comments to help you.

    //checking each slot for connected 4
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const horiz = [
                //check x 0,1,2,3 > 1,2,3,4 > 2,3,4,5 ... ,y
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3],
            ];
            const vert = [
                //check x,y 0,1,2,3 > 1,2,3,4 > 2,3,4,5 ...
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x],
            ];
            const diagDR = [
                //combine horiz & vert, check for '/'(0,0),(1,1),(2,2),(3,3)
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3],
            ];
            const diagDL = [
                //check for '\' (3,0),(2,1),(1,2),(0,3)
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3],
            ];

            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();
