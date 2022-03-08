// Card class constructor
class Card {
    constructor(name, health, strength, shield, image) {
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.shield = shield;
        this.image = image ?? '';
    }

    attack(enemy) {
        if(enemy instanceof Card) {
            const attack = this.strength - enemy.shield
            enemy.health -= attack;
            console.log(`${this.name} attaque ${enemy.name} et lui retire ${attack} PV.`);
            if (!enemy.isAlive) {
                console.log(`${enemy.name} est mort.`)
            }
        } else if(enemy instanceof Player) {
            enemy.health -= this.strength;
            console.log(`${this.name} attaque ${enemy.name} et lui retire ${this.strength} PV.`);
        }
    }

    isAlive() {
        if (this.health > 0) {
            return true
        };
    }
}

// Player class constructor
const MAX_HEALTH = 30;
const MANA = 0;
const deck = [
    new Card('Perceval', 1, 1, 1),
    new Card('Arthur', 1, 1, 1, 'images/arthur.jpg'),
    new Card('Léodagan', 1, 1, 1),
    new Card('Karadoc', 1, 1, 1),
    new Card('Lancelot', 1, 1, 1),
];

class Player {
    constructor(name) {
        this.name = name;
        this.health = MAX_HEALTH;
        this.mana = MANA;
        this.deck = deck;
    }

    isAlive() {
        if (this.health <= 0) {
            return false
        };
    }
}

const player = new Player('Lloy');
const perceval = new Card('Perceval', 5, 2, 5)
const leodagan = new Card('Léodagan', 7, 6, 0)

const startGame = document.querySelector('#start-game');
startGame.style.backgroundImage = "url('background.webp')";
startGame.style.minWidth = "100%";
startGame.style.minHeight = "100%";
startGame.style.position = "absolute";
startGame.style.display = "flex";
startGame.style.justifyContent = "center";
startGame.style.alignItems = "center";

const gameBoard = document.querySelector('#game-board');
const buttonStart = document.querySelector('#button-start');
buttonStart.addEventListener('click', function () {
    startGame.style.display = "none";
    gameBoard.style.display = "block";
})

