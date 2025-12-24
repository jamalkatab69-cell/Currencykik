import * as THREE from 'three';
import { Entity } from './Entity.js';
import { GameConfig } from '../config/gameConfig.js';

export class Platform extends Entity {
    constructor(game, lane, z, color) {
        super(game);
        this.config = GameConfig.platform;
        this.lane = lane;
        this.color = color;
        this.z = z;
        this.create();
    }

    create() {
        const geometry = new THREE.BoxGeometry(
            this.config.width,
            this.config.height,
            this.config.length
        );

        const material = new THREE.MeshStandardMaterial({
            color: this.color,
            metalness: 0.2,
            roughness: 0.8
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        const x = (this.lane - 1) * this.config.laneWidth;
        const y = this.config.height / 2 - 0.5;
        
        this.mesh.position.set(x, y, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.userData = {
            type: 'platform',
            lane: this.lane
        };
    }

    update(deltaTime) {
        // Platform-specific updates if needed
    }
}

export default Platform;
