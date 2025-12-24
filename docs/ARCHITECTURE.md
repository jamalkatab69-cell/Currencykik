# Rush 3D - Architecture Documentation

## Overview

Rush 3D is built using a modular architecture with clear separation of concerns. The game follows an Entity-Component-System (ECS) inspired pattern combined with manager classes for global functionality.

## Core Architecture

### 1. Main Entry Point (`main.js`)
- Initializes the GameApp class
- Handles asset loading
- Manages UI screens
- Coordinates between game and UI

### 2. Game Core (`core/`)
- **Game.js**: Main game loop and state management
- **SceneManager.js**: Three.js scene, camera, and renderer management
- **Loop.js**: Animation frame management

### 3. Entities (`entities/`)
All game objects inherit from the base `Entity` class:
- **Entity.js**: Base class with common properties
- **Player.js**: Player character with movement and animations
- **Platform.js**: Platform tiles
- **Obstacle.js**: Obstacles to avoid
- **Collectible.js**: Collectible items

### 4. Systems (`systems/`)
Systems handle specific aspects of gameplay:
- **InputSystem**: Keyboard, touch, and mouse input
- **PhysicsSystem**: Simple physics simulation
- **CollisionSystem**: Collision detection and response
- **ScoreSystem**: Score tracking and combos
- **ParticleSystem**: Particle effects
- **AudioSystem**: Sound effects and music

### 5. Managers (`managers/`)
Global managers for cross-cutting concerns:
- **UIManager**: Screen transitions and UI state
- **SaveManager**: Local storage persistence
- **AssetManager**: Asset loading and caching
- **EffectsManager**: Visual effects coordination
- **PoolManager**: Object pooling for performance

### 6. Generators (`generators/`)
Procedural content generation:
- **LevelGenerator**: Platform and obstacle placement
- **PatternGenerator**: Predefined platform patterns
- **ColorGenerator**: Color palette management

## Data Flow

```
User Input → InputSystem → Player → Game → SceneManager → Render
                                   ↓
                            PhysicsSystem
                                   ↓
                            CollisionSystem
                                   ↓
                            ScoreSystem → UIManager
```

## Configuration

All game parameters are centralized in:
- `config/gameConfig.js`: Gameplay parameters
- `config/visualConfig.js`: Visual settings
- `data/*.json`: Static game data

## Performance Optimizations

1. **Object Pooling**: Reuse objects instead of creating/destroying
2. **Frustum Culling**: Only render visible objects
3. **LOD System**: Level of detail for distant objects
4. **Efficient Collision**: Spatial partitioning and early exits
5. **Batched Rendering**: Combine similar geometries

## State Management

Game states:
- `Loading`: Initial asset loading
- `Menu`: Main menu screen
- `Playing`: Active gameplay
- `Paused`: Game paused
- `GameOver`: End screen

## Event System

Events are handled through direct method calls and callbacks:
- Input events → InputSystem → Player methods
- Collision events → CollisionSystem → Game callbacks
- UI events → UIManager → App methods

## Extensibility

The architecture supports easy extension:
- New entities: Extend Entity class
- New systems: Implement update() method
- New effects: Add to EffectsManager
- New patterns: Add to patterns.json

## Best Practices

1. Keep entities focused on their data and simple behaviors
2. Systems handle complex logic and inter-entity communication
3. Managers provide global services
4. Configuration stays separate from logic
5. Use the pool manager for frequently created/destroyed objects

## Testing Strategy

1. Unit tests for utility functions
2. Integration tests for systems
3. Visual tests for rendering
4. Performance profiling for bottlenecks

## Future Enhancements

- WebGL 2.0 features
- Advanced shaders
- Multiplayer support
- Level editor
- Custom themes
