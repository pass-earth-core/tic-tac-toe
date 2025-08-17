class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.musicVolume = 0.3;
        this.soundVolume = 0.6;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.audioContext = null;
        this.musicNodes = {};
        this.currentMusic = null;

        this.init();
    }

    init() {
        this.initAudioContext();
        this.loadSounds();
        this.loadMusic();
        this.createAudioControls();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Resume audio context on user interaction (required by browsers)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    loadSounds() {
        // Create actual playable sounds using Web Audio API
        this.sounds.placePiece = this.createBeepSound(800, 0.1, 'sine');
        this.sounds.win = this.createBeepSound(1200, 0.3, 'square');
        this.sounds.draw = this.createBeepSound(600, 0.2, 'triangle');
        this.sounds.button = this.createBeepSound(400, 0.1, 'sine');

        // Tetris sounds
        this.sounds.move = this.createBeepSound(300, 0.05, 'sine');
        this.sounds.rotate = this.createBeepSound(500, 0.1, 'square');
        this.sounds.drop = this.createBeepSound(200, 0.15, 'sawtooth');
        this.sounds.lineClear = this.createBeepSound(1000, 0.2, 'square');
        this.sounds.gameOver = this.createBeepSound(150, 0.4, 'sawtooth');
        this.sounds.levelUp = this.createBeepSound(800, 0.3, 'triangle');
    }

    createBeepSound(frequency, duration, type = 'sine') {
        return {
            frequency: frequency,
            duration: duration,
            type: type,
            play: () => this.playBeepSound(frequency, duration, type)
        };
    }

    playBeepSound(frequency, duration, type) {
        if (!this.audioContext || !this.soundEnabled) return;

        try {
            this.resumeAudioContext();

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Sound play error:', e);
        }
    }

    loadMusic() {
        this.music.ticTacToe = this.createTicTacToeMusic();
        this.music.tetris = this.createTetrisMusic();
    }

    createTicTacToeMusic() {
        return {
            play: () => this.playTicTacToeMusic(),
            stop: () => this.stopMusic('ticTacToe'),
            setVolume: (volume) => this.setMusicVolume('ticTacToe', volume)
        };
    }

    createTetrisMusic() {
        return {
            play: () => this.playTetrisMusic(),
            stop: () => this.stopMusic('tetris'),
            setVolume: (volume) => this.setMusicVolume('tetris', volume)
        };
    }

    playTicTacToeMusic() {
        if (!this.audioContext || !this.musicEnabled) return;

        try {
            this.resumeAudioContext();
            this.stopMusic('ticTacToe');

            // Canon in D inspired melody - peaceful and elegant
            const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // C4, D4, E4, F4, G4, A4, B4, C5
            const pattern = [0, 1, 2, 1, 0, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, 0];
            let currentNote = 0;

            const playNote = () => {
                if (!this.musicEnabled) return;

                const frequency = notes[pattern[currentNote]];
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                oscillator.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // Create a more piano-like sound
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                oscillator.type = 'triangle';

                // Add filter for warmth
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
                filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);

                // Smooth envelope
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.15, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.6);

                currentNote = (currentNote + 1) % pattern.length;

                if (this.musicEnabled) {
                    setTimeout(playNote, 600);
                }
            };

            playNote();
            this.musicNodes.ticTacToe = { playNote, interval: null };
        } catch (e) {
            console.log('Music play error:', e);
        }
    }

    playTetrisMusic() {
        if (!this.audioContext || !this.musicEnabled) return;

        try {
            this.resumeAudioContext();
            this.stopMusic('tetris');

            // Mozart-inspired classical piece - elegant and engaging
            const notes = [220, 246, 277, 293, 330, 369, 415, 440, 493, 554]; // A3 to C#5
            const pattern = [0, 2, 4, 2, 0, 1, 3, 5, 4, 2, 0, 2, 4, 6, 5, 3, 1, 0];
            let currentNote = 0;

            const playNote = () => {
                if (!this.musicEnabled) return;

                const frequency = notes[pattern[currentNote]];
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                oscillator.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // Create a classical piano sound
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                oscillator.type = 'triangle';

                // Add filter for classical warmth
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2500, this.audioContext.currentTime);
                filter.Q.setValueAtTime(0.3, this.audioContext.currentTime);

                // Elegant envelope
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.12, this.audioContext.currentTime + 0.03);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);

                currentNote = (currentNote + 1) % pattern.length;

                if (this.musicEnabled) {
                    setTimeout(playNote, 500);
                }
            };

            playNote();
            this.musicNodes.tetris = { playNote, interval: null };
        } catch (e) {
            console.log('Music play error:', e);
        }
    }

    stopMusic(musicName) {
        if (this.musicNodes[musicName]) {
            this.musicNodes[musicName] = null;
        }
    }

    setMusicVolume(musicName, volume) {
        // Volume is handled in the playNote functions
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
            console.log('Playing sound:', soundName);
            this.sounds[soundName].play();
        } catch (e) {
            console.log('Sound play error:', e);
        }
    }

    playMusic(musicName) {
        if (!this.musicEnabled || !this.music[musicName]) return;

        try {
            console.log('Playing music:', musicName);
            this.stopAllMusic();
            this.currentMusic = musicName;
            this.music[musicName].play();
        } catch (e) {
            console.log('Music play error:', e);
        }
    }

    // Method to restart music when re-enabled
    restartMusic(musicName) {
        if (this.musicEnabled && this.music[musicName]) {
            this.music[musicName].play();
        }
    }

    stopAllMusic() {
        Object.keys(this.musicNodes).forEach(musicName => {
            this.stopMusic(musicName);
        });
    }

    updateMusicState() {
        if (this.musicEnabled) {
            // Restart music when re-enabled
            if (this.currentMusic) {
                this.restartMusic(this.currentMusic);
            }
        } else {
            this.stopAllMusic();
        }
    }

    updateMusicVolume() {
        // Volume is handled in the playNote functions
    }

    updateSoundVolume() {
        // Volume is handled in the playBeepSound function
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
            case 'button':
                this.playSound('button');
                break;
        }
    }
}

// Initialize sound manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.soundManager = new SoundManager();
});
