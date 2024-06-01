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
let active = true;

const generateMemory = () => chunk(shuffleArray([...Array(8).keys()].flatMap((x) => [x, x])))

const restartGame = () => {
    board = generateMemory();
    score = 0;
    selectedCard = undefined;
    active = true;
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
            .forEach((elem) => { 
		    elem.addEventListener('click', ({target}) => {
			if (active && !target.parentNode.classList.contains("discover-card")) {
                            target.parentNode.classList.add("discover-card");
			    active = false;
			}
		    });
		    elem.addEventListener('animationend', ({target}) => {
                    if (selectedCard && selectedCard != target) {
		        // there was a card already selected, a card with the same symbol was selected
                        if (getId(target.parentNode) == getId(selectedCard)) {
                            score = score + 1;
                            selectedCard = undefined;
                        } 
		        // there was a card already selected, a card with a different symbol was selected
		        else {
			    target.parentNode.classList.remove("discover-card");
			    selectedCard.classList.remove("discover-card");
			    selectedCard = undefined;
			}
		    } else {
			    selectedCard = target.parentNode;
		    }
			if (score >= 8) {
			    alert("Has ganado!");
			} else { 
		            active = true;
			}
		    });
	    }));
    
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

