const cards = [
    '🍎', '🍎',
    '🍌', '🍌',
    '🍇', '🍇',
    '🍉', '🍉',
    '🍓', '🍓',
    '🍍', '🍍',
    '🍊', '🍊',
    '🍒', '🍒'
];

let cardElements = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0; // めくった回数
const maxAttempts = 30; // 最大めくり回数
let clearCount = 0; // クリア回数

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // 既存のカードをクリア
    shuffle(cards);
    
    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-card', card);
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
        cardElements.push(cardElement);
    });

    updateStatus();
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped') || attempts >= maxAttempts) return;

    this.classList.add('flipped');
    this.innerText = this.getAttribute('data-card');
    attempts++;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }

    updateStatus();
}

function checkForMatch() {
    if (firstCard.getAttribute('data-card') === secondCard.getAttribute('data-card')) {
        matches++;
        resetCards();
        if (matches === cards.length / 2) {
            clearCount++;
            setTimeout(() => {
                alert(`ゲーム終了！勝ちました！\n連続クリア回数: ${clearCount}`);
                resetGame();
            }, 500);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = '';
            secondCard.innerText = '';
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function resetGame() {
    attempts = 0;
    matches = 0;
    cardElements.forEach(card => {
        card.classList.remove('flipped');
        card.innerText = '';
    });
    createBoard(); // カードの内容を再作成
    updateStatus();
}

function updateStatus() {
    const status = document.getElementById('status');
    status.innerText = `めくった回数: ${attempts} / ${maxAttempts}`;
    
    if (attempts >= maxAttempts) {
        alert(`ゲームオーバー！最大めくり回数に達しました。連続クリア回数: ${clearCount}`);
        resetGame(); // ゲームをリセット
    }
}

document.getElementById('reset-button').addEventListener('click', resetGame);

createBoard();
