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
                enemy.health = enemy.health <= 0 ? 0 : enemy.health;
                createPop(`${this.name} attaque ${enemy.name} et lui retire ${this.strength} PV.`);
                enemy.refreshHealth();
                /*const newPV = document.querySelector(".player-pv" + enemy.number);
                newPV.innerHTML = enemy.health;*/
                this.hasAttacked = true;
            }
        }
    }

    isAlive() {
        if (this.health > 0) {
            return true;
        } else {
            return false;
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
    new Card(1, 'Perceval', 7, 2, 3, 1, 'images/perceval.webp'),
    new Card(2, 'Arthur', 7, 4, 4, 1, 'images/arthur.jpg'),
    new Card(3, 'Léodagan', 10, 7, 2, 1, 'images/leodagan.webp'),
    new Card(4, 'Duc d\'Aquitaine', 5, 2, 4, 5, 'images/duc-aquitaine.png'),
    new Card(5, 'Lancelot', 4, 8, 3, 5, 'images/lancelot.png'),
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
            endGame((this === player1 ? player2 : player1))
            return false;
        }
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
        const healthPoints = document.querySelector('.player-pv' + this.number);
        healthPoints.innerHTML = this.health;
    }
     
    endTurn() {
        const opponent = (turn === 1 ? player2 : player1);

        if (this.maxMana < 10) {
            this.maxMana++;
        }

        this.mana = this.maxMana;
        this.refreshGem();
        this.board.forEach((card) => card.hasAttacked = false);
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

function turnCardsPlayer2() {
    const cardFront = document.querySelectorAll('.hand-player2 .card-front');
    cardFront.forEach((card) => card.style.transform = 'rotateY(180deg)');
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


// Mise en place du bouton fin de tour
let turn = 1;

const buttonFinish = document.querySelector("#button-finish");

const containerPlayer1 = document.querySelector("#player-1");
const boardContainerPlayer1 = document.querySelector('.board-player1');
const handContainerPlayer1 = document.querySelector('.hand-player1');

const boardContainerPlayer2 = document.querySelector('.board-player2');
const handContainerPlayer2 = document.querySelector('.hand-player2');

buttonFinish.addEventListener("click", function(){
    if (turn == 1) {
        handContainerPlayer1.classList.toggle('no-events');
        boardContainerPlayer1.classList.toggle('no-events');
        turn++;
        buttonFinish.setAttribute("disabled", true);
        player1.endTurn();

        turnContainer.innerHTML = `Tour de ${turn === 1 ? player1.name : player2.name}`
        player2.drawCard();
        turnCardsPlayer2();
        computerTurn();
    } else {
        boardContainerPlayer2.classList.toggle('no-events');
        handContainerPlayer2.classList.toggle('no-events');
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
const turnContainer = document.querySelector('.turn');

let player1;
let player2;

// Button to start the game and shuffle the decks
buttonStart.addEventListener('click', function () {
    startGame.style.display = "none";
    gameBoard.style.display = "block";

    player1 = new Player('Perceval', deck1, 1);
    player2 = new Player('Karadoc', deck2, 2);

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

    turnCardsPlayer2();

    turnContainer.innerHTML = `Tour de ${turn === 1 ? player1.name : player2.name}`
});

// Fin de jeu
function endGame(winner) {
    const boardPlayer1 = document.querySelector('.board-player1');
    const boardPlayer2 = document.querySelector('.board-player2');
    const handPlayer1 = document.querySelector('.hand-player1');
    const handPlayer2 = document.querySelector('.hand-player2');
    
    boardPlayer1.classList.toggle('no-events');
    boardPlayer2.classList.toggle('no-events');
    handPlayer1.classList.toggle('no-events');
    handPlayer2.classList.toggle('no-events');
    buttonFinish.setAttribute("disabled", true);

    const gameBoardEnd = document.querySelector('#game-board');
    const endGame = document.querySelector('.pop-up-container-end-game ');
    endGame.style.backgroundImage = "url('background.webp')";
    endGame.style.display = "flex";
    
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
    engGamePop(`${winner.name} a gagné la partie !`);
    return "";
}



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

/*const playerCardsInHand2 = document.querySelector('.hand-player2');

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
})*/

// Ajout du listener pour attaquer une carte adverse
const playerCardsOnBoard = document.querySelector('.board-player1');
const enemyCardsOnBoard = document.querySelector('.board-player2');
const opponent = document.querySelector('#player-2');

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
                    player2.isAlive();
                } else {
                    createPop('Vous ne pouvez pas attaquer votre adversaire, car il lui reste des cartes sur son plateau.');
                }
                
            }
        })
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function computerTurn() {
    const cardsInHand = player2.hand;
    const cardsOnBoard = player2.board;
    const boardPlayer1 = player1.board;
    let winner;
    
    for (let i = 0; i < cardsInHand.length; i++) {
        if (cardsInHand[i].cost <= player2.mana) {
            console.log('Joue une carte dans 2s');
            await sleep(2000);

            if (player2.useGems(cardsInHand[i].cost)) {
                player2.board.push(cardsInHand[i]);
                let newHand = removeFromArray(cardsInHand, cardsInHand[i]);

                player2.hand = newHand;
                player2.refreshHand();
                turnCardsPlayer2();
                player2.refreshBoard();
            } 
        }
    }

    for (let i = 0; i < cardsOnBoard.length; i++) {
        if (cardsOnBoard[i].hasAttacked === false) {
            if (boardPlayer1.length > 0) {
                randomNumber = Math.floor(Math.random() * boardPlayer1.length);
                console.log('Effectue une attaque dans 2s');
                await sleep(2000);
                cardsOnBoard[i].attack(boardPlayer1[randomNumber]);
                player1.refreshBoard(); 
            } else {
                console.log('Effectue une attaque dans 2s');
                await sleep(2000);
                cardsOnBoard[i].attack(player1);
                player1.refreshHealth();
                if (player1.isAlive() === false) {
                    winner = player2.name;
                    break;
                }              
            }
        }
    }

    if (typeof winner === 'string') {
        handContainerPlayer1.classList.toggle('no-events');
        boardContainerPlayer1.classList.toggle('no-events');
        
    } else {
        turn--;
        handContainerPlayer1.classList.toggle('no-events');
        boardContainerPlayer1.classList.toggle('no-events');
        player2.endTurn();

        
        console.log('Joueur 1 pioche dans 2s');
        await sleep(2000);
        turnContainer.innerHTML = `Tour de ${turn === 1 ? player1.name : player2.name}`
        buttonFinish.removeAttribute("disabled");
        player1.drawCard();
    }
    
}

/*const colors = [ '#ffc000', '#ff3b3b', '#ff8400' ];
const bubbles = 25;

const explode = (x, y) => {
    let particles = [];
    let ratio = window.devicePixelRatio;
    let c = document.createElement('canvas');
    let ctx = c.getContext('2d');

    c.style.position = 'absolute';
    c.style.left = (x - 100) + 'px';
    c.style.top = (y - 100) + 'px';
    c.style.pointerEvents = 'none';
    c.style.width = 200 + 'px';
    c.style.height = 200 + 'px';
    c.style.zIndex = 100;
    c.width = 200 * ratio;
    c.height = 200 * ratio;
    document.body.appendChild(c);

    for(var i = 0; i < bubbles; i++) {
        particles.push({
            x: c.width / 2,
            y: c.height / 2,
            radius: r(20, 30),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: r(0, 360, true),
            speed: r(8, 12),
            friction: 0.9,
            opacity: r(0, 0.5, true),
            yVel: 0,
            gravity: 0.1
        });
    }

    render(particles, ctx, c.width, c.height);
    setTimeout(() => document.body.removeChild(c), 1000);
}

const render = (particles, ctx, width, height) => {
    requestAnimationFrame(() => render(particles, ctx, width, height));
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
        p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
        p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

        p.opacity -= 0.01;
        p.speed *= p.friction;
        p.radius *= p.friction;
        p.yVel += p.gravity;
        p.y += p.yVel;

        if(p.opacity < 0 || p.radius < 0) return;

        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    });

    return ctx;
}

const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));

document.querySelector(".card").addEventListener('click', e => explode(e.pageX, e.pageY));*/

function createPop(message) {
    const popUp = document.querySelector(".pop-up-container");

    while(popUp.firstChild) {
        popUp.removeChild(popUp.firstChild);
    }

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

    setTimeout(() => popUp.removeChild(popUp.firstChild), 3000);
}

function engGamePop(message) {
    const textWinner = document.querySelector(".text-winner");
    textWinner.innerHTML= message;
    

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

