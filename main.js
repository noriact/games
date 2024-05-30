import "./style.css";
import { Main as TicTacToe}  from "./components/tic-tac-toe/ticTacToe";
import { Main as Memory}  from "./components/Memory/memory";
import { Main as PiedraPapelTijera}  from "./components/RockPaperScissors/rockPaperScissors";

let currentGame = 'PiedraPapelTijera';
const games = {
  'TicTacToe': TicTacToe,
  'Memory': Memory,
  'PiedraPapelTijera': PiedraPapelTijera
}

const header = () => {
  return `<nav class="game-selector">
    ${Object.keys(games).map((game) => `<button id="${game}">${game}</button>`).join('')}
  </nav>`;
}

const setupHeaderListeners = () => {
  Object.keys(games).forEach(
    (game) => document.getElementById(game).addEventListener('click', () => {
      currentGame = game;
      render();
    })
)}

export const render = () => {

  const {html, setupListeners} = getRenderer(currentGame)()

  document.querySelector("#header").innerHTML = header();
  document.querySelector("#app").innerHTML = html;
  setupHeaderListeners()
  setupListeners()
};

const getRenderer = (currentGame) => games[currentGame];


render();