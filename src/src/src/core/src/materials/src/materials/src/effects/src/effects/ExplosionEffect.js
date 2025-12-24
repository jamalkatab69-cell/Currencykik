import * as THREE from 'three';

export class ExplosionEffect {
    constructor(position, color = 0xff6b6b, particleCount = 30) {
        this.position = position.clone();
        this.color = color;
        this.particleCount = particleCount;
        this.particles = [];
        this.duration = 1000; // ms
        this.startTime = Date.now();
        this.active = true;
        
        this.create();
    }

    create() {
        for (let i = 0; i < this.particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.05);
            const material = new THREE.MeshBasicMaterial({
                color: this.color,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(this.position);
            
            // Random velocity in all directions
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 0.1 + Math.random() * 0.2;
            
            particle.velocity = new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed
            );
            
            particle.rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            
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
            // Update position
            particle.position.add(
                particle.velocity.clone().multiplyScalar(deltaTime * 60)
            );
            
            // Apply gravity
            particle.velocity.y -= 0.01 * deltaTime * 60;
            
            // Update rotation
            particle.rotation.x += particle.rotationSpeed.x;
            particle.rotation.y += particle.rotationSpeed.y;
            particle.rotation.z += particle.rotationSpeed.z;
            
            // Fade out
            particle.material.opacity = 1 - progress;
            
            // Shrink
            const scale = 1 - progress * 0.5;
            particle.scale.setScalar(scale);
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

export default ExplosionEffect;
