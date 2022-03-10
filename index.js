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
        this.hasAttacked = false;
    }

    attack(enemy) {
        if (this.hasAttacked) {
            createPop('Vous ne pouvez plus attaquer avec cette carte pour ce tour.')
        } else {
            if (enemy instanceof Card) {
                let attack = this.strength - enemy.shield;
                attack = attack < 0 ? 0 : this.strength - enemy.shield;
                console.log(attack);
                enemy.health -= attack;
                createPop(`${this.name} attaque ${enemy.name} et lui retire ${attack} PV.`);
                if (!enemy.isAlive()) {
                    enemy.health = 0;
                    createPop(`${enemy.name} est mort.`);
                    die(enemy.id);
                }
                this.hasAttacked = true;
            } else if (enemy instanceof Player) {
                enemy.health -= this.strength;
                createPop(`${this.name} attaque ${enemy.name} et lui retire ${this.strength} PV.`);
                const newPV = document.querySelector(".player-pv" + enemy.number);
                newPV.innerHTML = enemy.health;
                this.hasAttacked = true;
            }
        }
    }

    isAlive() {
        if (this.health > 0) {
            return true;
        }
    }
}

// Player class constructor
const MAX_HEALTH = 20;
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
        this.mana = 0;
        this.maxMana = 1;
        this.deck = deck;
        this.number = number
        this.hand = [];
        this.board = [];
        this.discardPile = [];
    }

    isAlive() {
        if (this.health <= 0) {
            return false
        };
    }

    isHandFull() {
        if (this.hand.length === 5) {
            return "";
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
        if (this.isHandFull()) {
            return "";
        } else {
            if (this.deck.length >= 1) {
                const drawnCard = this.deck.shift();
                const deckPlayer = document.querySelector('.deck-player' + this.number)
                this.hand.push(drawnCard);
                if (this.deck.length === 0) {
                    deckPlayer.style.visibility = 'hidden';
                }
                this.refreshHand();
            } else {
                return "";
            }
        }
        
    }

    useGems(cost) {
        const availableMana = this.mana;
        const cardCost = cost;

        if (cardCost <= availableMana) {
            this.mana -= cardCost;
            this.refreshGem();
            return true;
        } else {
            return false;
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

    refreshBoard() {
        const board = this.board;
        const boardPlayer = document.querySelector(".board-player" + this.number);

        while (boardPlayer.firstChild) {
            boardPlayer.removeChild(boardPlayer.firstChild);
        }
        board.forEach((card) => boardPlayer.appendChild(createCard(card)));
    }

    refreshHealth() {
        const player = (turn === 1 ? player2 : player1);
        const healthPoints = document.querySelector('player-pv' + player.number);
        healthPoints.innerHTML = player.health;
    }
     
    endTurn() {
        const opponent = (turn === 1 ? player2 : player1);
        if (this.maxMana < 10) {
            this.maxMana++;
            this.mana = opponent.maxMana;
            this.refreshGem();
        }        
    }

    refreshGem() {
        let gemPoint = document.querySelector('.mana-player' + this.number);
        let gemIcon = document.createElement('img');
        gemIcon.src = "images/gem.svg";

        while (gemPoint.firstChild) {
            gemPoint.removeChild(gemPoint.firstChild);
        }

        for (let i = 1; i <= this.mana; i++){
            let gemIcon = document.createElement('img');
            gemIcon.src = "images/gem.svg";
            gemPoint.appendChild(gemIcon);
        }
    };

  
}
const popUp = document.querySelector(".container");
function createPop(message) {
    const divPop = document.createElement("div");
    divPop.classList.add("popUp");
    popUp.appendChild(divPop);

    const newPop = document.createElement('p');
    newPop.innerHTML= message;
    divPop.appendChild(newPop);

    const imgPop = document.createElement('img');
    imgPop.src = "images/logoKaamelott.png";
    imgPop.classList.add('logo-kaamelott');
    divPop.appendChild(imgPop);
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

function removeFromArray(array, cardToRemove) { 
    
    return array.filter(function(card) { 
        return card !== cardToRemove; 
    });
}

function die(id) {
    let player;
    let opponent;

    if (turn == 1) {
        player = player1;
        opponent = player2;
    } else if (turn == 2) {
        player = player2;
        opponent = player1;
    }

    const deadCard = opponent.board.find(card => card.id == id);
    opponent.discardPile.push(deadCard);
    const newBoard = removeFromArray(opponent.board, deadCard);
    opponent.board = newBoard;
    opponent.refreshBoard();
}

//Mise en place du bouton fin de tours
let turn = 1;
const cardFinish1 = document.querySelector(".hand-player" + (turn === 1 ? '1' : '2'));
const cardFinish2 = document.querySelector("#player-" + (turn === 1 ? '1' : '2'));
const buttonFinish = document.querySelector("#button-finish");
const boardPlayer = document.querySelector('.board-player' + (turn === 1 ? '1' : '2'));
const handPlayer = document.querySelector('.hand-player' + (turn === 1 ? '1' : '2'));
console.log(boardPlayer)

    buttonFinish.addEventListener("click", function(){
        if (turn == 1) {
            cardFinish1.style.filter = "grayscale(100%)";
            cardFinish2.style.filter = "grayscale(100%)";
            boardPlayer.classList.toggle('no-events');
            handPlayer.classList.toggle('no-events');
            turn++;
            /*buttonFinish.setAttribute("disabled", true);*/
            player1.endTurn();
            player2.drawCard();
            // INSÉRER FONCTION IA
        } else {
            cardFinish1.style.filter = "grayscale(0%)";
            cardFinish2.style.filter = "grayscale(0%)";
            boardPlayer.classList.toggle('no-events');
            handPlayer.classList.toggle('no-events');
            turn--;
            player2.endTurn();
            player1.drawCard();
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
    healthStart1.parentElement.parentElement.setAttribute("data-id", 'player' + player1.number);
    const healthStart2 = document.querySelector(".player-pv2");
    healthStart2.innerHTML = MAX_HEALTH;
    healthStart2.parentElement.parentElement.setAttribute("data-id", 'player' + player2.number);
    player1.mana++;
    player2.mana++;
    player1.refreshGem();
    player2.refreshGem();

    // Draw the three first cards
    for (let i = 0; i < 3; i++) {
        player1.drawCard(player1.deck[i]);
        player2.drawCard(player2.deck[i]);
    }

    // Display cards in hand
    player1.refreshHand();
    player2.refreshHand();
    player1.refreshBoard();
    player2.refreshBoard();
});

    // Ajout du listener pour jouer une carte sur le terrain
    const playerCardsInHand = document.querySelector('.hand-player1');
    // Recherche ID d'une div selectionné pour pouvoir la resortir
    playerCardsInHand.addEventListener('click', event => {
        if (event.target && event.target.classList.value === "card") {
            const dataId = event.target.closest('.card').dataset.id;
            const cardHandToBoard = player1.hand.find(card => card.id == dataId);
            if (player1.useGems(cardHandToBoard.cost)) {
                player1.board.push(cardHandToBoard);
                let newHand = removeFromArray(player1.hand, cardHandToBoard);

                player1.hand = newHand;
                player1.refreshHand();
                player1.refreshBoard();
            } else {
                createPop('Vous ne pouvez pas jouer cette carte, vous n\'avez pas assez de mana.')
            }
        }
    })

    const playerCardsInHand2 = document.querySelector('.hand-player2');

    playerCardsInHand2.addEventListener('click', event => {
        if (event.target && event.target.classList.value === "card") {
            const dataId = event.target.closest('.card').dataset.id;
            const cardHandToBoard = player2.hand.find(card => card.id == dataId);
            player2.board.push(cardHandToBoard);
            let newHand = removeFromArray(player2.hand, cardHandToBoard);

            player2.hand = newHand;
            player2.refreshHand();
            player2.refreshBoard();
        }
    })

    // Ajout du listener pour attaquer une carte adverse
    const playerCardsOnBoard = document.querySelector('.board-player1');
    const enemyCardsOnBoard = document.querySelector('.board-player2');
    const opponent = document.querySelector('#player-' + (turn === 1 ? '2' : '1'));
    
    playerCardsOnBoard.addEventListener('click', event => {
        if (event.target && event.target.classList.value === "card") {
            const dataId = event.target.closest('.card').dataset.id;
            const cardAttacker = player1.board.find(card => card.id == dataId);
            
            enemyCardsOnBoard.addEventListener('click', event => {
                if (event.target && event.target.classList.value === "card") {
                    const dataId = event.target.closest('.card').dataset.id;
                    const cardDefender = player2.board.find(card => card.id == dataId);

                    cardAttacker.attack(cardDefender);
                    player2.refreshBoard();
                }
            })

            opponent.addEventListener('click', event => {
                if (event.target && event.target.dataset.id === "player2") {
                    const dataId = event.target.closest('div').dataset.id;
                    const playerDefender = (dataId === 'player2' ? player2 : player1);
                    
                    if (playerDefender.board.length === 0) {
                        cardAttacker.attack(playerDefender);
                    } else {
                        createPop('Vous ne pouvez pas attaquer votre adversaire, car il lui reste des cartes sur son plateau.');
                    }
                    
                }
            })
        }
    })

// Créer les contraintes de coûts (mana, conditions pour jouer une carte...)

// Créer les fonctions pour récupérer les valeurs