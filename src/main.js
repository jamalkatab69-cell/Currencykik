import * as THREE from 'three';
import { Game } from './core/Game.js';
import { UIManager } from './managers/UIManager.js';
import { AssetManager } from './managers/AssetManager.js';
import { SaveManager } from './managers/SaveManager.js';
import { AudioSystem } from './systems/AudioSystem.js';

class GameApp {
    constructor() {
        this.game = null;
        this.uiManager = null;
        this.assetManager = null;
        this.saveManager = null;
        this.audioSystem = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Initialize managers
            this.assetManager = new AssetManager();
            this.saveManager = new SaveManager();
            this.audioSystem = new AudioSystem();
            this.uiManager = new UIManager(this);

            // Show loading screen
            this.uiManager.showScreen('loading');

            // Load assets
            await this.loadAssets();

            // Initialize game
            this.game = new Game(this);
            await this.game.init();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize audio
            this.audioSystem.init();

            this.isInitialized = true;

            // Hide loading screen and show main menu
            setTimeout(() => {
                this.uiManager.hideScreen('loading');
                this.uiManager.showScreen('main-menu');
                this.updateBestScore();
            }, 500);

            console.log('✅ Game initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showError('فشل تحميل اللعبة. يرجى تحديث الصفحة.');
        }
    }

    async loadAssets() {
        const assets = [
            { type: 'texture', name: 'particle', url: '/assets/textures/particle.png' },
            { type: 'texture', name: 'glow', url: '/assets/textures/glow.png' }
        ];

        const totalAssets = assets.length;
        let loadedAssets = 0;

        for (const asset of assets) {
            try {
                await this.assetManager.load(asset.type, asset.name, asset.url);
                loadedAssets++;
                this.updateLoadingProgress((loadedAssets / totalAssets) * 100);
            } catch (error) {
                console.warn(`Failed to load ${asset.name}:`, error);
            }
        }
    }

    updateLoadingProgress(percent) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
    }

    setupEventListeners() {
        // Play button
        document.getElementById('play-btn')?.addEventListener('click', () => {
            this.startGame();
        });

        // Settings button
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.uiManager.showScreen('settings-menu');
        });

        // Pause button
        document.getElementById('pause-btn')?.addEventListener('click', () => {
            this.pauseGame();
        });

        // Resume button
        document.getElementById('resume-btn')?.addEventListener('click', () => {
            this.resumeGame();
        });

        // Restart button
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.restartGame();
        });

        // Retry button
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.restartGame();
        });

        // Menu buttons
        document.getElementById('menu-btn')?.addEventListener('click', () => {
            this.returnToMenu();
        });

        document.getElementById('home-btn')?.addEventListener('click', () => {
            this.returnToMenu();
        });

        // Settings back button
        document.getElementById('settings-back-btn')?.addEventListener('click', () => {
            this.uiManager.hideScreen('settings-menu');
            this.uiManager.showScreen('main-menu');
        });

        // Settings toggles
        document.getElementById('music-toggle')?.addEventListener('change', (e) => {
            this.audioSystem.setMusicEnabled(e.target.checked);
        });

        document.getElementById('sfx-toggle')?.addEventListener('change', (e) => {
            this.audioSystem.setSFXEnabled(e.target.checked);
        });

        document.getElementById('vibration-toggle')?.addEventListener('change', (e) => {
            this.saveManager.setSetting('vibration', e.target.checked);
        });

        document.getElementById('quality-select')?.addEventListener('change', (e) => {
            this.game?.setQuality(e.target.value);
            this.saveManager.setSetting('quality', e.target.value);
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.game?.isPlaying) {
                    this.pauseGame();
                }
            }
        });

        // Visibility change (pause when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.game?.isPlaying) {
                this.pauseGame();
            }
        });

        // Touch controls for mobile
        this.setupTouchControls();
    }

    setupTouchControls() {
        const canvas = document.getElementById('game-canvas');
        let touchStartX = 0;

        canvas.addEventListener('touchstart', (e) => {
            if (this.game?.isPlaying) {
                touchStartX = e.touches[0].clientX;
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (this.game?.isPlaying) {
                e.preventDefault();
                const touchX = e.touches[0].clientX;
                const deltaX = touchX - touchStartX;
                
                if (Math.abs(deltaX) > 30) {
                    if (deltaX > 0) {
                        this.game.player?.moveRight();
                    } else {
                        this.game.player?.moveLeft();
                    }
                    touchStartX = touchX;
                }
            }
        }, { passive: false });
    }

    startGame() {
        this.uiManager.hideScreen('main-menu');
        this.uiManager.showScreen('game-ui');
        this.game?.start();
        this.audioSystem.playMusic('gameplay');
    }

    pauseGame() {
        this.game?.pause();
        this.uiManager.showScreen('pause-menu');
        this.audioSystem.pauseMusic();
    }

    resumeGame() {
        this.game?.resume();
        this.uiManager.hideScreen('pause-menu');
        this.audioSystem.resumeMusic();
    }

    restartGame() {
        this.uiManager.hideAllScreens();
        this.uiManager.showScreen('game-ui');
        this.game?.restart();
        this.audioSystem.playMusic('gameplay');
    }

    returnToMenu() {
        this.game?.stop();
        this.uiManager.hideAllScreens();
        this.uiManager.showScreen('main-menu');
        this.updateBestScore();
        this.audioSystem.playMusic('menu');
    }

    gameOver(score) {
        const bestScore = this.saveManager.getBestScore();
        const isNewRecord = score > bestScore;

        if (isNewRecord) {
            this.saveManager.setBestScore(score);
            document.getElementById('new-record')?.classList.remove('hidden');
        } else {
            document.getElementById('new-record')?.classList.add('hidden');
        }

        document.getElementById('final-score').textContent = score;
        
        this.uiManager.hideScreen('game-ui');
        this.uiManager.showScreen('gameover-screen');
        
        this.audioSystem.stopMusic();
        this.audioSystem.playSFX('gameover');
    }

    updateScore(score) {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = score;
            scoreElement.classList.add('score-update');
            setTimeout(() => {
                scoreElement.classList.remove('score-update');
            }, 300);
        }
    }

    updateSpeed(speed) {
        const speedElement = document.getElementById('speed-value');
        if (speedElement) {
            speedElement.textContent = speed.toFixed(1) + 'x';
        }
    }

    updateBestScore() {
        const bestScore = this.saveManager.getBestScore();
        document.getElementById('best-score-value').textContent = bestScore;
    }

    showError(message) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
            loadingText.style.color = '#ff6b6b';
        }
    }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gameApp = new GameApp();
    });
} else {
    window.gameApp = new GameApp();
}

export { GameApp };
