import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.config = GameConfig.player;
        this.platformConfig = GameConfig.platform;
        
        // Player properties
        this.mesh = null;
        this.currentLane = 1; // Middle lane (0, 1, 2)
        this.targetX = 0;
        this.isJumping = false;
        this.isMoving = false;
        this.velocity = new THREE.Vector3();
        
        // Animation
        this.rotationSpeed = 0.1;
        this.scale = 1;
        this.targetScale = 1;
        
        this.create();
    }

    create() {
        // Create player geometry (cube for now, can be replaced with more complex shape)
        const geometry = new THREE.BoxGeometry(
            this.config.size,
            this.config.size,
            this.config.size
        );
        
        // Create material with glow effect
        const material = new THREE.MeshStandardMaterial({
            color: this.config.color,
            emissive: this.config.color,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.4
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;
        
        // Initial position
        this.mesh.position.set(0, this.config.size / 2, 0);
        
        // Add edge glow
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.mesh.add(edges);
        
        console.log('✅ Player created');
    }

    update(deltaTime) {
        // Smooth movement to target lane
        const currentX = this.mesh.position.x;
        const laneX = (this.currentLane - 1) * this.platformConfig.laneWidth;
        
        if (Math.abs(currentX - laneX) > 0.01) {
            const direction = laneX > currentX ? 1 : -1;
            this.mesh.position.x += direction * this.config.moveSpeed * deltaTime * 60;
            
            // Clamp to target
            if (Math.abs(this.mesh.position.x - laneX) < 0.1) {
                this.mesh.position.x = laneX;
                this.isMoving = false;
            }
        }
        
        // Apply gravity
        if (this.mesh.position.y > this.config.size / 2) {
            this.velocity.y += this.config.gravity * deltaTime * 60;
            this.mesh.position.y += this.velocity.y * deltaTime;
            
            // Prevent going below ground
            if (this.mesh.position.y <= this.config.size / 2) {
                this.mesh.position.y = this.config.size / 2;
                this.velocity.y = 0;
                this.isJumping = false;
                
                // Landing effect
                this.landEffect();
            }
        }
        
        // Rotation animation
        this.mesh.rotation.y += this.rotationSpeed * deltaTime;
        
        // Scale animation
        if (Math.abs(this.mesh.scale.x - this.targetScale) > 0.01) {
            this.mesh.scale.lerp(
                new THREE.Vector3(this.targetScale, this.targetScale, this.targetScale),
                0.1
            );
        }
        
        // Pulse effect
        const pulse = Math.sin(Date.now() * 0.005) * 0.05 + 1;
        this.mesh.material.emissiveIntensity = 0.5 + pulse * 0.2;
    }

    moveLeft() {
        if (this.isMoving) return;
        if (this.currentLane > 0) {
            this.currentLane--;
            this.isMoving = true;
            this.rotateEffect(-1);
            this.playMoveSFX();
        }
    }

    moveRight() {
        if (this.isMoving) return;
        if (this.currentLane < 2) {
            this.currentLane++;
            this.isMoving = true;
            this.rotateEffect(1);
            this.playMoveSFX();
        }
    }

    jump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.velocity.y = this.config.jumpHeight;
        this.playJumpSFX();
        
        // Jump effect
        this.targetScale = 1.2;
        setTimeout(() => {
            this.targetScale = 1;
        }, 200);
    }

    rotateEffect(direction) {
        // Add rotation effect when moving
        const targetRotation = this.mesh.rotation.z + (direction * Math.PI * 0.2);
        const currentRotation = this.mesh.rotation.z;
        
        const animate = () => {
            if (Math.abs(this.mesh.rotation.z - currentRotation) < Math.abs(targetRotation - currentRotation)) {
                this.mesh.rotation.z += direction * 0.1;
                requestAnimationFrame(animate);
            } else {
                // Reset rotation
                setTimeout(() => {
                    const resetAnim = () => {
                        if (Math.abs(this.mesh.rotation.z) > 0.01) {
                            this.mesh.rotation.z *= 0.9;
                            requestAnimationFrame(resetAnim);
                        } else {
                            this.mesh.rotation.z = 0;
                        }
                    };
                    resetAnim();
                }, 100);
            }
        };
        animate();
    }

    landEffect() {
        // Squash effect on landing
        this.targetScale = 0.8;
        setTimeout(() => {
            this.targetScale = 1;
        }, 100);
    }

    collect() {
        // Collection effect
        this.targetScale = 1.3;
        
        // Flash effect
        const originalColor = this.mesh.material.color.clone();
        this.mesh.material.color.set(0xffd700);
        this.mesh.material.emissiveIntensity = 1.5;
        
        setTimeout(() => {
            this.mesh.material.color.copy(originalColor);
            this.mesh.material.emissiveIntensity = 0.5;
            this.targetScale = 1;
        }, 200);
    }

    hit() {
        // Hit effect
        this.mesh.material.color.set(0xff0000);
        this.mesh.material.emissiveIntensity = 2;
        
        // Shake effect
        const originalPosition = this.mesh.position.clone();
        let shakeCount = 0;
        
        const shakeInterval = setInterval(() => {
            this.mesh.position.x = originalPosition.x + (Math.random() - 0.5) * 0.2;
            this.mesh.position.y = originalPosition.y + (Math.random() - 0.5) * 0.2;
            
            shakeCount++;
            if (shakeCount > 10) {
                clearInterval(shakeInterval);
                this.mesh.position.copy(originalPosition);
                this.mesh.material.color.set(this.config.color);
                this.mesh.material.emissiveIntensity = 0.5;
            }
        }, 50);
    }

    reset() {
        this.mesh.position.set(0, this.config.size / 2, 0);
        this.mesh.rotation.set(0, 0, 0);
        this.mesh.scale.set(1, 1, 1);
        this.currentLane = 1;
        this.targetX = 0;
        this.isJumping = false;
        this.isMoving = false;
        this.velocity.set(0, 0, 0);
        this.targetScale = 1;
        
        // Reset material
        this.mesh.material.color.set(this.config.color);
        this.mesh.material.emissiveIntensity = 0.5;
    }

    playMoveSFX() {
        this.game.app.audioSystem?.playSFX('move');
    }

    playJumpSFX() {
        this.game.app.audioSystem?.playSFX('jump');
    }

    // Getters
    getPosition() {
        return this.mesh.position.clone();
    }

    getBoundingBox() {
        const box = new THREE.Box3().setFromObject(this.mesh);
        return box;
    }

    getLane() {
        return this.currentLane;
    }

    getLanePosition() {
        return (this.currentLane - 1) * this.platformConfig.laneWidth;
    }
}

export default Player;
