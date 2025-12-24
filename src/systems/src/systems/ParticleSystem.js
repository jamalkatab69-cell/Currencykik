import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.config = GameConfig.effects.particles;
        this.particles = [];
        this.pool = [];
        this.maxParticles = 100;
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const age = Date.now() - particle.birthTime;
            
            if (age >= particle.lifetime) {
                this.removeParticle(i);
            } else {
                this.updateParticle(particle, deltaTime, age);
            }
        }
    }

    updateParticle(particle, deltaTime, age) {
        // Update position
        particle.mesh.position.add(
            particle.velocity.clone().multiplyScalar(deltaTime)
        );
        
        // Apply gravity
        particle.velocity.y += particle.gravity * deltaTime;
        
        // Update opacity
        const lifeProgress = age / particle.lifetime;
        particle.mesh.material.opacity = 1 - lifeProgress;
        
        // Update scale
        const scale = 1 - lifeProgress * 0.5;
        particle.mesh.scale.setScalar(scale);
    }

    createParticle(position, velocity, color, lifetime = 1000) {
        if (this.particles.length >= this.maxParticles) return null;
        
        const particle = this.getFromPool() || this.createNewParticle();
        
        particle.mesh.position.copy(position);
        particle.velocity.copy(velocity);
        particle.mesh.material.color.set(color);
        particle.mesh.material.opacity = 1;
        particle.mesh.scale.setScalar(1);
        particle.birthTime = Date.now();
        particle.lifetime = lifetime;
        
        this.game.sceneManager.scene.add(particle.mesh);
        this.particles.push(particle);
        
        return particle;
    }

    createNewParticle() {
        const geometry = new THREE.SphereGeometry(this.config.size);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        return {
            mesh: mesh,
            velocity: new THREE.Vector3(),
            gravity: -0.01,
            birthTime: 0,
            lifetime: 1000
        };
    }

    getFromPool() {
        return this.pool.pop();
    }

    removeParticle(index) {
        const particle = this.particles[index];
        this.game.sceneManager.scene.remove(particle.mesh);
        this.pool.push(particle);
        this.particles.splice(index, 1);
    }

    createBurst(position, count, color) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.1;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                Math.random() * 0.2,
                Math.sin(angle) * speed
            );
            
            this.createParticle(position, velocity, color, 800);
        }
    }

    clear() {
        this.particles.forEach(particle => {
            this.game.sceneManager.scene.remove(particle.mesh);
        });
        this.particles = [];
    }
}

export default ParticleSystem;
