import * as THREE from 'three';
import { Entity } from './Entity.js';
import { GameConfig } from '../config/gameConfig.js';

export class Obstacle extends Entity {
    constructor(game, lane, z, height) {
        super(game);
        this.config = GameConfig.obstacle;
        this.platformConfig = GameConfig.platform;
        this.lane = lane;
        this.z = z;
        this.height = height;
        this.create();
    }

    create() {
        const geometry = new THREE.BoxGeometry(
            this.config.width,
            this.height,
            this.config.depth
        );

        const colorIndex = Math.floor(Math.random() * this.config.colors.length);
        const material = new THREE.MeshStandardMaterial({
            color: this.config.colors[colorIndex],
            emissive: this.config.colors[colorIndex],
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        const x = (this.lane - 1) * this.platformConfig.laneWidth;
        const y = this.height / 2;
        
        this.mesh.position.set(x, y, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Add glow edges
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        this.mesh.add(wireframe);

        this.mesh.userData = {
            type: 'obstacle',
            lane: this.lane
        };
    }

    update(deltaTime) {
        // Pulse effect
        const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.3;
        this.mesh.material.emissiveIntensity = pulse;
    }
}

export default Obstacle;
