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

        const availableCells = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getToken() === 0) {
                    availableCells.push(board[i][j]);
                }
            }
        }

        if (availableCells.length === 0) {
            console.log("Game is over!");
        }
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

    return { getBoard, markCell, printBoard, checkWinningConditions };

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
    const playerOneName = "Player 1";
    const playerTwoName = "Player 2";
    const board = GameBoard();

    const players = [{
        playerName: playerOneName,
        token: 1
    }, {
        playerName: playerTwoName,
        token: 2
    }
    ]
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const changeActivePlayer = () =>
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];

    const printNewRound = function () {
        console.log(`Active player is now ${getActivePlayer().playerName}`);
        board.printBoard();
    }


    const playRound = (row, column) => {
        if (board.checkWinningConditions()) {
            changeActivePlayer();
            console.log(`Player ${getActivePlayer().playerName} has won! Congratulations!`);
            return;
        }
        board.markCell(row, column, activePlayer);
        changeActivePlayer();
        printNewRound();
    };

    printNewRound();

    return {
        playRound, getActivePlayer
    }

}

const game = GameController();
game.playRound(0, 0);
game.playRound(1, 2);
game.playRound(0, 1);
game.playRound(1, 1);
game.playRound(0, 2);
game.playRound(2, 2);

