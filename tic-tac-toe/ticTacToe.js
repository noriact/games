import "./ticTacToe.css"
import { render } from "../../main";

const INITIAL_BOARD_STATE = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
]
const PLAYERS_SYMBOLS = ["❤️", "🍦"]
const INITIAL_SCORE = [0, 0]

const isGameActive = () => JSON.parse(sessionStorage.getItem("gameActive"));
const setIsGameActive = (newStatus) => sessionStorage.setItem("gameActive", JSON.stringify(newStatus));

const getBoardState = () => JSON.parse(sessionStorage.getItem("boardState"));
const setBoardState = (newBoardState) => sessionStorage.setItem("boardState", JSON.stringify(newBoardState))

const getPlayer = () => sessionStorage.getItem("currentPlayer");
const setPlayer = (newPlayer) => sessionStorage.setItem("currentPlayer", newPlayer)

const getScore = () => JSON.parse(sessionStorage.getItem("score"));
const resetScore = () => sessionStorage.setItem("score", JSON.stringify(INITIAL_SCORE))
const setGameWonBy = (player) => {
    const currentScore = getScore();
    ++currentScore[PLAYERS_SYMBOLS.indexOf(player)];
    sessionStorage.setItem("score", JSON.stringify(currentScore))
}

const restartGame = () => {
    setPlayer(PLAYERS_SYMBOLS[0]);
    setBoardState(INITIAL_BOARD_STATE);
    setIsGameActive(true);
    render();
}

const checkIfPlayerWin = (boardState, player) => {
    console.log("checking victory for player " + player)
    // check rows
    const wonRow = boardState.some(
        (row) => row.every((cell) => cell == player)
    );

    // check column
    const wonColumn = [0, 1, 2].some((j) => [0, 1, 2].every(
        (i) => boardState[i][j] == player
    ));

    // check diagonals
    const wonDiagonal = [0, 1, 2].every((i) => boardState[i][i] == player)
    const wonInverseDiagonal = [0, 1, 2].every((i) => boardState[2-i][i] == player)

    return wonRow || wonColumn || wonDiagonal || wonInverseDiagonal
}

const checkIfDraw = (boardState) => {
    return boardState.every(row => row.every(cell => cell !== ""));
}

const onPlayerClick = (i, j) => {
    if (!isGameActive()) return;

    const boardState = getBoardState();
    if (boardState[i][j] !== "") return;

    const player = getPlayer()
    boardState[i][j] = player;
    setBoardState(boardState);

    if (checkIfPlayerWin(boardState, player)) {
        alert(`${player} won the game!`);
        setIsGameActive(false);
        setGameWonBy(player);
    } else if (checkIfDraw(boardState)) {
        alert(`The game is a draw!`);
        setIsGameActive(false);
    } else {
        setPlayer(player == PLAYERS_SYMBOLS[0] ? PLAYERS_SYMBOLS[1] : PLAYERS_SYMBOLS[0]);
    }

    render();
}

const drawScoreBoard = (score) => `<span class="scoreboard">
    ${PLAYERS_SYMBOLS[0]}: ${score[0]} ${PLAYERS_SYMBOLS[1]}: ${score[1]}
</span>`

const drawBoard = (state) => {
    const boardRepresentation = state.map(
        (row, i) => row.map(
            (cell, j) => `<div class="board-cell" id="cell-${i}-${j}">${cell}</div>`
        )
    )

    return `<div class="board">
        ${boardRepresentation
            .map(
                (rowRepresentation) => rowRepresentation.join(""))
        .join("")}
    </div>`
}

const setupListeners = () => {
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            document.getElementById(`cell-${i}-${j}`)
                .addEventListener('click', () => onPlayerClick(i, j))
        }
    }

    document.querySelector(".restart-game-button").addEventListener('click', restartGame)
}

export const Main = () => {
    if (!getPlayer() || !getBoardState()) {
        resetScore();
        restartGame();
    }

    return {
        html: `
            <div id="tic-tac-toe">
                ${drawScoreBoard(getScore())}
                ${drawBoard(getBoardState())}
                <div class="button-container">
                    <button class="restart-game-button">
                        Start the game!
                    </button>
                </div>
            </div>
        `, 
        setupListeners
    };
}