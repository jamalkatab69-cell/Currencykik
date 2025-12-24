import * as THREE from 'three';

export class EffectsManager {
    constructor(game) {
        this.game = game;
        this.activeEffects = [];
    }

    update(deltaTime) {
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            if (effect.update(deltaTime)) {
                this.activeEffects.splice(i, 1);
            }
        }
    }

    playGameOverEffect() {
        // Screen shake
        this.game.sceneManager?.shakeCamera(0.3, 500);
        
        // Create explosion particles
        const playerPos = this.game.player?.getPosition();
        if (playerPos) {
            this.game.particleSystem?.createBurst(playerPos, 30, 0xff0000);
        }
    }

    createTrailEffect(object, color) {
        // Trail effect for moving objects
        const trail = {
            positions: [],
            maxLength: 10,
            color: color,
            update: function(deltaTime) {
                // Add current position
                this.positions.push(object.position.clone());
                
                // Remove old positions
                if (this.positions.length > this.maxLength) {
                    this.positions.shift();
                }
                
                return false; // Keep running
            }
        };
        
        this.activeEffects.push(trail);
        return trail;
    }

    screenFlash(color, duration = 200) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = color;
        flash.style.opacity = '0.5';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '999';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.transition = `opacity ${duration}ms`;
            flash.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(flash);
            }, duration);
        }, 50);
    }

    createGlowEffect(object, color, intensity = 1) {
        // Add glow to object
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3 * intensity
        });
        
        const glowMesh = object.clone();
        glowMesh.material = glowMaterial;
        glowMesh.scale.multiplyScalar(1.2);
        
        object.add(glowMesh);
        
        return glowMesh;
    }
}

export default EffectsManager;
