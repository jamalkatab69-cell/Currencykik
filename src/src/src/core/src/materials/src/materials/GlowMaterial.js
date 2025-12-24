import * as THREE from 'three';

export class GlowMaterial {
    static create(color, intensity = 1.0) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                intensity: { value: intensity },
                time: { value: 0.0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float intensity;
                uniform float time;
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                
                void main() {
                    vec3 viewDirection = normalize(vViewPosition);
                    float rimGlow = 1.0 - max(0.0, dot(vNormal, viewDirection));
                    rimGlow = pow(rimGlow, 3.0);
                    
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    float finalIntensity = intensity * (0.7 + pulse * 0.3);
                    
                    vec3 glowColor = color * rimGlow * finalIntensity;
                    gl_FragColor = vec4(glowColor, rimGlow * finalIntensity);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        return material;
    }

    static createSparkle(color) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                time: { value: 0.0 },
                scale: { value: 1.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float scale;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position * (1.0 + sin(time * 3.0) * 0.2) * scale;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center);
                    float sparkle = 1.0 - smoothstep(0.0, 0.5, dist);
                    sparkle *= (sin(time * 5.0) * 0.5 + 0.5);
                    
                    // Create star shape
                    float angle = atan(center.y, center.x);
                    float rays = abs(sin(angle * 4.0)) * 0.5 + 0.5;
                    sparkle *= rays;
                    
                    gl_FragColor = vec4(color, sparkle);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        return material;
    }

    static createHalo(color, size = 1.5) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                time: { value: 0.0 },
                size: { value: size }
            },
            vertexShader: `
                uniform float time;
                uniform float size;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position * size * (1.0 + sin(time) * 0.1);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center);
                    
                    float halo = smoothstep(0.5, 0.0, dist);
                    halo *= (sin(time * 2.0) * 0.3 + 0.7);
                    
                    gl_FragColor = vec4(color, halo * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        return material;
    }

    static update(material, deltaTime) {
        if (material.uniforms && material.uniforms.time) {
            material.uniforms.time.value += deltaTime;
        }
    }
}

export default GlowMaterial;
