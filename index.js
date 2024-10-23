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
        const availableCells = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getToken() === 0) {
                    availableCells.push(board[i][j]);
                }
            }
        }
        if (availableCells.length === 0) {
            console.log("game is over!")
        }
        if (availableCells.includes(board[row][column])) {
            board[row][column].addToken(player);
        }
    }

    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            let rowString = '';
            for (let j = 0; j < columns; j++) {
                rowString += board[i][j].getToken() + ' ';
            }
            console.log(rowString.trim());
        }
    };

    return {getBoard, markCell, printBoard};
}

function Cell() {

    let token = 0;
    const getToken = () => token;
    const addToken = (player) => {
        token = player;
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
        board.markCell(row, column, activePlayer);
        changeActivePlayer();
        printNewRound();
    };

    printNewRound()

    return {
        playRound, getActivePlayer
    }

}

const game = GameController();
