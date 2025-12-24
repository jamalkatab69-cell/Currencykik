import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { SceneManager } from './SceneManager.js';
import { Player } from '../entities/Player.js';
import { InputSystem } from '../systems/InputSystem.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { LevelGenerator } from '../generators/LevelGenerator.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { EffectsManager } from '../managers/EffectsManager.js';

export class Game {
    constructor(app) {
        this.app = app;
        this.config = GameConfig;
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.isGameOver = false;
        
        // Core systems
        this.sceneManager = null;
        this.player = null;
        this.inputSystem = null;
        this.physicsSystem = null;
        this.collisionSystem = null;
        this.scoreSystem = null;
        this.levelGenerator = null;
        this.particleSystem = null;
        this.effectsManager = null;
        
        // Game variables
        this.speed = this.config.game.initialSpeed;
        this.distance = 0;
        this.platforms = [];
        this.obstacles = [];
        this.collectibles = [];
        
        // Animation
        this.animationId = null;
        this.lastTime = 0;
        this.deltaTime = 0;
    }

    async init() {
        try {
            // Initialize scene manager
            this.sceneManager = new SceneManager();
            await this.sceneManager.init();
            
            // Initialize systems
            this.inputSystem = new InputSystem(this);
            this.physicsSystem = new PhysicsSystem(this);
            this.collisionSystem = new CollisionSystem(this);
            this.scoreSystem = new ScoreSystem(this);
            this.particleSystem = new ParticleSystem(this);
            this.effectsManager = new EffectsManager(this);
            
            // Initialize level generator
            this.levelGenerator = new LevelGenerator(this);
            
            // Create player
            this.player = new Player(this);
            this.sceneManager.scene.add(this.player.mesh);
            
            // Generate initial platforms
            this.levelGenerator.generateInitialLevel();
            
            // Setup window resize handler
            window.addEventListener('resize', () => this.onWindowResize());
            
            console.log('✅ Game core initialized');
        } catch (error) {
            console.error('❌ Failed to initialize game core:', error);
            throw error;
        }
    }

    start() {
        if (this.isPlaying) return;
        
        this.reset();
        this.isPlaying = true;
        this.isPaused = false;
        this.isGameOver = false;
        
        this.inputSystem.enable();
        this.animate(0);
        
        console.log('🎮 Game started');
    }

    pause() {
        if (!this.isPlaying || this.isPaused) return;
        
        this.isPaused = true;
        this.inputSystem.disable();
        
        console.log('⏸ Game paused');
    }

    resume() {
        if (!this.isPlaying || !this.isPaused) return;
        
        this.isPaused = false;
        this.inputSystem.enable();
        this.lastTime = performance.now();
        
        console.log('▶ Game resumed');
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.inputSystem.disable();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        console.log('⏹ Game stopped');
    }

    restart() {
        this.stop();
        this.start();
    }

    reset() {
        // Reset game state
        this.speed = this.config.game.initialSpeed;
        this.distance = 0;
        
        // Reset player
        this.player.reset();
        
        // Clear all entities
        this.clearEntities();
        
        // Reset systems
        this.scoreSystem.reset();
        this.levelGenerator.reset();
        
        // Generate new level
        this.levelGenerator.generateInitialLevel();
        
        console.log('🔄 Game reset');
    }

    animate(currentTime) {
        if (!this.isPlaying) return;
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (this.isPaused || this.deltaTime > 0.1) {
            return;
        }
        
        this.update(this.deltaTime);
        this.render();
    }

    update(deltaTime) {
        // Update player
        this.player.update(deltaTime);
        
        // Update physics
        this.physicsSystem.update(deltaTime);
        
        // Move world
        this.moveWorld(deltaTime);
        
        // Check collisions
        this.collisionSystem.checkCollisions();
        
        // Update systems
        this.particleSystem.update(deltaTime);
        this.effectsManager.update(deltaTime);
        
        // Generate new platforms
        this.levelGenerator.update();
        
        // Update game speed
        this.updateSpeed();
        
        // Update distance
        this.distance += this.speed * deltaTime * 100;
        
        // Update UI
        this.app.updateSpeed(1 + (this.speed - this.config.game.initialSpeed) * 5);
    }

    moveWorld(deltaTime) {
        const moveAmount = this.speed * deltaTime * 60;
        
        // Move platforms
        for (let i = this.platforms.length - 1; i >= 0; i--) {
            const platform = this.platforms[i];
            platform.position.z += moveAmount;
            
            // Remove platforms that are behind the player
            if (platform.position.z > 5) {
                this.sceneManager.scene.remove(platform);
                this.platforms.splice(i, 1);
            }
        }
        
        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.position.z += moveAmount;
            
            // Remove obstacles that are behind the player
            if (obstacle.position.z > 5) {
                this.sceneManager.scene.remove(obstacle);
                this.obstacles.splice(i, 1);
            }
        }
        
        // Move collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            collectible.position.z += moveAmount;
            collectible.rotation.y += 0.05;
            
            // Remove collectibles that are behind the player
            if (collectible.position.z > 5) {
                this.sceneManager.scene.remove(collectible);
                this.collectibles.splice(i, 1);
            }
        }
    }

    updateSpeed() {
        // Gradually increase speed
        if (this.speed < this.config.game.maxSpeed) {
            this.speed += this.config.game.speedIncrement;
        }
    }

    render() {
        this.sceneManager.render();
    }

    gameOver() {
        if (this.isGameOver) return;
        
        this.isGameOver = true;
        this.isPlaying = false;
        
        // Get final score
        const finalScore = this.scoreSystem.getScore();
        
        // Trigger game over in app
        this.app.gameOver(finalScore);
        
        // Play game over effects
        this.effectsManager.playGameOverEffect();
        
        console.log('💀 Game Over - Score:', finalScore);
    }

    clearEntities() {
        // Clear platforms
        this.platforms.forEach(platform => {
            this.sceneManager.scene.remove(platform);
        });
        this.platforms = [];
        
        // Clear obstacles
        this.obstacles.forEach(obstacle => {
            this.sceneManager.scene.remove(obstacle);
        });
        this.obstacles = [];
        
        // Clear collectibles
        this.collectibles.forEach(collectible => {
            this.sceneManager.scene.remove(collectible);
        });
        this.collectibles = [];
    }

    addScore(points) {
        this.scoreSystem.addScore(points);
        this.app.updateScore(this.scoreSystem.getScore());
    }

    onWindowResize() {
        this.sceneManager.onWindowResize();
    }

    setQuality(quality) {
        this.sceneManager.setQuality(quality);
    }

    // Getters
    getSpeed() {
        return this.speed;
    }

    getDistance() {
        return this.distance;
    }

    getScore() {
        return this.scoreSystem.getScore();
    }
}

export default Game;
