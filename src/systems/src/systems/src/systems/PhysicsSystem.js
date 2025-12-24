import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class PhysicsSystem {
    constructor(game) {
        this.game = game;
        this.config = GameConfig.physics;
        this.gravity = new THREE.Vector3(0, this.config.gravity, 0);
    }

    update(deltaTime) {
        // Physics is primarily handled in individual entity updates
        // This can be expanded for more complex physics simulations
    }

    applyGravity(object, deltaTime) {
        if (object.velocity) {
            object.velocity.y += this.gravity.y * deltaTime;
        }
    }

    applyFriction(velocity) {
        velocity.multiplyScalar(this.config.friction);
    }

    checkGroundCollision(object, groundY = 0) {
        if (object.position.y <= groundY) {
            object.position.y = groundY;
            if (object.velocity) {
                object.velocity.y *= -this.config.restitution;
                if (Math.abs(object.velocity.y) < 0.01) {
                    object.velocity.y = 0;
                }
            }
            return true;
        }
        return false;
    }
}

export default PhysicsSystem;
