class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.musicVolume = 0.3;
        this.soundVolume = 0.6;
        this.musicEnabled = true;
        this.soundEnabled = true;

        this.init();
    }

    init() {
        this.loadSounds();
        this.loadMusic();
        this.createAudioControls();
    }

    loadSounds() {
        // Tic Tac Toe sounds
        this.sounds.placePiece = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.win = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.draw = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.button = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');

        // Tetris sounds
        this.sounds.move = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.rotate = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.drop = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.lineClear = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.gameOver = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.sounds.levelUp = this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }

    loadMusic() {
        // Create simple background music using Web Audio API
        this.music.ticTacToe = this.createBackgroundMusic('tic-tac-toe');
        this.music.tetris = this.createBackgroundMusic('tetris');
    }

    createAudio(base64Data) {
        const audio = new Audio();
        audio.src = base64Data;
        audio.volume = this.soundVolume;
        audio.preload = 'auto';
        return audio;
    }

    createBackgroundMusic(type) {
        const audio = new Audio();

        if (type === 'tic-tac-toe') {
            // Simple chiptune-style music for Tic Tac Toe
            audio.src = this.generateSimpleMusic();
        } else if (type === 'tetris') {
            // Tetris-style music
            audio.src = this.generateTetrisMusic();
        }

        audio.volume = this.musicVolume;
        audio.loop = true;
        audio.preload = 'auto';
        return audio;
    }

    generateSimpleMusic() {
        // Generate a simple musical pattern using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);

        return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    }

    generateTetrisMusic() {
        // Generate Tetris-style music
        return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    }

    createAudioControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'audio-controls';
        controlsContainer.innerHTML = `
            <div class="audio-control-panel">
                <button id="toggle-music" class="audio-btn" title="Toggle Music">
                    🎵
                </button>
                <button id="toggle-sound" class="audio-btn" title="Toggle Sound Effects">
                    🔊
                </button>
                <div class="volume-controls">
                    <label>Music: <input type="range" id="music-volume" min="0" max="100" value="30"></label>
                    <label>Sound: <input type="range" id="sound-volume" min="0" max="100" value="60"></label>
                </div>
            </div>
        `;

        document.body.appendChild(controlsContainer);
        this.bindAudioControls();
    }

    bindAudioControls() {
        const toggleMusic = document.getElementById('toggle-music');
        const toggleSound = document.getElementById('toggle-sound');
        const musicVolume = document.getElementById('music-volume');
        const soundVolume = document.getElementById('sound-volume');

        toggleMusic.addEventListener('click', () => {
            this.musicEnabled = !this.musicEnabled;
            toggleMusic.textContent = this.musicEnabled ? '🎵' : '🔇';
            this.updateMusicState();
        });

        toggleSound.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            toggleSound.textContent = this.soundEnabled ? '🔊' : '🔇';
        });

        musicVolume.addEventListener('input', (e) => {
            this.musicVolume = e.target.value / 100;
            this.updateMusicVolume();
        });

        soundVolume.addEventListener('input', (e) => {
            this.soundVolume = e.target.value / 100;
            this.updateSoundVolume();
        });
    }

    playSound(soundName) {
        if (!this.soundEnabled || !this.sounds[soundName]) return;

        try {
            // Clone the audio to allow multiple simultaneous plays
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.soundVolume;
            sound.play().catch(e => console.log('Sound play failed:', e));
        } catch (e) {
            console.log('Sound play error:', e);
        }
    }

    playMusic(musicName) {
        if (!this.musicEnabled || !this.music[musicName]) return;

        try {
            // Stop any currently playing music
            this.stopAllMusic();

            const music = this.music[musicName];
            music.volume = this.musicVolume;
            music.play().catch(e => console.log('Music play failed:', e));
        } catch (e) {
            console.log('Music play error:', e);
        }
    }

    stopAllMusic() {
        Object.values(this.music).forEach(music => {
            try {
                music.pause();
                music.currentTime = 0;
            } catch (e) {
                console.log('Music stop error:', e);
            }
        });
    }

    updateMusicState() {
        if (this.musicEnabled) {
            // Resume music if it was playing
            Object.values(this.music).forEach(music => {
                if (music.currentTime > 0 && music.paused) {
                    music.play().catch(e => console.log('Music resume failed:', e));
                }
            });
        } else {
            this.stopAllMusic();
        }
    }

    updateMusicVolume() {
        Object.values(this.music).forEach(music => {
            music.volume = this.musicVolume;
        });
    }

    updateSoundVolume() {
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.soundVolume;
        });
    }

    // Game-specific sound methods
    playTicTacToeSounds(action) {
        switch (action) {
            case 'place':
                this.playSound('placePiece');
                break;
            case 'win':
                this.playSound('win');
                break;
            case 'draw':
                this.playSound('draw');
                break;
            case 'button':
                this.playSound('button');
                break;
        }
    }

    playTetrisSounds(action) {
        switch (action) {
            case 'move':
                this.playSound('move');
                break;
            case 'rotate':
                this.playSound('rotate');
                break;
            case 'drop':
                this.playSound('drop');
                break;
            case 'lineClear':
                this.playSound('lineClear');
                break;
            case 'gameOver':
                this.playSound('gameOver');
                break;
            case 'levelUp':
                this.playSound('levelUp');
                break;
        }
    }
}

// Create global sound manager instance
window.soundManager = new SoundManager();
