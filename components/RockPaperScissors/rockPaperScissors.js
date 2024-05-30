import "./rockPaperScissors.css"
import { render } from "../../main";


const getScore = () => JSON.parse(localStorage.getItem("scoreboard"));
const setScore = (newScore) => localStorage.setItem("scoreboard", JSON.stringify(newScore));

let isGameACtive = true;
let userChoice = undefined;
let computerChoice = undefined;
let board = undefined;

const symbols  = [
    '☀️',
    '🍦',
    '⛱️'
]

const restartGame = () => {
    if (!getScore()) {
        setScore({user: 0, computer: 0})
    }
}

const setupListeners = () => {
    [0, 1, 2].map((i) => document.getElementById(`icon-${i}`).addEventListener('click', () => {
        if (!isGameACtive) {
            console.log("Game is not active!")
            return;
        }
        isGameACtive = 0;
        userChoice = i;
        computerChoice = Math.floor(Math.random() * 3);

        const {user, computer} = getScore();
        if (getWinner() == 'computer') {
            setScore({user, computer: computer + 1})
        } else if (getWinner() == 'user') {
            setScore({user: user + 1, computer: computer})
        }

        render();

        computerChoice = undefined;
        isGameACtive = true;
    }));
}

const drawComputerChoice = () => (computerChoice != undefined) ? `<div>
    <p>Your opponent chose</p>
        ${drawCard(symbols[computerChoice], computerChoice)}
    </p>` : `<div class="separator">${drawCard('', '')}</div>`;


const drawCard = (symbol, i) => `<div class='board-cell' id='icon-${i}'>
    <i>${symbol}</i>
</div>`

const drawBoard = () => {
    return symbols.map((symbol, i) => drawCard(symbol, i)).join('')
}

const getWinner = () => {
    if (computerChoice == undefined || userChoice == undefined) return undefined;
    if (userChoice == (computerChoice + 2) % 3) {
        return 'user'
    } else if (userChoice == computerChoice) {
        return 'draw'
    } else {
        return 'computer'
    }
}

const drawMessage = () => {
    if (computerChoice == undefined || userChoice == undefined) return '';
    const winner = getWinner();
    switch (winner) {
        case 'user': return `<h2>You win! Enjoy your summer</h2>`
        case 'draw': return `<h2>You drawed… How inconclusive</h2>`
        case 'computer': return `<h2>You lose. Hope you can practice during this summer</h2>`
    }
}

const drawScoreBoard = () => {
    const {user, computer} = getScore();
    return `<h4>🌊:${user} / ❄️:${computer}</h4>`
}

export const Main = () => {
    if (!board) {
        restartGame()
    }
    return {
            html: `
            <div id="rockPaperScissors">
            <h2>Make your choice!</h2>
                ${drawScoreBoard()}
                <div class="board">
                    ${drawBoard()}
                </div>
                    ${drawComputerChoice()}
                    ${drawMessage()}
            </div>
        `, 
        setupListeners
    };
}