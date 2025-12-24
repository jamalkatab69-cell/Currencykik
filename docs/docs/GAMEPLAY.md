# Rush 3D - Gameplay Documentation

<div dir="rtl">

## نظرة عامة
Rush 3D هي لعبة جري لا نهائية ثلاثية الأبعاد حيث يتحكم اللاعب بمكعب يتحرك عبر منصات ملونة، يتجنب العوائق ويجمع النجوم.

</div>

## Game Mechanics

### Movement
- **3 Lanes**: The game features 3 parallel lanes
- **Lane Switching**: Player can move left/right between lanes
- **Jumping**: Player can jump over obstacles
- **Auto-Forward**: Player moves forward automatically

### Speed System
- Base speed: 0.15 units/frame
- Maximum speed: 0.5 units/frame
- Speed increases gradually as the game progresses
- Speed multiplier shown in UI (1.0x - 3.0x)

### Scoring

#### Basic Points
- Passing a platform: 1 point
- Collecting a star: 10 points

#### Combo System
- Consecutive collections increase combo multiplier
- Combo multiplier: 1 + (combo_count × 0.1)
- Combo resets after 3 seconds without collection
- Maximum combo: Unlimited

#### Score Calculation
```
Final Points = Base Points × Combo Multiplier
Example: 10 points × 2.0 combo = 20 points
```

### Obstacles

#### Types
1. **Short Obstacles**: Height 0.5-1.0 units (can jump over)
2. **Medium Obstacles**: Height 1.0-1.5 units (harder to jump)
3. **Tall Obstacles**: Height 1.5-2.0 units (must avoid)

#### Properties
- Red/orange colors for visibility
- Glow effect for emphasis
- Pulsing animation
- Cast shadows

### Collectibles

#### Star Properties
- Octahedron shape
- Golden color
- Rotating animation
- Floating up and down
- Glow effect
- Worth 10 points each

#### Spawn Rate
- Early game: 30% chance per platform
- Late game: 15% chance per platform
- Decreased as difficulty increases

### Difficulty Progression

#### Easy (0-50 platforms)
- Speed: 0.8x
- Obstacle chance: 50%
- Collectible chance: 40%

#### Medium (51-100 platforms)
- Speed: 1.0x
- Obstacle chance: 70%
- Collectible chance: 30%

#### Hard (101-150 platforms)
- Speed: 1.3x
- Obstacle chance: 85%
- Collectible chance: 25%

#### Expert (151+ platforms)
- Speed: 1.5x+
- Obstacle chance: 90%
- Collectible chance: 20%

### Platform Generation

#### Pattern Types
1. **Straight**: All platforms in middle lane
2. **Zigzag**: Alternating left-right pattern
3. **Alternating**: Switch between outer lanes
4. **Wave**: Smooth transitions between lanes
5. **Challenge**: Dense obstacles
6. **Collect Run**: Many collectibles, few obstacles

#### Generation Rules
- 1-2 platforms per row
- Minimum 3 unit spacing
- Always at least one accessible platform
- Patterns become more complex over time

### Game Over Conditions

1. **Collision with obstacle**: Hit any red obstacle
2. **Fall off platform**: Miss all platforms in a row
3. **Fall below threshold**: Y position < -2

### Visual Effects

#### Player Effects
- Rotation animation
- Scale pulse
- Color flash on collection
- Hit shake effect
- Trail effect (optional)

#### Particle Effects
- Explosion on collision
- Sparkles on collection
- Landing dust
- Speed lines at high speed

#### Screen Effects
- Camera shake on collision
- Speed blur (optional)
- Color transitions
- Vignette

### Audio Feedback

#### Sound Effects
- Move (lane change): 400 Hz beep
- Jump: 600 Hz beep
- Collect: 800 Hz beep
- Crash: 200 Hz beep
- Fall: 150 Hz beep

#### Music
- Menu: Calm background music
- Gameplay: Energetic music that speeds up
- Game Over: Sad tone

### Controls

#### Keyboard
- Arrow Left / A: Move left
- Arrow Right / D: Move right  
- Arrow Up / W / Space: Jump
- Escape: Pause

#### Touch (Mobile)
- Swipe left: Move left
- Swipe right: Move right
- Swipe up: Jump
- Tap: Jump

#### Mouse
- Click left third of screen: Move left
- Click right third of screen: Move right
- Click middle: Jump

### Tips for Players

<div dir="rtl">

1. **خطط مسبقاً**: انظر للأمام وخطط لحركاتك
2. **حافظ على السلسلة**: اجمع النجوم باستمرار للحصول على نقاط مضاعفة
3. **توقيت القفز**: اقفز في الوقت المناسب لتجنب العوائق
4. **ابق في الوسط**: الممر الأوسط غالباً أكثر أماناً
5. **تدرب على التبديل السريع**: كن سريعاً في التبديل بين الممرات

</div>

### Achievements

- First Steps: Complete first game
- Century: Score 100 points
- Collector: Collect 50 stars
- Combo Master: Reach 10x combo
- Speed Demon: Reach maximum speed
- Survivor: Survive 60 seconds
- High Scorer: Score 500 points
- Elite Player: Score 1000 points
- Marathon Runner: Play 10 games
- Perfectionist: Perfect run without hits
