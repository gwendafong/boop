const gameboard = document.getElementById('gameboard');
    const message = document.getElementById('message');
    const newGameBtn = document.getElementById('new-game-btn');
    const turnIndicator = document.getElementById('turn-indicator');
    let currentPlayer = 'X';
    let boardState = [
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', '']
    ];
    let gameEnded = false;

    // Function to render the gameboard
    function renderGameboard() {
        gameboard.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                if (i === row && j === col) {
                    cell.style.backgroundColor = "yellow"
                }
                cell.innerText = boardState[i][j];
                cell.addEventListener('click', handleCellClick);
                  
                gameboard.appendChild(cell);
            }
        }
    }

    // Function to handle cell click event
    function handleCellClick(event) {
        if (!gameEnded) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            if (boardState[row][col] === '') {
                boardState[row][col] = currentPlayer;
                boopTokens(row, col);
                renderGameboard();

                
                if (checkWin('X')) { 
                    const winningXCells=checkWin('X'); //added this
                    highlightWinningCells(winningXCells); //added this
                    message.innerText = `Player X wins!`;
                    gameEnded = true;
                } else if (checkWin('O')) { 
                    const winningOCells=checkWin('O'); //added this
                    highlightWinningCells(winningOCells); //added this
                    message.innerText = `Player O wins!`;
                    gameEnded = true;
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateTurnIndicator();
                    if (difficulty) {
                        AI_move(difficulty) // Determines the type of AI
                    }
                }
            }
        }
    }

//new code here

//Difficulty Selection
let difficulty = AI_Terminator
function dropdown() {
    var selector = document.getElementById("difficulty");
    if(selector.value == "normal"){
        difficulty = AI_Normal
    }
    if(selector.value == "terminator"){
        difficulty = AI_Terminator
    }
    if(selector.value == "human"){
        difficulty = null
    }
}

// AI move
function AI_move(difficulty) {
    let coord = difficulty()
    if (!gameEnded) {
        let row = coord[0];
        let col = coord[1];
        if (boardState[row][col] === '') {
            boardState[row][col] = currentPlayer;
            boopTokens(row, col);
            renderGameboard(row,col);
            if (checkWin('X')) {
                message.innerText = `Player X wins!`;
                gameEnded = true;
            } else if (checkWin('O')) {
                message.innerText = `Player O wins!`;
                gameEnded = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurnIndicator();
            }
        }
    }
}


// Math random helper
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
    }


// Updating boardstate to calculate utility
function Calc_Utility(board,row = null, col = null) {
    let AI = "O"
    let player = "X"
    let utility = 0
    if (row > 1 && row < 4 && col > 1 && col < 4) { // arbitrary tie breaker preferring centre cells
        utility += 8
        // console.log("centre bonus:" + utility)
    }
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            // CheckWin and utility
            if (board[i][j] === AI) {
                // Check horizontal win
                if (j + 2 < 6 && board[i][j + 1] === AI && board[i][j + 2] === AI) {
                    utility += 9999;
                }
                // Check vertical win
                if (i + 2 < 6 && board[i + 1][j] === AI && board[i + 2][j] === AI) {
                    utility += 9999;
                }
                // Check diagonal win (top-left to bottom-right)
                if (i + 2 < 6 && j + 2 < 6 && board[i + 1][j + 1] === AI && board[i + 2][j + 2] === AI) {
                    utility += 9999;
                }
                // Check diagonal win (top-right to bottom-left)
                if (i + 2 < 6 && j - 2 >= 0 && board[i + 1][j - 1] === AI && board[i + 2][j - 2] === AI) {
                    utility += 9999;
                }
                // Check 2 horizontal 
                if (j + 1 < 6 && board[i][j + 1] === AI) {
                    utility += 999;
                }
                // Check 2 vertical 
                if (i + 1 < 6 && board[i + 1][j] === AI) {
                    utility += 999;
                }
                // Check 2 diagonal (top-left to bottom-right)
                if (i + 1 < 6 && j + 1 < 6 && board[i + 1][j + 1] === AI) {
                    utility += 999;
                }
                // Check 2 diagonal (top-right to bottom-left)
                if (i + 1 < 6 && j - 1 >= 0 && board[i + 1][j - 1] === AI) {
                    utility += 999;
                }

                utility += 30 // more pieces on the board is marginally better

            }
            
            //CheckLose
            if (board[i][j] === player) {
                // Check horizontal lose
                if (j + 2 < 6 && board[i][j + 1] === player && board[i][j + 2] === player) {
                    utility -= 19999;
                }
                // Check vertical lose
                if (i + 2 < 6 && board[i + 1][j] === player && board[i + 2][j] === player) {
                    utility -= 19999;
                }
                // Check diagonal lose (top-left to bottom-right)
                if (i + 2 < 6 && j + 2 < 6 && board[i + 1][j + 1] === player && board[i + 2][j + 2] === player) {
                    utility -= 19999;
                }
                // Check diagonal lose (top-right to bottom-left)
                if (i + 2 < 6 && j - 2 >= 0 && board[i + 1][j - 1] === player && board[i + 2][j - 2] === player) {
                    utility -= 19999;
                }
                // Check 2 horizontal 
                if (j + 1 < 6 && board[i][j + 1] === player) {
                    utility -= 19999; // equal utility (lose) cos lose on next move
                }
                // Check 2 vertical 
                if (i + 1 < 6 && board[i + 1][j] === player) {
                    utility -= 19999;
                }
                // Check 2 diagonal (top-left or bottom-right)
                if (i + 1 < 6 && j + 1 < 6 && board[i + 1][j + 1] === player) {
                    utility -= 19999;
                }
                // Check 2 diagonal (top-right or bottom-left)
                if (i + 1 < 6 && j - 1 >= 0 && board[i + 1][j - 1] === player) {
                    utility -= 19999;
                }

                utility -= 30 // try to push human pieces off; no human pieces best

                // gradient of disutility from centre to edge (high to low)
                // meaning AI would prefer outcome where player pieces are towards the edge
                if ((i === 0 || i === 5) && (j === 0 || j === 5)) {
                    utility -= 12
                }

                if ((i === 1 || i === 4) && (j === 1 || j === 4)) {
                    utility -= 14
                }

                if ((i === 2 || i === 3) && (j === 2 || j === 3)) {
                    utility -= 16
                }
            }
            
        }
    }
    return utility

}

//AI Heuristic - Normal (utility maximising; 1-step; local maxima)
function AI_Normal() {
    let best_move = [10,10]
    let max_utility = -99999
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (boardState[i][j] !== "") {continue} // skips occupied
            // makes a new move and returns new boardstate
            let new_board = AIboopTokens(i,j,JSON.parse(JSON.stringify(boardState)))
            let new_utility = Calc_Utility(new_board,i,j)
            if (new_utility > max_utility) {
                best_move = [i,j]
                max_utility = new_utility
            }

        }
    }
    return best_move
}

//AI Heuristic - Terminator (minimax; alpha-beta pruning; 5-step but might crash)
function AI_Terminator() {
    let [utility,best_moves] = minimax(boardState,4,-99999,99999,true)
    return best_moves.slice(-1).pop()
}

function move_gen() {
    let moves = []
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            moves.push([i,j])
        }
    }
    return moves
}

function AI_checkWin(board,player) {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] === player) {
                // Check horizontal win
                if (j + 2 < 6 && board[i][j + 1] === player && board[i][j + 2] === player) {
                    return true;
                }
                // Check vertical win
                if (i + 2 < 6 && board[i + 1][j] === player && board[i + 2][j] === player) {
                    return true;
                }
                // Check diagonal win (top-left to bottom-right)
                if (i + 2 < 6 && j + 2 < 6 && board[i + 1][j + 1] === player && board[i + 2][j + 2] === player) {
                    return true;
                }
                // Check diagonal win (top-right to bottom-left)
                if (i + 2 < 6 && j - 2 >= 0 && board[i + 1][j - 1] === player && board[i + 2][j - 2] === player) {
                    return true;
                }
            }
        }
    }
    return false;
}

function minimax(board, depth, alpha, beta, AI) {
    if (AI_checkWin(board,"O")) { //check win
        return [Calc_Utility(board), []]
    }
    if (AI_checkWin(board,"X")) { //check lose
        return [Calc_Utility(board), []]
    }
    if (depth === 0) {
        return [Calc_Utility(board), []]
    }
    let best_move = null
    let best_moves = []
    if (AI) { // maximiser
        let utility = -99999
        for (let move of move_gen()) {
            let i = move[0]
            let j = move[1]
            // console.log("max:" + i + "," + j)
            if (board[i][j] !== "") {continue}
            let new_board = AIboopTokens(i,j,JSON.parse(JSON.stringify(board)),true)
            // console.log(new_board)
            let [new_utility, moves] = minimax(new_board,depth - 1, alpha, beta,false)
            // console.log("catch max:" + new_utility, moves, utility)
            if (new_utility > utility) {
                utility = new_utility
                best_move = move
                best_moves = moves
            }
            alpha = Math.max(alpha, utility)
            if (alpha >= beta) {
                break
            }
        }
        best_moves.push(best_move)
        return [utility, best_moves]
    } 
    else { //minimiser
        let utility = 99999
        for (let move of move_gen()) {
            let i = move[0]
            let j = move[1]
            // console.log("min:" + i + "," + j)
            if (board[i][j] !== "") {continue}
            let new_board = AIboopTokens(i,j,JSON.parse(JSON.stringify(board)),false)
            // console.log(new_board)
            let [new_utility,moves] = minimax(new_board, depth - 1, alpha, beta, true)
            // console.log("catch min:" + utility,moves)
            if (new_utility < utility) {
                utility = new_utility
                best_move = move
                best_moves = moves
            }
            beta = Math.min(beta, utility)
            if (beta <= alpha) {
                break
            }
        }
        best_moves.push(best_move)
        return [utility, best_moves]
    }
}


    // Function to update turn indicator
    function updateTurnIndicator() {
        turnIndicator.innerText = `Current Turn: Player ${currentPlayer}`;
    }

    // Function to boop tokens
    function boopTokens(row, col) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (const [dx, dy] of directions) {
            let x = row + dx;
            let y = col + dy;
            if (x >= 0 && x < 6 && y >= 0 && y < 6 && boardState[x][y] !== '') {
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && nx < 6 && ny >= 0 && ny < 6) {
                    if (boardState[nx][ny] === '') {
                        boardState[nx][ny] = boardState[x][y];
                        boardState[x][y] = '';
                    }
                } else {
                    // Token to be booped is adjacent to the edge of the board
                    boardState[x][y] = '';
                }
            }
        }
    }

    function AIboopTokens(row, col,board,AI = true) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        if (AI) {
            board[row][col] = "O";
        } else {
            board[row][col] = "X"
        }
        
        for (const [dx, dy] of directions) {
            let x = row + dx;
            let y = col + dy;
            if (x >= 0 && x < 6 && y >= 0 && y < 6 && board[x][y] !== '') {
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && nx < 6 && ny >= 0 && ny < 6) {
                    if (board[nx][ny] === '') {
                        board[nx][ny] = board[x][y];
                        board[x][y] = '';
                    }
                } else {
                    // Token to be booped is adjacent to the edge of the board
                    board[x][y] = '';
                }
            }
        }
        return board
    }

    // Function to check for a win
    function checkWin(player) {
        // Check horizontal, vertical, and diagonal wins
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (boardState[i][j] === player) {
                    // Check horizontal win
                    if (j + 2 < 6 && boardState[i][j + 1] === player && boardState[i][j + 2] === player) {
                        return [[i, j], [i, j + 1], [i, j + 2]];
                    }
                    // Check vertical win
                    if (i + 2 < 6 && boardState[i + 1][j] === player && boardState[i + 2][j] === player) {
                        return [[i, j], [i + 1, j], [i + 2, j]];
                    }
                    // Check diagonal win (top-left to bottom-right)
                    if (i + 2 < 6 && j + 2 < 6 && boardState[i + 1][j + 1] === player && boardState[i + 2][j + 2] === player) {
                        return [[i, j], [i + 1, j + 1], [i + 2, j + 2]];
                    }
                    // Check diagonal win (top-right to bottom-left)
                    if (i + 2 < 6 && j - 2 >= 0 && boardState[i + 1][j - 1] === player && boardState[i + 2][j - 2] === player) {
                        return [[i, j], [i + 1, j - 1], [i + 2, j - 2]];
                    }
                }
            }
        }
        return null;
    }

    // Function to highlight winning cells
    function highlightWinningCells(cells) {
    cells.forEach(([row, col]) => {
        const cell = gameboard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('winning-cell');
    });
}

    // Event listener for new game button
    newGameBtn.addEventListener('click', () => {
        currentPlayer = 'X';
        boardState = [
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', '']
        ];
        gameEnded = false;
        message.innerText = '';
        turnIndicator.innerText = '';
        renderGameboard();
        updateTurnIndicator();
    });

    renderGameboard();
    updateTurnIndicator();