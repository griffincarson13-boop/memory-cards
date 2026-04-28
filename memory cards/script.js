const board = document.getElementById('game-board');
const overlay = document.getElementById('win-overlay');

const shapes = [
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#00f2ff"/></svg>',
    '<svg viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="#ff00ff"/></svg>',
    '<svg viewBox="0 0 100 100"><polygon points="50,15 90,85 10,85" fill="#39ff14"/></svg>',
    '<svg viewBox="0 0 100 100"><path d="M50 15 L85 50 L50 85 L15 50 Z" fill="#ffff00"/></svg>',
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#ff00ff" stroke-width="8" fill="none"/></svg>',
    '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="10" fill="#00f2ff"/></svg>',
    '<svg viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" stroke="#39ff14" stroke-width="5" fill="none"/></svg>',
    '<svg viewBox="0 0 100 100"><path d="M20 20 L80 80 M80 20 L20 80" stroke="#ff00ff" stroke-width="10"/></svg>',
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="#fff"/></svg>',
    '<svg viewBox="0 0 100 100"><rect x="10" y="40" width="80" height="20" fill="#39ff14"/></svg>',
    '<svg viewBox="0 0 100 100"><polygon points="50,20 20,80 80,80" fill="#00f2ff"/></svg>',
    '<svg viewBox="0 0 100 100"><rect x="30" y="10" width="40" height="80" fill="#ff00ff"/></svg>'
];

let flippedCards = [];
let lockBoard = false;
let matchesFound = 0;
let totalPairs = 0;

const winSound = new Audio('win.wav');
const wrongSound = new Audio('wrong.wav');

function startGame(mode) {
    overlay.style.display = 'none';
    let count = 4; 
    if (mode === 'normal') count = 8;
    if (mode === 'hard') count = 12;

    totalPairs = count;
    matchesFound = 0;
    const gameIcons = shapes.slice(0, count);
    const deck = [...gameIcons, ...gameIcons].sort(() => Math.random() - 0.5);
    
    board.style.gridTemplateColumns = `repeat(4, 80px)`;
    board.innerHTML = '';
    flippedCards = [];
    
    deck.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${icon}</div>
        `;
        card.dataset.icon = icon;
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    if (card1.dataset.icon === card2.dataset.icon) {
        matchesFound++;
        card1.classList.add('matched');
        card2.classList.add('matched');
        if (matchesFound === totalPairs) showWin();
        else resetTurn();
    } else {
        setTimeout(() => {
            wrongSound.play();
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetTurn();
        }, 800);
    }
}

function showWin() {
    setTimeout(() => {
        winSound.play();
        overlay.style.display = 'flex';
    }, 500);
}

function closeWin() { startGame('easy'); }
function resetTurn() { [flippedCards, lockBoard] = [[], false]; }

startGame('easy');