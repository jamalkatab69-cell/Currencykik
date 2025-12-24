import * as THREE from 'three';

export class CollisionSystem {
    constructor(game) {
        this.game = game;
        this.collisionDistance = 0.5;
        this.lastCollisionTime = 0;
        this.collisionCooldown = 100; // ms
    }

    checkCollisions() {
        if (!this.game.player) return;
        
        const playerBox = this.game.player.getBoundingBox();
        const playerPos = this.game.player.getPosition();
        
        // Check obstacles
        this.checkObstacleCollisions(playerBox, playerPos);
        
        // Check collectibles
        this.checkCollectibleCollisions(playerBox, playerPos);
        
        // Check if player fell off
        this.checkFallOff(playerPos);
    }

    checkObstacleCollisions(playerBox, playerPos) {
        for (let i = this.game.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.game.obstacles[i];
            
            // Skip if obstacle is too far
            if (Math.abs(obstacle.position.z - playerPos.z) > 2) continue;
            
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            
            if (playerBox.intersectsBox(obstacleBox)) {
                this.handleObstacleCollision(obstacle);
                return; // Only handle one collision per frame
            }
        }
    }

    checkCollectibleCollisions(playerBox, playerPos) {
        for (let i = this.game.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.game.collectibles[i];
            
            // Skip if already collected
            if (collectible.userData.collected) continue;
            
            // Skip if collectible is too far
            if (Math.abs(collectible.position.z - playerPos.z) > 2) continue;
            
            const collectibleBox = new THREE.Box3().setFromObject(collectible);
            
            if (playerBox.intersectsBox(collectibleBox)) {
                this.handleCollectibleCollision(collectible, i);
            }
        }
    }

    checkFallOff(playerPos) {
        // Check if player has fallen below the platform level
        if (playerPos.y < -2) {
            this.handleFallOff();
        }
        
        // Check if player is on a valid platform
        const playerLane = this.game.player.getLane();
        const playerLaneX = this.game.player.getLanePosition();
        
        let onPlatform = false;
        
        for (const platform of this.game.platforms) {
            // Check if player is near this platform in Z
            const zDist = Math.abs(platform.position.z - playerPos.z);
            if (zDist < 1) {
                // Check if player is on this platform's lane
                const xDist = Math.abs(platform.position.x - playerLaneX);
                if (xDist < 0.5) {
                    onPlatform = true;
                    break;
                }
            }
        }
        
        // If not jumping and not on platform, fall
        if (!onPlatform && !this.game.player.isJumping && playerPos.y <= this.game.player.config.size / 2 + 0.1) {
            // Give a small grace period
            if (!this.fallGracePeriod) {
                this.fallGracePeriod = Date.now();
            } else if (Date.now() - this.fallGracePeriod > 100) {
                this.handleFallOff();
                this.fallGracePeriod = null;
            }
        } else {
            this.fallGracePeriod = null;
        }
    }

    handleObstacleCollision(obstacle) {
        const now = Date.now();
        if (now - this.lastCollisionTime < this.collisionCooldown) return;
        
        this.lastCollisionTime = now;
        
        console.log('💥 Hit obstacle!');
        
        // Player hit effect
        this.game.player?.hit();
        
        // Create explosion effect
        this.createExplosionEffect(obstacle.position);
        
        // Play sound
        this.game.app.audioSystem?.playSFX('crash');
        
        // Vibrate
        this.vibrate(200);
        
        // Screen shake
        this.game.sceneManager?.shakeCamera(0.2, 300);
        
        // Game over
        this.game.gameOver();
    }

    handleCollectibleCollision(collectible, index) {
        if (collectible.userData.collected) return;
        
        collectible.userData.collected = true;
        
        console.log('⭐ Collected!');
        
        // Player collect effect
        this.game.player?.collect();
        
        // Add score
        this.game.addScore(collectible.userData.value);
        
        // Create collect effect
        this.createCollectEffect(collectible.position);
        
        // Play sound
        this.game.app.audioSystem?.playSFX('collect');
        
        // Vibrate briefly
        this.vibrate(50);
        
        // Animate collectible disappearing
        this.animateCollectibleDisappear(collectible, index);
    }

    handleFallOff() {
        console.log('💀 Fell off!');
        
        // Player fall effect
        this.game.player?.hit();
        
        // Play sound
        this.game.app.audioSystem?.playSFX('fall');
        
        // Vibrate
        this.vibrate(300);
        
        // Game over
        this.game.gameOver();
    }

    createExplosionEffect(position) {
        // Create particle burst
        const particleCount = 20;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xff6b6b : 0xffff00,
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.copy(position);
            
            // Random velocity
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                Math.random() * 0.3,
                (Math.random() - 0.5) * 0.3
            );
            
            particle.lifetime = 1000; // ms
            particle.birthTime = Date.now();
            
            this.game.sceneManager.scene.add(particle);
            particles.push(particle);
        }
        
        // Animate particles
        this.animateParticles(particles);
    }

    createCollectEffect(position) {
        // Create sparkle effect
        const sparkleCount = 10;
        const sparkles = [];
        
        for (let i = 0; i < sparkleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 1
            });
            const sparkle = new THREE.Mesh(geometry, material);
            
            sparkle.position.copy(position);
            
            // Spiral velocity
            const angle = (i / sparkleCount) * Math.PI * 2;
            sparkle.velocity = new THREE.Vector3(
                Math.cos(angle) * 0.2,
                0.2,
                Math.sin(angle) * 0.2
            );
            
            sparkle.lifetime = 800;
            sparkle.birthTime = Date.now();
            
            this.game.sceneManager.scene.add(sparkle);
            sparkles.push(sparkle);
        }
        
        this.animateParticles(sparkles);
    }

    animateParticles(particles) {
        const animate = () => {
            const now = Date.now();
            let allDead = true;
            
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                const age = now - particle.birthTime;
                
                if (age < particle.lifetime) {
                    allDead = false;
                    
                    // Update position
                    particle.position.add(particle.velocity.clone().multiplyScalar(0.016));
                    
                    // Apply gravity
                    particle.velocity.y -= 0.01;
                    
                    // Fade out
                    const progress = age / particle.lifetime;
                    particle.material.opacity = 1 - progress;
                    particle.scale.setScalar(1 - progress * 0.5);
                } else {
                    // Remove particle
                    this.game.sceneManager.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                    particles.splice(i, 1);
                }
            }
            
            if (!allDead && particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    animateCollectibleDisappear(collectible, index) {
        const startScale = collectible.scale.clone();
        const startTime = Date.now();
        const duration = 300;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Scale up and fade out
                const scale = 1 + progress * 2;
                collectible.scale.set(scale, scale, scale);
                collectible.material.opacity = 1 - progress;
                
                // Rotate
                collectible.rotation.y += 0.2;
                
                requestAnimationFrame(animate);
            } else {
                // Remove collectible
                this.game.sceneManager.scene.remove(collectible);
                this.game.collectibles.splice(index, 1);
                
                // Dispose
                collectible.geometry.dispose();
                collectible.material.dispose();
            }
        };
        
        animate();
    }

    vibrate(duration) {
        const settings = this.game.app.saveManager?.getSetting('vibration');
        if (settings !== false && navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    // Check if two boxes are colliding
    boxIntersectsBox(box1, box2) {
        return box1.intersectsBox(box2);
    }

    // Get distance between two points
    getDistance(pos1, pos2) {
        return pos1.distanceTo(pos2);
    }
}

export default CollisionSystem;
