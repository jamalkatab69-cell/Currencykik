import * as THREE from 'three';

export class Entity {
    constructor(game) {
        this.game = game;
        this.mesh = null;
        this.active = true;
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Vector3();
        this.scale = new THREE.Vector3(1, 1, 1);
        this.velocity = new THREE.Vector3();
    }

    create() {
        // Override in subclasses
    }

    update(deltaTime) {
        // Override in subclasses
    }

    destroy() {
        if (this.mesh) {
            this.game.sceneManager.scene.remove(this.mesh);
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh.material) {
                if (Array.isArray(this.mesh.material)) {
                    this.mesh.material.forEach(m => m.dispose());
                } else {
                    this.mesh.material.dispose();
                }
            }
        }
        this.active = false;
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }

    setRotation(x, y, z) {
        this.rotation.set(x, y, z);
        if (this.mesh) {
            this.mesh.rotation.set(x, y, z);
        }
    }

    setScale(x, y, z) {
        this.scale.set(x, y, z);
        if (this.mesh) {
            this.mesh.scale.copy(this.scale);
        }
    }

    getPosition() {
        return this.mesh ? this.mesh.position.clone() : this.position.clone();
    }

    getBoundingBox() {
        if (this.mesh) {
            return new THREE.Box3().setFromObject(this.mesh);
        }
        return null;
    }

    isActive() {
        return this.active;
    }
}

export default Entity;
