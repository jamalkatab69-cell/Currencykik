import * as THREE from 'three';

export class CollectEffect {
    constructor(position, color = 0xffd700, particleCount = 15) {
        this.position = position.clone();
        this.color = color;
        this.particleCount = particleCount;
        this.particles = [];
        this.duration = 800; // ms
        this.startTime = Date.now();
        this.active = true;
        
        this.create();
    }

    create() {
        for (let i = 0; i < this.particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.04);
            const material = new THREE.MeshBasicMaterial({
                color: this.color,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(this.position);
            
            // Spiral velocity
            const angle = (i / this.particleCount) * Math.PI * 2;
            const radius = 0.2;
            
            particle.velocity = new THREE.Vector3(
                Math.cos(angle) * radius,
                0.3,
                Math.sin(angle) * radius
            );
            
            // Rotation for sparkle effect
            particle.rotationSpeed = (Math.random() - 0.5) * 0.3;
            
            this.particles.push(particle);
        }
    }

    update(deltaTime) {
        if (!this.active) return true;
        
        const elapsed = Date.now() - this.startTime;
        const progress = elapsed / this.duration;
        
        if (progress >= 1) {
            this.active = false;
            return true; // Effect finished
        }
        
        // Update particles
        for (const particle of this.particles) {
            // Update position (spiral upward)
            particle.position.add(
                particle.velocity.clone().multiplyScalar(deltaTime * 60)
            );
            
            // Reduce velocity over time
            particle.velocity.multiplyScalar(0.98);
            
            // Rotate for sparkle
            particle.rotation.y += particle.rotationSpeed;
            
            // Fade out
            particle.material.opacity = 1 - progress;
            
            // Scale up then down
            let scale;
            if (progress < 0.3) {
                scale = 1 + progress * 2;
            } else {
                scale = 1.6 - (progress - 0.3) * 1.5;
            }
            particle.scale.setScalar(Math.max(0.1, scale));
        }
        
        return false; // Effect still running
    }

    getParticles() {
        return this.particles;
    }

    dispose() {
        for (const particle of this.particles) {
            particle.geometry.dispose();
            particle.material.dispose();
        }
        this.particles = [];
    }
}

export default CollectEffect;
