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
        this.hand = [];
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
    const handPlayer = document.querySelector('.hand-player' + this.number)

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

    return newCard;
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

    // Draw the three first cards
    for (let i = 0; i < 3; i++) {
        player1.drawCard(player1.deck[i]);
        player2.drawCard(player2.deck[i]);
    }

    // Display cards in hand
    player1.refreshHand();
    player2.refreshHand();
})

// Ajout des listeners pour jouer une carte sur le terrain
const playerCards = document.querySelector('.card');
for (let i = 0; i < playerCards.length; i++) {
    playerCards[i].addEventListener('click', function() {
        /*player1.playCard(card);*/
        playerCards[i].style.visibility = 'hidden';
        console.log([i]);
    })
}


// Créer les contraintes de coûts (mana, conditions pour jouer une carte...)

// Créer les fonctions pour récupérer les valeurs
