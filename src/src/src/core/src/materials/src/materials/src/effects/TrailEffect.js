import * as THREE from 'three';

export class TrailEffect {
    constructor(target, color, maxLength = 20) {
        this.target = target;
        this.color = color;
        this.maxLength = maxLength;
        this.positions = [];
        this.mesh = null;
        this.enabled = true;
        
        this.create();
    }

    create() {
        const geometry = new THREE.BufferGeometry();
        
        // Initialize positions array
        const positions = new Float32Array(this.maxLength * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create material with gradient fade
        const material = new THREE.LineBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.mesh = new THREE.Line(geometry, material);
        this.mesh.frustumCulled = false;
    }

    update() {
        if (!this.enabled || !this.target) return;
        
        // Add current position
        this.positions.push(this.target.position.clone());
        
        // Remove old positions
        if (this.positions.length > this.maxLength) {
            this.positions.shift();
        }
        
        // Update geometry
        const positions = this.mesh.geometry.attributes.position.array;
        
        for (let i = 0; i < this.maxLength; i++) {
            if (i < this.positions.length) {
                const pos = this.positions[i];
                positions[i * 3] = pos.x;
                positions[i * 3 + 1] = pos.y;
                positions[i * 3 + 2] = pos.z;
            } else {
                // Fill remaining with last position or zero
                const lastPos = this.positions[this.positions.length - 1] || new THREE.Vector3();
                positions[i * 3] = lastPos.x;
                positions[i * 3 + 1] = lastPos.y;
                positions[i * 3 + 2] = lastPos.z;
            }
        }
        
        this.mesh.geometry.attributes.position.needsUpdate = true;
        
        // Fade out trail
        const fadeAmount = this.positions.length / this.maxLength;
        this.mesh.material.opacity = 0.6 * fadeAmount;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.positions = [];
        }
    }

    setColor(color) {
        this.color = color;
        this.mesh.material.color.set(color);
    }

    getMesh() {
        return this.mesh;
    }

    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
    }
}

export default TrailEffect;
