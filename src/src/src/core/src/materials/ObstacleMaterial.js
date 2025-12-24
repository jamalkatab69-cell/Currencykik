import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { VisualConfig } from '../config/visualConfig.js';

export class ObstacleMaterial {
    static create(color) {
        const config = VisualConfig.materials.obstacle;
        
        const material = new THREE.MeshStandardMaterial({
            color: color || GameConfig.obstacle.colors[0],
            emissive: color || GameConfig.obstacle.colors[0],
            emissiveIntensity: config.emissiveIntensity,
            metalness: config.metalness,
            roughness: config.roughness
        });

        return material;
    }

    static createPulsing(color) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color || GameConfig.obstacle.colors[0]) },
                time: { value: 0.0 },
                pulseSpeed: { value: 3.0 },
                pulseIntensity: { value: 0.5 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                uniform float pulseSpeed;
                uniform float pulseIntensity;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    float pulse = sin(time * pulseSpeed) * pulseIntensity + (1.0 - pulseIntensity);
                    vec3 finalColor = color * pulse;
                    
                    // Add edge glow
                    float edgeGlow = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
                    edgeGlow = pow(edgeGlow, 2.0);
                    finalColor += vec3(1.0) * edgeGlow * 0.3;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });

        return material;
    }

    static createWarning(color) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color || 0xff0000) },
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
                    // Flashing warning effect
                    float flash = step(0.5, fract(time * 4.0));
                    vec3 finalColor = mix(color * 0.5, color, flash);
                    
                    // Add stripes
                    float stripes = step(0.5, fract(vUv.y * 10.0 + time));
                    finalColor = mix(finalColor, finalColor * 1.5, stripes * 0.3);
                    
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

export default ObstacleMaterial;
