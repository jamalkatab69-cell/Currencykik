export const GameConfig = {
    // Game Settings
    game: {
        name: 'Rush 3D',
        version: '1.0.0',
        initialSpeed: 0.15,
        maxSpeed: 0.5,
        speedIncrement: 0.001,
        scoreMultiplier: 1,
        lives: 1
    },

    // Player Settings
    player: {
        size: 0.3,
        moveSpeed: 0.15,
        jumpHeight: 2,
        gravity: -0.5,
        color: 0x6c5ce7,
        mass: 1
    },

    // Platform Settings
    platform: {
        width: 1,
        height: 0.2,
        length: 20,
        spacing: 3,
        lanes: 3,
        laneWidth: 1.5,
        colors: [
            0x6c5ce7, // Purple
            0xe17055, // Orange
            0x00b894, // Green
            0x0984e3, // Blue
            0xfdcb6e, // Yellow
            0xe84393  // Pink
        ]
    },

    // Obstacle Settings
    obstacle: {
        minHeight: 0.5,
        maxHeight: 2,
        width: 0.8,
        depth: 0.8,
        spawnChance: 0.7,
        colors: [
            0xff6b6b, // Red
            0xff7675, // Light Red
            0xd63031  // Dark Red
        ]
    },

    // Collectible Settings
    collectible: {
        size: 0.4,
        spawnChance: 0.3,
        pointValue: 10,
        rotationSpeed: 0.05,
        color: 0xffeaa7
    },

    // Camera Settings
    camera: {
        fov: 60,
        near: 0.1,
        far: 1000,
        positionY: 4,
        positionZ: 6,
        lookAtY: 1
    },

    // Lighting
    lighting: {
        ambient: {
            color: 0xffffff,
            intensity: 0.6
        },
        directional: {
            color: 0xffffff,
            intensity: 0.8,
            position: { x: 5, y: 10, z: 5 }
        },
        hemisphere: {
            skyColor: 0xffffff,
            groundColor: 0x444444,
            intensity: 0.4
        }
    },

    // Difficulty Settings
    difficulty: {
        easy: {
            speedMultiplier: 0.8,
            obstacleChance: 0.5
        },
        medium: {
            speedMultiplier: 1.0,
            obstacleChance: 0.7
        },
        hard: {
            speedMultiplier: 1.3,
            obstacleChance: 0.85
        }
    },

    // Score Thresholds
    scoring: {
        platformPass: 1,
        collectible: 10,
        perfectRun: 50,
        comboMultiplier: 1.5
    },

    // Visual Effects
    effects: {
        particles: {
            count: 20,
            size: 0.1,
            speed: 0.1,
            lifetime: 1000
        },
        trail: {
            enabled: true,
            length: 10,
            opacity: 0.5
        },
        screenShake: {
            enabled: true,
            intensity: 0.1,
            duration: 300
        }
    },

    // Audio Settings
    audio: {
        music: {
            volume: 0.5,
            fadeTime: 1000
        },
        sfx: {
            volume: 0.7
        }
    },

    // Performance Settings
    performance: {
        low: {
            shadowMapSize: 512,
            particleCount: 10,
            antialias: false
        },
        medium: {
            shadowMapSize: 1024,
            particleCount: 20,
            antialias: true
        },
        high: {
            shadowMapSize: 2048,
            particleCount: 40,
            antialias: true
        }
    },

    // Physics
    physics: {
        gravity: -9.8,
        friction: 0.95,
        restitution: 0.3
    },

    // World Settings
    world: {
        fogEnabled: true,
        fogColor: 0x667eea,
        fogNear: 10,
        fogFar: 50,
        backgroundColor: 0x667eea
    }
};

export default GameConfig;
