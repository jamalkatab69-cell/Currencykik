import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class Camera {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.config = GameConfig.camera;
        this.camera = null;
        this.target = null;
        this.offset = new THREE.Vector3(0, this.config.positionY, this.config.positionZ);
        this.smoothness = 0.1;
        this.shakeOffset = new THREE.Vector3();
        this.isShaking = false;
    }

    init() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            this.config.fov,
            aspect,
            this.config.near,
            this.config.far
        );
        
        this.camera.position.copy(this.offset);
        this.camera.lookAt(0, this.config.lookAtY, 0);
    }

    setTarget(target) {
        this.target = target;
    }

    update(deltaTime) {
        if (!this.target) return;

        // Smooth camera follow
        const targetPos = this.target.position.clone();
        const desiredPos = targetPos.clone().add(this.offset);
        
        this.camera.position.lerp(desiredPos, this.smoothness);
        
        // Look at target position
        const lookAtPos = targetPos.clone();
        lookAtPos.y = this.config.lookAtY;
        this.camera.lookAt(lookAtPos);

        // Apply shake if active
        if (this.isShaking) {
            this.camera.position.add(this.shakeOffset);
        }
    }

    shake(intensity = 0.2, duration = 300) {
        this.isShaking = true;
        const startTime = Date.now();
        
        const shakeAnimation = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const currentIntensity = intensity * (1 - progress);
                
                this.shakeOffset.set(
                    (Math.random() - 0.5) * currentIntensity,
                    (Math.random() - 0.5) * currentIntensity,
                    (Math.random() - 0.5) * currentIntensity
                );
                
                requestAnimationFrame(shakeAnimation);
            } else {
                this.shakeOffset.set(0, 0, 0);
                this.isShaking = false;
            }
        };
        
        shakeAnimation();
    }

    zoom(fov, duration = 1000) {
        const startFov = this.camera.fov;
        const startTime = Date.now();
        
        const zoomAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            this.camera.fov = startFov + (fov - startFov) * progress;
            this.camera.updateProjectionMatrix();
            
            if (progress < 1) {
                requestAnimationFrame(zoomAnimation);
            }
        };
        
        zoomAnimation();
    }

    onWindowResize() {
        if (!this.camera) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    getCamera() {
        return this.camera;
    }

    setOffset(x, y, z) {
        this.offset.set(x, y, z);
    }

    setSmoothness(smoothness) {
        this.smoothness = THREE.MathUtils.clamp(smoothness, 0, 1);
    }
}

export default Camera;
