let playerName1;
let playerName2;
let scores = [0, 0];

function submitForm() {
    playerName1 = document.getElementById("name1").value;
    playerName2 = document.getElementById("name2").value;

    if (playerName1 && playerName2) {
        document.getElementById("popup").style.display = "none";
        screenController.init();
    } else {
        alert("You must complete both fields!");
    }
}

function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const markCell = (row, column, player) => {

        if (board[row][column].getToken() === 0) {
            board[row][column].addToken(player);
        } else {
            console.log("Cell is already taken!");
        }

        if (getAvailableCellsAmount() === 0) {
            console.log("Game is over!");
        }
    };

    const getAvailableCellsAmount = () => {
        const availableCells = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getToken() === 0) {
                    availableCells.push(board[i][j]);
                }
            }
        }
        return availableCells.length;
    }

    const checkValid = (row, column) => {
        return board[row][column].getToken() === 0;
    };

    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            let rowString = '';
            for (let j = 0; j < columns; j++) {
                rowString += board[i][j].getToken() + ' ';
            }
            console.log(rowString.trim());
        }
    };

    const checkLine = (cell1, cell2, cell3) => {
        return cell1.getToken() !== 0 && cell1.getToken() === cell2.getToken() && cell2.getToken() === cell3.getToken();
    };

    function checkWinningConditions() {
        for (let i = 0; i < rows; i++) {
            if (checkLine(board[i][0], board[i][1], board[i][2])) {
                return true;
            }
        }

        for (let j = 0; j < columns; j++) {
            if (checkLine(board[0][j], board[1][j], board[2][j])) {
                return true;
            }
        }

        return checkLine(board[0][0], board[1][1], board[2][2]) || checkLine(board[2][0], board[1][1], board[0][2]);


    }

    return {getBoard, markCell, printBoard, checkWinningConditions, checkValid, getAvailableCellsAmount};

}

function Cell() {

    let token = 0;
    const getToken = () => token;
    const addToken = (player) => {
        token = player.token;
    }
    return {getToken, addToken};
}

function GameController() {
    const board = GameBoard();
    let gameOn = true;

    const players = [
        {playerName: playerName1, token: 'X', score: scores[0]},
        {playerName: playerName2, token: '0', score: scores[1]}
    ];
    let activePlayer = players[0];

    const isGameOn = () => gameOn;
    const getActivePlayer = () => activePlayer;
    const getInactivePlayer = () => activePlayer === players[0] ? players[1] : players[0];

    const changeActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const endGame = () => {
        gameOn = false;
    };

    const getPlayers = () => players;

    const playRound = (row, column) => {
        if (!gameOn || board.checkWinningConditions()) {
            endGame();
            return;
        }
        board.markCell(row, column, activePlayer);
        changeActivePlayer();
    };

    return {
        playRound,
        getActivePlayer,
        getInactivePlayer,
        getPlayers,
        isGameOn,
        endGame,
        getBoard: board.getBoard,
        checkValid: board.checkValid,
        getAvailableCellsAmount: board.getAvailableCellsAmount,
        checkWinningConditions: board.checkWinningConditions
    };


}

const screenController = (function () {
    let game;

    const playerTurnDiv = document.getElementById("playerTurn");
    const scoreDiv0 = document.getElementById("score0");
    const scoreDiv1 = document.getElementById("score1");
    const boardDiv = document.getElementById("container");
    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", () => {
        screenController.init();
    })
    boardDiv.style.display = "inline-grid";

    const updateScreen = () => {
        updateScore();
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if (game.getAvailableCellsAmount() === 0 && game.isGameOn()) {
            playerTurnDiv.textContent = "Game is over!";
            game.endGame();
        } else if (!game.checkWinningConditions() && game.isGameOn()) {
            playerTurnDiv.textContent = `${activePlayer.playerName}'s turn...`;
        } else {
            playerTurnDiv.textContent = `${game.getInactivePlayer().playerName} has won!!!`;
            if (game.isGameOn()) {
                const winnerIndex = game.getPlayers().findIndex(player => player.playerName === game.getInactivePlayer().playerName);
                if (winnerIndex !== -1) {
                    game.getPlayers()[winnerIndex].score++;
                    scores[winnerIndex] = game.getPlayers()[winnerIndex].score;
                }
                updateScore();
                game.endGame();
            }
        }



        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cellButton = document.createElement("button");
                cellButton.dataset.column = j;
                cellButton.dataset.row = i;
                cellButton.classList.add("cell");

                if (board[i][j].getToken() !== 0) {
                    cellButton.textContent = board[i][j].getToken();
                    cellButton.textContent === "X"? cellButton.classList.add("X") : cellButton.classList.add("O");
                }
                boardDiv.appendChild(cellButton);
            }
        }
    };

    const updateScore = () => {
        scoreDiv0.textContent = `${game.getPlayers()[0].playerName}'s score: ${game.getPlayers()[0].score}`;
        scoreDiv1.textContent = `${game.getPlayers()[1].playerName}'s score: ${game.getPlayers()[1].score}`
    }

    const clickHandlerBoard = (e) => {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow || !game.checkValid(selectedRow, selectedColumn)) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    };

    const initialize = () => {
        game = GameController();
        boardDiv.addEventListener("click", clickHandlerBoard);
        updateScreen();
    };

    return {
        init: initialize
    };
})();

window.onload = function () {
    document.getElementById("popup").style.display = "block";
}

const button = document.getElementById("submit");
button.addEventListener("click", () => {
    submitForm();
})

