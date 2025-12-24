import * as THREE from 'three';
import { VisualConfig } from '../config/visualConfig.js';

export class PlatformMaterial {
    static create(color) {
        const config = VisualConfig.materials.platform;
        
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: config.metalness,
            roughness: config.roughness
        });

        return material;
    }

    static createAnimated(color) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                time: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    float wave = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.8 + wave * 0.2);
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });

        return material;
    }

    static update(material, deltaTime) {
        if (material.uniforms && material.uniforms.time) {
            material.uniforms.time.value += deltaTime;
        }
    }
}

export default PlatformMaterial;
