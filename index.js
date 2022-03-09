// Card class constructor
class Card {
    constructor(id, name, health, strength, shield, cost, image) {
        this.id = id;
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
    new Card(1, 'Perceval', 7, 2, 3, 2, 'images/perceval.webp'),
    new Card(2, 'Arthur', 7, 4, 4, 4, 'images/arthur.jpg'),
    new Card(3, 'Léodagan', 10, 7, 2, 5, 'images/leodagan.webp'),
    new Card(4, 'Duc d\'Aquitaine', 5, 2, 4, 3, 'images/duc-aquitaine.png'),
    new Card(5, 'Lancelot', 4, 8, 3, 4, 'images/lancelot.png'),
];

const deck2 = [
    new Card(1, 'Perceval', 7, 2, 3, 2, 'images/perceval.webp'),
    new Card(2, 'Arthur', 7, 4, 4, 4, 'images/arthur.jpg'),
    new Card(3, 'Léodagan', 10, 7, 2, 5, 'images/leodagan.webp'),
    new Card(4, 'Duc d\'Aquitaine', 5, 2, 4, 3, 'images/duc-aquitaine.png'),
    new Card(5, 'Lancelot', 4, 8, 3, 4, 'images/lancelot.png'),
];

const discardPile1 = [];
const discardPile2 = [];

// POUR PLUS TARD
const deckSuite = [
    new Card(6, 'Guenièvre', 1, 1, 1, ''),
    new Card(7, 'Duchesse d\'Aquitaine', 1, 1, 1, ''),
    new Card(8, 'Séli', 1, 1, 1, ''),
    new Card(9, 'Bohort', 1, 1, 1, ''),
    new Card(10, 'Élias', 1, 1, 1, ''),
    new Card(11, 'Merlin', 1, 1, 1, ''),
    new Card(12, 'La Dame du Lac', 1, 1, 1, ''),
    new Card(13, 'Loth', 1, 1, 1, ''),
    new Card(14, 'Le Jurisconsulte', 1, 1, 1, ''),
    new Card(15, 'Dagonet', 1, 1, 1, ''),
    new Card(16, 'Mevanwi', 1, 1, 1, ''),
    new Card(17, 'Venec', 1, 1, 1, ''),
    new Card(18, 'Le Roi Burgonde', 1, 1, 1, ''),
    new Card(19, 'Méléagant', 1, 1, 1, ''),
    new Card(20, 'Le Maître d\'Armes', 1, 1, 1, ''),
]


class Player {
    constructor(name, deck, number) {
        this.name = name;
        this.health = MAX_HEALTH;
        this.mana = MANA;
        this.deck = deck;
        this.number = number
        this.hand = [];
        this.board = [];
    }

    isAlive() {
        if (this.health <= 0) {
            return false
        };
    }

    isHandFull() {
        if (this.hand.length === 5) {
            return console.log('Vous ne pouvez pas piocher plus.');
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

    drawCard() {
        //Récupérer carte du deck et mettre dans la main
        if (this.deck.length >= 1) {
            const drawnCard = this.deck.shift();
            const deckPlayer = document.querySelector('.deck-player' + this.number)
            this.hand.push(drawnCard);
            if (this.deck.length === 0) {
                deckPlayer.style.visibility = 'hidden';
            }
            this.refreshHand();
        } else {
            console.log('Vous ne pouvez pas piocher plus.');
        }
    }

    refreshHand() {
        const hand = this.hand;
        const handPlayer = document.querySelector('.hand-player' + this.number);
        
        while(handPlayer.firstChild) {
            handPlayer.removeChild(handPlayer.firstChild);
        }

        hand.forEach((card) => handPlayer.appendChild(createCard(card)));
    }

    playCard(card) {
        const enemyCards = document.querySelectorAll('.hand-player' + this.number === 1 ? 2 : 1);
        enemyCards.addEventListener('click', function() {
            // A faire
        })
    }
       
  
}

function createCard(card) {
    // Create HTML tags and add classes
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
    newCard.setAttribute('data-id', card.id);

    return newCard;
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

    // Display cards in hand
    player1.refreshHand();
    player2.refreshHand();

    // Ajout des listeners pour jouer une carte sur le terrain
    const playerCardsInHand = document.querySelector('.hand-player1');

    playerCardsInHand.addEventListener('click', event => {
            console.log(event.target.classList.value);
            if (event.target && event.target.classList.value === "card") {
                const dataId = event.target.closest('.card').dataset.id;
                const cardHandToBoard = player1.hand.find(card => card.id == dataId);
                player1.board.push(cardHandToBoard);
                /*let newHand = player1.hand.filter(function(card) {
                    return card !== cardHandToBoard;
                })*/
                let newHand = removeFromArray(player1.hand, cardHandToBoard);
                player1.hand = newHand;
                player1.refreshHand();
                /*removeFromArray(player1.hand, cardHandToBoard);*/
            }
            
        })
    })

// Créer les contraintes de coûts (mana, conditions pour jouer une carte...)

// Créer les fonctions pour récupérer les valeurs

function removeFromArray(array, cardToRemove) { 
    
    return array.filter(function(card) { 
        return card !== cardToRemove; 
    });
}