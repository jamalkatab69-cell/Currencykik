import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        this.config = GameConfig;
        this.quality = 'medium';
    }

    async init() {
        // Get canvas
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.config.world.backgroundColor);

        // Setup fog
        if (this.config.world.fogEnabled) {
            this.scene.fog = new THREE.Fog(
                this.config.world.fogColor,
                this.config.world.fogNear,
                this.config.world.fogFar
            );
        }

        // Create camera
        this.createCamera();

        // Create renderer
        this.createRenderer();

        // Setup lighting
        this.setupLighting();

        // Add grid helper (optional)
        // this.addGridHelper();

        console.log('✅ Scene Manager initialized');
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            aspect,
            this.config.camera.near,
            this.config.camera.far
        );

        this.camera.position.set(0, this.config.camera.positionY, this.config.camera.positionZ);
        this.camera.lookAt(0, this.config.camera.lookAtY, 0);
    }

    createRenderer() {
        const performanceSettings = this.config.performance[this.quality];

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: performanceSettings.antialias,
            alpha: false,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(
            this.config.lighting.ambient.color,
            this.config.lighting.ambient.intensity
        );
        this.scene.add(ambientLight);

        // Directional light (main light)
        const dirLight = new THREE.DirectionalLight(
            this.config.lighting.directional.color,
            this.config.lighting.directional.intensity
        );
        dirLight.position.set(
            this.config.lighting.directional.position.x,
            this.config.lighting.directional.position.y,
            this.config.lighting.directional.position.z
        );
        dirLight.castShadow = true;

        // Shadow settings
        const performanceSettings = this.config.performance[this.quality];
        dirLight.shadow.mapSize.width = performanceSettings.shadowMapSize;
        dirLight.shadow.mapSize.height = performanceSettings.shadowMapSize;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        dirLight.shadow.bias = -0.001;

        this.scene.add(dirLight);

        // Hemisphere light (soft fill)
        const hemiLight = new THREE.HemisphereLight(
            this.config.lighting.hemisphere.skyColor,
            this.config.lighting.hemisphere.groundColor,
            this.config.lighting.hemisphere.intensity
        );
        this.scene.add(hemiLight);

        // Add a spot light for more dramatic effect
        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 10, -5);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.3;
        spotLight.decay = 2;
        spotLight.distance = 40;
        this.scene.add(spotLight);
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
        gridHelper.position.y = -0.1;
        this.scene.add(gridHelper);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setQuality(quality) {
        if (!this.config.performance[quality]) {
            console.warn('Invalid quality setting:', quality);
            return;
        }

        this.quality = quality;
        const settings = this.config.performance[quality];

        // Update renderer
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1));

        // Update shadows
        const dirLight = this.scene.children.find(
            child => child instanceof THREE.DirectionalLight && child.castShadow
        );
        if (dirLight) {
            dirLight.shadow.mapSize.width = settings.shadowMapSize;
            dirLight.shadow.mapSize.height = settings.shadowMapSize;
            dirLight.shadow.map?.dispose();
            dirLight.shadow.map = null;
        }

        console.log('🎨 Quality set to:', quality);
    }

    // Helper method to add objects to scene
    add(object) {
        this.scene.add(object);
    }

    // Helper method to remove objects from scene
    remove(object) {
        this.scene.remove(object);
    }

    // Screen shake effect
    shakeCamera(intensity = 0.1, duration = 300) {
        const originalPosition = this.camera.position.clone();
        const startTime = Date.now();

        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const currentIntensity = intensity * (1 - progress);
                
                this.camera.position.x = originalPosition.x + (Math.random() - 0.5) * currentIntensity;
                this.camera.position.y = originalPosition.y + (Math.random() - 0.5) * currentIntensity;
                
                requestAnimationFrame(shake);
            } else {
                this.camera.position.copy(originalPosition);
            }
        };

        shake();
    }

    // Get scene bounds
    getSceneBounds() {
        return {
            minX: -this.config.platform.laneWidth * (this.config.platform.lanes - 1) / 2,
            maxX: this.config.platform.laneWidth * (this.config.platform.lanes - 1) / 2,
            minY: 0,
            maxY: 10,
            minZ: -50,
            maxZ: 10
        };
    }

    dispose() {
        this.renderer.dispose();
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

export default SceneManager;
