import * as THREE from 'three';
import { Entity } from './Entity.js';
import { GameConfig } from '../config/gameConfig.js';

export class Collectible extends Entity {
    constructor(game, lane, z) {
        super(game);
        this.config = GameConfig.collectible;
        this.platformConfig = GameConfig.platform;
        this.lane = lane;
        this.z = z;
        this.collected = false;
        this.rotationSpeed = this.config.rotationSpeed;
        this.create();
    }

    create() {
        const geometry = new THREE.OctahedronGeometry(this.config.size);

        const material = new THREE.MeshStandardMaterial({
            color: this.config.color,
            emissive: this.config.color,
            emissiveIntensity: 0.8,
            metalness: 0.8,
            roughness: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        const x = (this.lane - 1) * this.platformConfig.laneWidth;
        const y = 1.5;
        
        this.mesh.position.set(x, y, this.z);
        this.mesh.castShadow = true;

        // Add glow effect
        const glowGeometry = new THREE.OctahedronGeometry(this.config.size * 1.2);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.mesh.add(glow);

        this.mesh.userData = {
            type: 'collectible',
            lane: this.lane,
            collected: false,
            value: this.config.pointValue
        };
    }

    update(deltaTime) {
        if (this.collected) return;

        // Rotate
        this.mesh.rotation.y += this.rotationSpeed;

        // Floating animation
        const floatOffset = Math.sin(Date.now() * 0.003) * 0.1;
        this.mesh.position.y = 1.5 + floatOffset;

        // Pulse glow
        const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.3;
        if (this.mesh.children[0]) {
            this.mesh.children[0].material.opacity = pulse;
        }
    }

    collect() {
        this.collected = true;
        this.mesh.userData.collected = true;
    }
}

export default Collectible;
