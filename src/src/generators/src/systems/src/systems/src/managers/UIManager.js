export class UIManager {
    constructor(app) {
        this.app = app;
        this.screens = {};
        this.currentScreen = null;
        
        this.init();
    }

    init() {
        // Get all screen elements
        this.screens = {
            'loading': document.getElementById('loading-screen'),
            'main-menu': document.getElementById('main-menu'),
            'game-ui': document.getElementById('game-ui'),
            'pause-menu': document.getElementById('pause-menu'),
            'gameover-screen': document.getElementById('gameover-screen'),
            'settings-menu': document.getElementById('settings-menu')
        };
    }

    showScreen(screenName) {
        const screen = this.screens[screenName];
        if (!screen) {
            console.warn(`Screen ${screenName} not found`);
            return;
        }

        screen.classList.add('active');
        this.currentScreen = screenName;
        
        // Add animation
        screen.style.animation = 'fadeIn 0.3s ease-out';
    }

    hideScreen(screenName) {
        const screen = this.screens[screenName];
        if (!screen) return;

        screen.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            screen.classList.remove('active');
        }, 300);
    }

    hideAllScreens() {
        Object.keys(this.screens).forEach(screenName => {
            this.hideScreen(screenName);
        });
    }

    toggleScreen(screenName) {
        const screen = this.screens[screenName];
        if (!screen) return;

        if (screen.classList.contains('active')) {
            this.hideScreen(screenName);
        } else {
            this.showScreen(screenName);
        }
    }
}

export default UIManager;
