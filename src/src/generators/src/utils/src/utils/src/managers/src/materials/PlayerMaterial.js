import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class PlayerMaterial {
    static create(color) {
        const material = new THREE.MeshStandardMaterial({
            color: color || GameConfig.player.color,
            emissive: color || GameConfig.player.color,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.4
        });

        return material;
    }

    static createWithGlow(color) {
        const material = this.create(color);
        
        // Create shader material for glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color || GameConfig.player.color) },
                intensity: { value: 1.0 },
                time: { value: 0.0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float intensity;
                uniform float time;
                varying vec3 vNormal;
                
                void main() {
                    float glow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    gl_FragColor = vec4(color * glow * intensity * (0.7 + pulse * 0.3), glow);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });

        return { material, glowMaterial };
    }

    static updateGlow(glowMaterial, deltaTime) {
        if (glowMaterial && glowMaterial.uniforms) {
            glowMaterial.uniforms.time.value += deltaTime;
        }
    }
}

export default PlayerMaterial;
