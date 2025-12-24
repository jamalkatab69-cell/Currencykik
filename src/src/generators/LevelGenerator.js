import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class LevelGenerator {
    constructor(game) {
        this.game = game;
        this.config = GameConfig;
        
        this.lastPlatformZ = 0;
        this.platformSpacing = this.config.platform.spacing;
        this.colorIndex = 0;
        this.obstacleSpawnRate = this.config.obstacle.spawnChance;
        this.collectibleSpawnRate = this.config.collectible.spawnChance;
        
        // Track generation
        this.platformCount = 0;
        this.difficultyLevel = 0;
    }

    generateInitialLevel() {
        // Generate starting platforms without obstacles
        for (let i = 0; i < 20; i++) {
            const z = -this.platformSpacing * i;
            this.generatePlatform(z, false);
        }
        
        this.lastPlatformZ = -this.platformSpacing * 20;
        console.log('🏗️ Initial level generated');
    }

    update() {
        // Generate new platforms as the player progresses
        const playerZ = this.game.player?.mesh.position.z || 0;
        const threshold = playerZ - 40;
        
        while (this.lastPlatformZ > threshold) {
            this.generatePlatform(this.lastPlatformZ, true);
            this.lastPlatformZ -= this.platformSpacing;
            this.platformCount++;
            
            // Increase difficulty every 50 platforms
            if (this.platformCount % 50 === 0) {
                this.increaseDifficulty();
            }
        }
    }

    generatePlatform(z, includeObstacles = true) {
        // Choose random lanes to place platforms
        const lanes = this.chooseLanes();
        
        lanes.forEach(lane => {
            const platform = this.createPlatform(lane, z);
            this.game.sceneManager.scene.add(platform);
            this.game.platforms.push(platform);
            
            // Add obstacles
            if (includeObstacles && Math.random() < this.obstacleSpawnRate) {
                const obstacle = this.createObstacle(lane, z);
                this.game.sceneManager.scene.add(obstacle);
                this.game.obstacles.push(obstacle);
            }
            
            // Add collectibles
            if (includeObstacles && Math.random() < this.collectibleSpawnRate) {
                const collectible = this.createCollectible(lane, z);
                this.game.sceneManager.scene.add(collectible);
                this.game.collectibles.push(collectible);
            }
        });
    }

    chooseLanes() {
        // Ensure at least one lane is available
        const numLanes = Math.floor(Math.random() * 2) + 1; // 1-2 lanes
        const lanes = [];
        
        for (let i = 0; i < numLanes; i++) {
            let lane;
            do {
                lane = Math.floor(Math.random() * 3); // 0, 1, or 2
            } while (lanes.includes(lane));
            lanes.push(lane);
        }
        
        return lanes;
    }

    createPlatform(lane, z) {
        const geometry = new THREE.BoxGeometry(
            this.config.platform.width,
            this.config.platform.height,
            this.config.platform.length
        );
        
        // Choose color
        const color = this.config.platform.colors[this.colorIndex % this.config.platform.colors.length];
        this.colorIndex++;
        
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        
        const platform = new THREE.Mesh(geometry, material);
        
        // Position platform
        const x = (lane - 1) * this.config.platform.laneWidth;
        const y = this.config.platform.height / 2 - 0.5;
        platform.position.set(x, y, z);
        
        platform.castShadow = true;
        platform.receiveShadow = true;
        
        // Add platform data
        platform.userData = {
            type: 'platform',
            lane: lane
        };
        
        return platform;
    }

    createObstacle(lane, z) {
        const height = THREE.MathUtils.randFloat(
            this.config.obstacle.minHeight,
            this.config.obstacle.maxHeight
        );
        
        const geometry = new THREE.BoxGeometry(
            this.config.obstacle.width,
            height,
            this.config.obstacle.depth
        );
        
        const colorIndex = Math.floor(Math.random() * this.config.obstacle.colors.length);
        const material = new THREE.MeshStandardMaterial({
            color: this.config.obstacle.colors[colorIndex],
            emissive: this.config.obstacle.colors[colorIndex],
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const obstacle = new THREE.Mesh(geometry, material);
        
        // Position obstacle on platform
        const x = (lane - 1) * this.config.platform.laneWidth;
        const y = height / 2;
        obstacle.position.set(x, y, z);
        
        obstacle.castShadow = true;
        obstacle.receiveShadow = true;
        
        // Add glow edges
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        obstacle.add(wireframe);
        
        // Add obstacle data
        obstacle.userData = {
            type: 'obstacle',
            lane: lane
        };
        
        return obstacle;
    }

    createCollectible(lane, z) {
        const geometry = new THREE.OctahedronGeometry(this.config.collectible.size);
        
        const material = new THREE.MeshStandardMaterial({
            color: this.config.collectible.color,
            emissive: this.config.collectible.color,
            emissiveIntensity: 0.8,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const collectible = new THREE.Mesh(geometry, material);
        
        // Position collectible above platform
        const x = (lane - 1) * this.config.platform.laneWidth;
        const y = 1.5;
        collectible.position.set(x, y, z);
        
        collectible.castShadow = true;
        
        // Add glow effect
        const glowGeometry = new THREE.OctahedronGeometry(this.config.collectible.size * 1.2);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.config.collectible.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        collectible.add(glow);
        
        // Add collectible data
        collectible.userData = {
            type: 'collectible',
            lane: lane,
            collected: false,
            value: this.config.collectible.pointValue
        };
        
        return collectible;
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        
        // Increase obstacle spawn rate
        this.obstacleSpawnRate = Math.min(
            this.obstacleSpawnRate + 0.05,
            0.9
        );
        
        // Decrease collectible spawn rate slightly
        this.collectibleSpawnRate = Math.max(
            this.collectibleSpawnRate - 0.02,
            0.15
        );
        
        console.log(`🎯 Difficulty increased to level ${this.difficultyLevel}`);
    }

    reset() {
        this.lastPlatformZ = 0;
        this.platformCount = 0;
        this.difficultyLevel = 0;
        this.colorIndex = 0;
        this.obstacleSpawnRate = this.config.obstacle.spawnChance;
        this.collectibleSpawnRate = this.config.collectible.spawnChance;
    }

    // Generate special patterns
    generatePattern(patternType, z) {
        switch(patternType) {
            case 'zigzag':
                return this.generateZigzagPattern(z);
            case 'jump':
                return this.generateJumpPattern(z);
            case 'collect':
                return this.generateCollectPattern(z);
            default:
                return null;
        }
    }

    generateZigzagPattern(z) {
        // Create a zigzag pattern
        for (let i = 0; i < 5; i++) {
            const lane = i % 2 === 0 ? 0 : 2;
            const platform = this.createPlatform(lane, z - i * this.platformSpacing);
            this.game.sceneManager.scene.add(platform);
            this.game.platforms.push(platform);
        }
    }

    generateJumpPattern(z) {
        // Create platforms with gaps
        for (let i = 0; i < 3; i++) {
            const platform = this.createPlatform(1, z - i * (this.platformSpacing * 2));
            this.game.sceneManager.scene.add(platform);
            this.game.platforms.push(platform);
        }
    }

    generateCollectPattern(z) {
        // Create a line of collectibles
        for (let i = 0; i < 5; i++) {
            const collectible = this.createCollectible(1, z - i * (this.platformSpacing / 2));
            this.game.sceneManager.scene.add(collectible);
            this.game.collectibles.push(collectible);
        }
    }
}

export default LevelGenerator;
