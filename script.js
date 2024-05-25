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
                cell.innerText = boardState[i][j];
                cell.addEventListener('click', handleCellClick);
                /* Highlight winning cells
                if (winningCells.some(([row, col]) => row === i && col === j)) {
                    cell.classList.add('winning-cell');
                }*/
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
                    message.innerText = `Player X wins!`;
                    /*const winningPositions = checkWin('X');
                    if (winningPositions) {
                        for (const [row, col] of winningPositions) {
                            if (i === row && j === col) {
                                cell.classList.add('winning-cell');
                            }
                        }
                    }
                    renderGameboard();*/
                    gameEnded = true;
                } else if (checkWin('O')) {
                    message.innerText = `Player O wins!`;
                    /*const winningPositions = checkWin('O');
                    if (winningPositions) {
                        for (const [row, col] of winningPositions) {
                            if (i === row && j === col) {
                                cell.classList.add('winning-cell');
                            }
                        }
                    }
                    renderGameboard();*/
                    gameEnded = true;
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateTurnIndicator();
                }
            }
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