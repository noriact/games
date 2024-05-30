import "./memory.css"
import { render } from "../../main";


const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const chunk = (originalList) => {
    const list = []
    const chunkSize = 4;
    for (let i = 0; i < originalList.length; i += chunkSize) {
        const chunk = originalList.slice(i, i + chunkSize);
        list.push(chunk)
    }
    return list;
}

let board = undefined;
let score = 0;
let selectedCard = undefined;

const generateMemory = () => chunk(shuffleArray([...Array(8).keys()].flatMap((x) => [x, x])))

const restartGame = () => {
    board = generateMemory();
    score = 0;
    selectedCard = undefined;
    render();
}

const drawBoard = (memoryState) => {
    return `<div class="board">
        ${memoryState.map((chunk) => chunk.map((number) => drawCard(number)).join('')).join('')}
    </div>`
}

const drawCard = (number) => `<div class="board-cell">
    <div class="flip-card-inner" id="card-${number}">
        <div class="flip-card-back"></div>
        <div class="flip-card-front" style="background-image: url(/dog${number}.jpeg)"></div>
    </div>
</div>`

const getId = (card) => card.id.split("-")[1]

const setupListeners = () => {
    [...Array(8).keys()].forEach(
        (number) => document.querySelectorAll(`#card-${number}`)
            .forEach((elem) => elem.addEventListener('click', ({target}) => {
                target.parentNode.classList.add("selected-card");

                if (selectedCard && selectedCard != target) {
                    if (getId(target.parentNode) == getId(selectedCard)) {
                        score = score + 1;
                        selectedCard = undefined;
                    } 
                    else {
                        const selected = selectedCard;
                        setTimeout(() => {
                            selected.classList.remove("selected-card");
                            target.parentNode.classList.remove("selected-card");
                        }, 1500);
                        selectedCard = undefined;
                    }
                } else {
                    selectedCard = target.parentNode;
                }

                if (score == 8) {
                    alert("¡Enhorabuena, has ganado!")
                }
            }))
    )
    document.querySelector(".restart-game-button").addEventListener('click', restartGame)
}


export const Main = () => {
    if (!board) {
        restartGame()
    }
    return {
            html: `
            <div id="memory">
                ${drawBoard(board)}
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

