export const VisualConfig = {
    // Color Palettes
    colorPalettes: {
        default: {
            background: 0x667eea,
            platforms: [0x6c5ce7, 0xe17055, 0x00b894, 0x0984e3, 0xfdcb6e],
            obstacles: [0xff6b6b, 0xff7675, 0xd63031],
            collectibles: 0xffeaa7,
            player: 0x6c5ce7
        },
        sunset: {
            background: 0xff6b6b,
            platforms: [0xff7675, 0xfd79a8, 0xfdcb6e, 0xffeaa7, 0xff9ff3],
            obstacles: [0x2d3436, 0x636e72, 0xb2bec3],
            collectibles: 0xffeaa7,
            player: 0xfd79a8
        },
        ocean: {
            background: 0x74b9ff,
            platforms: [0x0984e3, 0x00b894, 0x00cec9, 0x81ecec, 0x55efc4],
            obstacles: [0xff6b6b, 0xd63031, 0xe17055],
            collectibles: 0xffeaa7,
            player: 0x0984e3
        },
        neon: {
            background: 0x2d3436,
            platforms: [0xff00ff, 0x00ffff, 0xff00aa, 0x00ff00, 0xffff00],
            obstacles: [0xff0000, 0xff3838, 0xff6b6b],
            collectibles: 0xffd700,
            player: 0xff00ff
        }
    },

    // Materials
    materials: {
        platform: {
            metalness: 0.2,
            roughness: 0.8
        },
        obstacle: {
            metalness: 0.5,
            roughness: 0.5,
            emissiveIntensity: 0.3
        },
        collectible: {
            metalness: 0.8,
            roughness: 0.2,
            emissiveIntensity: 0.8
        },
        player: {
            metalness: 0.3,
            roughness: 0.4,
            emissiveIntensity: 0.5
        }
    },

    // Post Processing
    postProcessing: {
        bloom: {
            enabled: true,
            strength: 0.8,
            radius: 0.5,
            threshold: 0.85
        },
        chromaticAberration: {
            enabled: false,
            offset: 0.002
        },
        vignette: {
            enabled: true,
            darkness: 0.5
        }
    },

    // Shadows
    shadows: {
        enabled: true,
        mapSize: 2048,
        bias: -0.001
    }
};

export default VisualConfig;
