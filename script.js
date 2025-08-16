class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };

        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateDisplay();
        this.clearBoard();
    }

    bindEvents() {
        // Bind cell click events
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const cellIndex = parseInt(e.target.dataset.cell);
                this.handleCellClick(cellIndex);
            });
        });

        // Bind button events
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('reset-scores-btn').addEventListener('click', () => {
            this.resetScores();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.hideGameStatus();
            this.newGame();
        });
    }

    handleCellClick(cellIndex) {
        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.board[cellIndex] = this.currentPlayer;
        this.updateCell(cellIndex, this.currentPlayer);

        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
        }
    }

    updateCell(cellIndex, player) {
        const cell = document.querySelector(`[data-cell="${cellIndex}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());

        // Add click animation
        cell.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 100);
    }

    checkWinner() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                // Highlight winning cells
                condition.forEach(index => {
                    const cell = document.querySelector(`[data-cell="${index}"]`);
                    cell.classList.add('winning');
                });
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    handleGameEnd(result) {
        this.gameActive = false;

        if (result === 'win') {
            this.scores[this.currentPlayer]++;
            this.showGameStatus(`${this.currentPlayer} Wins! 🎉`);
        } else if (result === 'draw') {
            this.showGameStatus("It's a Draw! 🤝");
        }

        this.updateScores();
    }

    showGameStatus(message) {
        const statusElement = document.getElementById('game-status');
        const messageElement = document.getElementById('status-message');

        messageElement.textContent = message;
        statusElement.classList.remove('hidden');
    }

    hideGameStatus() {
        document.getElementById('game-status').classList.add('hidden');
    }

    newGame() {
        this.initializeGame();
        this.hideGameStatus();
    }

    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.newGame();
    }

    updateDisplay() {
        // Update turn indicator
        document.getElementById('turn-indicator').textContent = `${this.currentPlayer}'s Turn`;

        // Update active player styling
        document.querySelectorAll('.player').forEach(player => {
            player.classList.remove('active');
        });

        const activePlayerElement = document.querySelector(`.player-${this.currentPlayer.toLowerCase()}`);
        if (activePlayerElement) {
            activePlayerElement.classList.add('active');
        }
    }

    updateScores() {
        document.querySelector('.player-x .player-score').textContent = this.scores.X;
        document.querySelector('.player-o .player-score').textContent = this.scores.O;
    }

    clearBoard() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add some fun sound effects (optional)
function playSound(type) {
    // You can add actual sound files here
    console.log(`Playing ${type} sound`);
}

// Add keyboard support for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('cell')) {
            activeElement.click();
        } else if (activeElement.tagName === 'BUTTON') {
            activeElement.click();
        }
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', (e) => {
    // Prevent double-tap zoom on mobile
    if (e.target.classList.contains('cell')) {
        e.preventDefault();
    }
}, { passive: false });
