class Tetris {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next');
        this.nextCtx = this.nextCanvas.getContext('2d');

        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 20;

        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000;

        this.currentPiece = null;
        this.nextPiece = null;

        this.pieces = [
            // I piece
            [[1, 1, 1, 1]],
            // O piece
            [[1, 1], [1, 1]],
            // T piece
            [[0, 1, 0], [1, 1, 1]],
            // S piece
            [[0, 1, 1], [1, 1, 0]],
            // Z piece
            [[1, 1, 0], [0, 1, 1]],
            // J piece
            [[1, 0, 0], [1, 1, 1]],
            // L piece
            [[0, 0, 1], [1, 1, 1]]
        ];

        this.colors = [
            '#00f5ff', // I - Cyan
            '#ffff00', // O - Yellow
            '#a000f0', // T - Purple
            '#00f000', // S - Green
            '#f00000', // Z - Red
            '#0000f0', // J - Blue
            '#ff7f00'  // L - Orange
        ];

        this.init();

        // Start background music
        if (window.soundManager) {
            window.soundManager.playMusic('tetris');
        }

        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            if (window.soundManager && window.soundManager.audioContext) {
                window.soundManager.resumeAudioContext();
            }
        }, { once: true });
    }

    init() {
        this.bindEvents();
        this.generateNewPiece();
        this.draw();
        this.updateDisplay();
        this.checkMobileControls();
    }

    checkMobileControls() {
        // Show/hide mobile controls based on screen size
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            if (window.innerWidth <= 768) {
                mobileControls.style.display = 'block';
            } else {
                mobileControls.style.display = 'none';
            }
        }

        // Listen for window resize
        window.addEventListener('resize', () => {
            if (mobileControls) {
                if (window.innerWidth <= 768) {
                    mobileControls.style.display = 'block';
                } else {
                    mobileControls.style.display = 'none';
                }
            }
        });
    }

    bindEvents() {
        // Button events
        document.getElementById('start-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            this.startGame();
        });
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            this.togglePause();
        });
        document.getElementById('reset-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            this.resetGame();
        });
        document.getElementById('play-again-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            this.resetGame();
        });

        // Mobile control buttons
        document.getElementById('rotate-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            if (this.gameRunning && !this.gamePaused) {
                this.rotatePiece();
            }
        });

        document.getElementById('left-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            if (this.gameRunning && !this.gamePaused) {
                this.movePiece(-1, 0);
            }
        });

        document.getElementById('right-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            if (this.gameRunning && !this.gamePaused) {
                this.movePiece(1, 0);
            }
        });

        document.getElementById('down-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            if (this.gameRunning && !this.gamePaused) {
                this.movePiece(0, 1);
            }
        });

        document.getElementById('drop-btn').addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('button');
            }
            if (this.gameRunning && !this.gamePaused) {
                this.hardDrop();
            }
        });

        // Add touch events for mobile buttons
        const mobileButtons = ['rotate-btn', 'left-btn', 'right-btn', 'down-btn', 'drop-btn'];
        mobileButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    btn.style.transform = 'scale(0.95)';
                    btn.classList.add('pressed');

                    // Add continuous movement for movement buttons
                    if (btnId === 'left-btn' || btnId === 'right-btn' || btnId === 'down-btn') {
                        this.startContinuousMovement(btnId);
                    }
                }, { passive: false });

                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    btn.style.transform = 'scale(1)';
                    btn.classList.remove('pressed');

                    // Stop continuous movement
                    if (btnId === 'left-btn' || btnId === 'right-btn' || btnId === 'down-btn') {
                        this.stopContinuousMovement();
                    }
                }, { passive: false });
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e), { passive: false });
    }

    startContinuousMovement(buttonType) {
        this.stopContinuousMovement(); // Clear any existing interval

        this.continuousMovementInterval = setInterval(() => {
            if (this.gameRunning && !this.gamePaused) {
                switch (buttonType) {
                    case 'left-btn':
                        this.movePiece(-1, 0);
                        break;
                    case 'right-btn':
                        this.movePiece(1, 0);
                        break;
                    case 'down-btn':
                        this.movePiece(0, 1);
                        break;
                }
            }
        }, 150); // Move every 150ms for smooth continuous movement
    }

    stopContinuousMovement() {
        if (this.continuousMovementInterval) {
            clearInterval(this.continuousMovementInterval);
            this.continuousMovementInterval = null;
        }
    }

    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop();
                break;
        }
    }

    handleTouch(e) {
        e.preventDefault();
        if (!this.gameRunning || this.gamePaused) return;

        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        // Simple touch controls
        if (e.type === 'touchstart') {
            this.touchStartX = x;
            this.touchStartY = y;
        } else if (e.type === 'touchend') {
            const deltaX = x - this.touchStartX;
            const deltaY = y - this.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 30) {
                    this.movePiece(1, 0); // Right
                } else if (deltaX < -30) {
                    this.movePiece(-1, 0); // Left
                }
            } else {
                // Vertical swipe
                if (deltaY > 30) {
                    this.movePiece(0, 1); // Down
                } else if (deltaY < -30) {
                    this.rotatePiece(); // Up
                }
            }
        }
    }

    startGame() {
        if (this.gameRunning) return;

        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;

        this.gameLoop();
    }

    togglePause() {
        if (!this.gameRunning) return;

        this.gamePaused = !this.gamePaused;
        document.getElementById('pause-btn').textContent = this.gamePaused ? 'Resume' : 'Pause';

        // Stop continuous movement when paused
        if (this.gamePaused) {
            this.stopContinuousMovement();
        }
    }

    resetGame() {
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000;

        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('pause-btn').textContent = 'Pause';

        // Stop continuous movement
        this.stopContinuousMovement();

        this.generateNewPiece();
        this.draw();
        this.updateDisplay();
        this.hideGameOver();
    }

    gameLoop() {
        if (!this.gameRunning) return;

        if (!this.gamePaused) {
            this.update();
        }

        this.draw();
        this.updateDisplay();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        const now = Date.now();

        if (now - this.dropTime > this.dropInterval) {
            this.dropPiece();
            this.dropTime = now;
        }
    }

    generateNewPiece() {
        if (this.nextPiece === null) {
            this.nextPiece = this.createPiece();
        }

        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();

        // Check if game over
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver();
        }
    }

    createPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        const piece = this.pieces[pieceIndex];

        return {
            shape: piece,
            color: this.colors[pieceIndex],
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2),
            y: 0
        };
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return;

        if (!this.checkCollision(this.currentPiece, this.currentPiece.x + dx, this.currentPiece.y + dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;

            // Play move sound
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('move');
            }
        }
    }

    rotatePiece() {
        if (!this.currentPiece) return;

        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (!this.checkCollision({ ...this.currentPiece, shape: rotated }, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated;

            // Play rotate sound
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('rotate');
            }
        }
    }

    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }

        return rotated;
    }

    dropPiece() {
        if (!this.currentPiece) return;

        if (!this.checkCollision(this.currentPiece, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
        } else {
            this.placePiece();
            this.clearLines();
            this.generateNewPiece();
        }
    }

    hardDrop() {
        if (!this.currentPiece) return;

        while (!this.checkCollision(this.currentPiece, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
        }

        this.placePiece();
        this.clearLines();
        this.generateNewPiece();

        // Play drop sound
        if (window.soundManager) {
            window.soundManager.playTetrisSounds('drop');
        }
    }

    checkCollision(piece, x, y) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;

                    if (newX < 0 || newX >= this.BOARD_WIDTH ||
                        newY >= this.BOARD_HEIGHT ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    placePiece() {
        if (!this.currentPiece) return;

        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;

        for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;

            // Play line clear sound
            if (window.soundManager) {
                window.soundManager.playTetrisSounds('lineClear');
            }

            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

                // Play level up sound
                if (window.soundManager) {
                    window.soundManager.playTetrisSounds('levelUp');
                }
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col, row, this.board[row][col]);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }

        // Draw grid
        this.drawGrid();

        // Draw next piece
        this.drawNextPiece();
    }

    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);

        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, 2);
        this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, 2, this.BLOCK_SIZE);
    }

    drawPiece(piece) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    this.drawBlock(piece.x + col, piece.y + row, piece.color);
                }
            }
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(x * this.BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, y * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        if (this.nextPiece) {
            const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * this.BLOCK_SIZE) / 2;
            const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * this.BLOCK_SIZE) / 2;

            for (let row = 0; row < this.nextPiece.shape.length; row++) {
                for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                    if (this.nextPiece.shape[row][col]) {
                        this.nextCtx.fillStyle = this.nextPiece.color;
                        this.nextCtx.fillRect(
                            offsetX + col * this.BLOCK_SIZE,
                            offsetY + row * this.BLOCK_SIZE,
                            this.BLOCK_SIZE,
                            this.BLOCK_SIZE
                        );
                    }
                }
            }
        }
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }

    gameOver() {
        this.gameRunning = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;

        // Stop continuous movement
        this.stopContinuousMovement();

        // Play game over sound
        if (window.soundManager) {
            window.soundManager.playTetrisSounds('gameOver');
        }

        this.showGameOver();
    }

    showGameOver() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-lines').textContent = this.lines;
        document.getElementById('game-over').classList.remove('hidden');
    }

    hideGameOver() {
        document.getElementById('game-over').classList.add('hidden');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Tetris();
});
