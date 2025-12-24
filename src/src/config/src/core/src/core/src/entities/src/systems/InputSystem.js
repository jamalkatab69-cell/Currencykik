export class InputSystem {
    constructor(game) {
        this.game = game;
        this.enabled = false;
        
        // Keyboard state
        this.keys = {};
        this.lastKeyTime = 0;
        this.keyDelay = 150; // ms
        
        // Touch state
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.swipeThreshold = 50; // pixels
        this.tapThreshold = 200; // ms
        
        // Mouse state
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    enable() {
        if (this.enabled) return;
        
        this.enabled = true;
        
        // Keyboard events
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        // Touch events
        window.addEventListener('touchstart', this.onTouchStart, { passive: false });
        window.addEventListener('touchmove', this.onTouchMove, { passive: false });
        window.addEventListener('touchend', this.onTouchEnd);
        
        // Mouse events
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('click', this.onClick);
        
        console.log('⌨️ Input system enabled');
    }

    disable() {
        if (!this.enabled) return;
        
        this.enabled = false;
        
        // Remove keyboard events
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        
        // Remove touch events
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
        
        // Remove mouse events
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClick);
        
        // Clear key states
        this.keys = {};
        
        console.log('⌨️ Input system disabled');
    }

    onKeyDown(event) {
        if (!this.enabled || this.game.isPaused) return;
        
        const now = Date.now();
        if (now - this.lastKeyTime < this.keyDelay) return;
        
        const key = event.key.toLowerCase();
        
        // Prevent default for game keys
        if (['arrowleft', 'arrowright', 'arrowup', ' ', 'a', 'd', 'w'].includes(key)) {
            event.preventDefault();
        }
        
        this.keys[key] = true;
        
        // Handle movement
        if (key === 'arrowleft' || key === 'a') {
            this.game.player?.moveLeft();
            this.lastKeyTime = now;
        } else if (key === 'arrowright' || key === 'd') {
            this.game.player?.moveRight();
            this.lastKeyTime = now;
        } else if (key === 'arrowup' || key === 'w' || key === ' ') {
            this.game.player?.jump();
            this.lastKeyTime = now;
        }
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keys[key] = false;
    }

    onTouchStart(event) {
        if (!this.enabled || this.game.isPaused) return;
        
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
        
        event.preventDefault();
    }

    onTouchMove(event) {
        if (!this.enabled || this.game.isPaused) return;
        
        // Prevent scrolling
        event.preventDefault();
    }

    onTouchEnd(event) {
        if (!this.enabled || this.game.isPaused) return;
        
        const touch = event.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const touchEndTime = Date.now();
        
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        const deltaTime = touchEndTime - this.touchStartTime;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Check for tap (jump)
        if (distance < this.swipeThreshold && deltaTime < this.tapThreshold) {
            // Tap detected - jump
            this.game.player?.jump();
        } else {
            // Swipe detected
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > this.swipeThreshold) {
                    this.game.player?.moveRight();
                } else if (deltaX < -this.swipeThreshold) {
                    this.game.player?.moveLeft();
                }
            } else {
                // Vertical swipe
                if (deltaY < -this.swipeThreshold) {
                    // Swipe up - jump
                    this.game.player?.jump();
                }
            }
        }
    }

    onMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    onClick(event) {
        if (!this.enabled || this.game.isPaused) return;
        
        const screenWidth = window.innerWidth;
        const clickX = event.clientX;
        
        // Divide screen into three zones
        if (clickX < screenWidth / 3) {
            // Left zone
            this.game.player?.moveLeft();
        } else if (clickX > (screenWidth * 2) / 3) {
            // Right zone
            this.game.player?.moveRight();
        } else {
            // Middle zone
            this.game.player?.jump();
        }
    }

    // Check if a key is currently pressed
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    // Get normalized mouse position (-1 to 1)
    getMousePosition() {
        return {
            x: (this.mouseX / window.innerWidth) * 2 - 1,
            y: -(this.mouseY / window.innerHeight) * 2 + 1
        };
    }
}

export default InputSystem;
