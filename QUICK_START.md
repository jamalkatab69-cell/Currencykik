# 🚀 Rush 3D - Quick Start Guide

<div dir="rtl">

## دليل البدء السريع

</div>

## 📦 Installation

```bash
# 1. Clone or download the project
git clone https://github.com/yourusername/rush-3d-game.git
cd rush-3d-game

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser at http://localhost:3000
```

## 📁 Project Structure Overview

```
rush-3d-game/
├── index.html              # Main HTML file
├── package.json            # Dependencies
├── vite.config.js          # Build configuration
├── src/
│   ├── main.js            # 🎯 Entry point
│   ├── config/            # Game configuration
│   ├── core/              # Core game engine
│   ├── entities/          # Game objects (Player, Obstacles, etc.)
│   ├── systems/           # Game systems (Input, Physics, etc.)
│   ├── managers/          # Global managers (UI, Save, etc.)
│   ├── generators/        # Level generation
│   ├── effects/           # Visual effects
│   ├── materials/         # Custom Three.js materials
│   ├── utils/             # Helper functions
│   └── data/              # JSON data files
├── styles/                # CSS files
└── assets/                # Images, sounds, etc.
```

## 🎮 Game Features

### ✅ Currently Implemented (50+ files)

1. **Core Game Engine**
   - ✅ Game loop and state management
   - ✅ Scene management with Three.js
   - ✅ Camera system with smooth following
   - ✅ Rendering system

2. **Player System**
   - ✅ Player entity with movement
   - ✅ Lane switching (3 lanes)
   - ✅ Jump mechanics
   - ✅ Smooth animations

3. **Level Generation**
   - ✅ Procedural platform generation
   - ✅ Obstacle placement
   - ✅ Collectible spawning
   - ✅ Pattern-based generation
   - ✅ Dynamic difficulty scaling

4. **Input Systems**
   - ✅ Keyboard controls
   - ✅ Touch controls (mobile)
   - ✅ Mouse controls
   - ✅ Responsive to all input types

5. **Physics & Collision**
   - ✅ Simple physics system
   - ✅ Collision detection
   - ✅ Gravity and movement

6. **Visual Effects**
   - ✅ Particle system
   - ✅ Trail effects
   - ✅ Explosion effects
   - ✅ Collect effects
   - ✅ Screen shake
   - ✅ Custom materials with shaders

7. **UI System**
   - ✅ Main menu
   - ✅ Game UI
   - ✅ Pause menu
   - ✅ Game over screen
   - ✅ Settings menu
   - ✅ Screen transitions

8. **Save System**
   - ✅ LocalStorage persistence
   - ✅ Best score tracking
   - ✅ Settings save/load

9. **Audio System**
   - ✅ Sound effects (beep-based)
   - ✅ Music system (placeholder)
   - ✅ Volume controls

10. **Scoring System**
    - ✅ Score tracking
    - ✅ Combo system
    - ✅ Score multipliers

## 🎯 How to Play

<div dir="rtl">

### التحكم

**لوحة المفاتيح:**
- ← أو A: يسار
- → أو D: يمين
- ↑ أو W أو مسافة: قفز
- Esc: إيقاف مؤقت

**اللمس (الجوال):**
- اسحب يساراً: تحرك يساراً
- اسحب يميناً: تحرك يميناً
- اسحب لأعلى أو اضغط: قفز

**الفأرة:**
- انقر على يسار الشاشة: يسار
- انقر على يمين الشاشة: يمين
- انقر في الوسط: قفز

</div>

## 🛠 Development

### Adding New Features

1. **New Entity**: Extend `src/entities/Entity.js`
2. **New System**: Create class with `update(deltaTime)` method
3. **New Effect**: Extend effect classes in `src/effects/`
4. **New Pattern**: Add to `src/data/patterns.json`

### Configuration

Edit `src/config/gameConfig.js` to modify:
- Player speed and behavior
- Platform generation rules
- Obstacle difficulty
- Visual effects settings
- Audio settings

### Example: Change Player Color

```javascript
// src/config/gameConfig.js
player: {
    color: 0x00ff00, // Change to green
    // ... other settings
}
```

## 🐛 Troubleshooting

### Game won't start
- Check browser console for errors
- Ensure Node.js is installed (v16+)
- Try `npm install` again

### Assets not loading
- Create placeholder files in `assets/textures/`
- Or disable asset loading temporarily

### Performance issues
- Lower quality in settings
- Reduce particle count in `gameConfig.js`
- Check browser hardware acceleration

## 📝 TODO / Future Enhancements

- [ ] Real audio files (currently using beeps)
- [ ] More obstacle types
- [ ] Power-ups system
- [ ] Achievement tracking UI
- [ ] Leaderboard system
- [ ] More visual themes
- [ ] Mobile app version
- [ ] Multiplayer mode

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🎉 Credits

- Built with Three.js
- Inspired by Ketchapp's Rush
- Created with ❤️

---

<div align="center" dir="rtl">

**استمتع باللعب! 🎮**

للمساعدة والدعم، افتح issue على GitHub

</div>
