const MAX_LIFE = 30;
const MANA = 0;

class Player {
    constructor(player, life, mana) {
        this.player = player;
        this.life = MAX_LIFE;
        this.mana = MANA;
    }

}

const startGame = document.querySelector('#start-game');
startGame.style.backgroundImage = "url('background.webp')";
startGame.style.minWidth = "100%";
startGame.style.minHeight = "100%";
startGame.style.position = "absolute";
startGame.style.display = "flex";
startGame.style.justifyContent = "center";
startGame.style.alignItems = "center";

const gameBoard = document.querySelector('#game-board');
const buttonNone = document.querySelector('#button-none');
buttonNone.addEventListener('click', function () {
    startGame.style.display = "none";
    gameBoard.style.display = "block";
})

const card = document.querySelector('.card');
