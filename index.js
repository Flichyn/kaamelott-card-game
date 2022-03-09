// Card class constructor
class Card {
    constructor(name, health, strength, shield, cost, image) {
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.shield = shield;
        this.cost = cost;
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
            const newPV = document.querySelector(".player-pv" + enemy.number);
            newPV.innerHTML = enemy.health;
        }
    }

    isAlive() {
        if (this.health > 0) {
            return true
        };
    }
}

// Player class constructor
const MAX_HEALTH = 20;
const MANA = 0;
const deck1 = [
    new Card('Perceval', 7, 2, 3, 2, 'images/perceval.webp'),
    new Card('Arthur', 7, 4, 4, 4, 'images/arthur.jpg'),
    new Card('Léodagan', 10, 7, 2, 5, 'images/leodagan.webp'),
    new Card('Duc d\'Aquitaine', 5, 2, 4, 3, 'images/duc-aquitaine.png'),
    new Card('Lancelot', 4, 8, 3, 4, 'images/lancelot.png'),
];

const deck2 = [
    new Card('Perceval', 7, 2, 3, 2, 'images/perceval.webp'),
    new Card('Arthur', 7, 4, 4, 4, 'images/arthur.jpg'),
    new Card('Léodagan', 10, 7, 2, 5, 'images/leodagan.webp'),
    new Card('Duc d\'Aquitaine', 5, 2, 4, 3, 'images/duc-aquitaine.png'),
    new Card('Lancelot', 4, 8, 3, 4, 'images/lancelot.png'),
];

const discardPile1 = [];
const discardPile2 = [];

// POUR PLUS TARD
const deckSuite = [
    new Card('Guenièvre', 1, 1, 1, ''),
    new Card('Duchesse d\'Aquitaine', 1, 1, 1, ''),
    new Card('Séli', 1, 1, 1, ''),
    new Card('Bohort', 1, 1, 1, ''),
    new Card('Élias', 1, 1, 1, ''),
    new Card('Merlin', 1, 1, 1, ''),
    new Card('La Dame du Lac', 1, 1, 1, ''),
    new Card('Loth', 1, 1, 1, ''),
    new Card('Le Jurisconsulte', 1, 1, 1, ''),
    new Card('Dagonet', 1, 1, 1, ''),
    new Card('Mevanwi', 1, 1, 1, ''),
    new Card('Venec', 1, 1, 1, ''),
    new Card('Le Roi Burgonde', 1, 1, 1, ''),
    new Card('Méléagant', 1, 1, 1, ''),
    new Card('Le Maître d\'Armes', 1, 1, 1, ''),
]


class Player {
    constructor(name, deck, number) {
        this.name = name;
        this.health = MAX_HEALTH;
        this.mana = MANA;
        this.deck = deck;
        this.number = number
        this.hand = 0;
        this.board = [];
        }

    isAlive() {
        if (this.health <= 0) {
            return false
        };
    }

    isHandFull() {
        if (this.hand === 5) {
            return true;
        }
    }

    shuffle() {
        let deck = this.deck;
        let newDeck = [];

        // 'i' stands for 'remaining cards'
        for (let i = deck.length; i >= 1; i--) {
            let randomIndex = Math.floor(Math.random() * i);
            newDeck.push(deck[randomIndex]);
            deck.splice(randomIndex, 1)
        }

        this.deck = newDeck;
    }
    
    board(card) {
      
    
    }
    
    drawCard(card) {
        // Create HTML tags and add classes
        const handPlayer = document.querySelector('.hand-player' + this.number);

        const newCard = document.createElement('div');
        newCard.classList.add('card');
    
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        newCard.appendChild(cardInner);
    
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardInner.appendChild(cardBack);
    
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardInner.appendChild(cardFront);
    
        const cardIcons = document.createElement('div');
        cardIcons.classList.add('card-icons');
        cardFront.appendChild(cardIcons);
    
        const weaponIcon = document.createElement('div');
        weaponIcon.classList.add('weapon');
        cardIcons.appendChild(weaponIcon);
    
        const shieldIcon = document.createElement('div');
        shieldIcon.classList.add('shield');
        cardIcons.appendChild(shieldIcon);
    
        const heartIcon = document.createElement('div');
        heartIcon.classList.add('heart');
        cardIcons.appendChild(heartIcon);

        const gemIcon = document.createElement('div');
        gemIcon.classList.add('gem');
        cardIcons.appendChild(gemIcon);
    
        // Add data to HTML elements
        heartIcon.innerHTML = card.health;
        weaponIcon.innerHTML = card.strength;
        shieldIcon.innerHTML = card.shield;
        gemIcon.innerHTML = card.cost;
        cardFront.style.backgroundImage = 'url(' + card.image + ')';
    
        handPlayer.appendChild(newCard);
        this.hand += 1;
    }

    playCard(card) {

    }
       
  
}

//Mise en place du bouton fin de tours
let turn = 1;
const cardFinish1 = document.querySelector(".hand-player1");
const cardFinish2 = document.querySelector("#player-1");
const buttonFinish = document.querySelector("#button-finish");

    buttonFinish.addEventListener("click", function(){
        if(turn == 1){
            cardFinish1.style.filter = "grayscale(100%)";
            cardFinish2.style.filter = "grayscale(100%)";
            turn++;
            buttonFinish.setAttribute("disabled", true);
            console.log(turn);
        } else {
            cardFinish1.style.filter = "grayscale(0%)";
            cardFinish2.style.filter = "grayscale(0%)";
            turn--;
            console.log(turn);
        }
    });

// Mise en place des gemmes
const manaGem1 = document.querySelector("#mana-player1");
const manaGem2 = document.querySelector("#mana-player2");

// Mise en place du bouton pour commencer une partie
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

let player1;
let player2;

// Button to start the game and shuffle the decks
buttonStart.addEventListener('click', function () {
    startGame.style.display = "none";
    gameBoard.style.display = "block";
    player1 = new Player('Perceval', deck1, 1);
    player2 = new Player('CPU', deck2, 2);
    player1.shuffle();
    player2.shuffle();
    const healthStart1 = document.querySelector(".player-pv1");
    healthStart1.innerHTML = MAX_HEALTH;
    const healthStart2 = document.querySelector(".player-pv2");
    healthStart2.innerHTML = MAX_HEALTH;

    // Draw the three first cards
    for (let i = 0; i < 3; i++) {
        player1.drawCard(player1.deck[i]);
        player2.drawCard(player2.deck[i]);
    }

    // Créer fonction pour définir le premier joueur
});





// Créer les contraintes de coûts (mana, conditions pour jouer une carte...)

// Créer les fonctions pour récupérer les valeurs

