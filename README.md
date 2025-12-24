# 🎮 Rush 3D - Professional Endless Runner Game

<div dir="rtl">

لعبة جري لا نهائية ثلاثية الأبعاد احترافية مستوحاة من لعبة Rush من Ketchapp، مبنية بتقنيات الويب الحديثة.

</div>

## ✨ Features

- 🎨 3D Graphics with Three.js
- 🎮 Smooth Controls (Keyboard, Touch, Mouse)
- 📱 Fully Responsive & Mobile-Friendly
- 💾 Save System with Local Storage
- 🔊 Audio System (Music & Sound Effects)
- ⚡ Particle Effects & Visual Polish
- 🏆 Score System with Combos
- 🎯 Progressive Difficulty
- ⚙️ Customizable Settings

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rush-3d-game.git

# Navigate to project directory
cd rush-3d-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Play

<div dir="rtl">

### التحكم بلوحة المفاتيح
- **السهم الأيسر / A**: التحرك لليسار
- **السهم الأيمن / D**: التحرك لليمين
- **السهم الأعلى / W / مسافة**: القفز
- **Escape**: إيقاف مؤقت

### التحكم باللمس
- **اسحب لليسار/اليمين**: تغيير المسار
- **اسحب للأعلى**: القفز
- **اضغط**: القفز

### الهدف
- تجنب العوائق
- اجمع النجوم لزيادة النقاط
- حافظ على السلسلة (Combo) لمضاعفة النقاط
- حقق أعلى النقاط!

</div>

## 📁 Project Structure

```
rush-3d-game/
├── src/
│   ├── main.js                 # Entry point
│   ├── config/                 # Game configuration
│   │   └── gameConfig.js
│   ├── core/                   # Core game systems
│   │   ├── Game.js
│   │   └── SceneManager.js
│   ├── entities/               # Game entities
│   │   └── Player.js
│   ├── systems/                # Game systems
│   │   ├── InputSystem.js
│   │   ├── PhysicsSystem.js
│   │   ├── CollisionSystem.js
│   │   ├── ScoreSystem.js
│   │   ├── ParticleSystem.js
│   │   └── AudioSystem.js
│   ├── managers/               # Managers
│   │   ├── UIManager.js
│   │   ├── SaveManager.js
│   │   ├── AssetManager.js
│   │   └── EffectsManager.js
│   └── generators/             # Level generation
│       └── LevelGenerator.js
├── styles/
│   ├── main.css
│   ├── ui.css
│   └── animations.css
├── assets/
│   ├── audio/
│   └── textures/
├── index.html
├── package.json
└── README.md
```

## 🔧 Configuration

Edit `src/config/gameConfig.js` to customize:
- Player speed and behavior
- Platform generation
- Obstacle difficulty
- Visual effects
- Audio settings

## 🎨 Customization

### Change Colors

Edit the color arrays in `gameConfig.js`:

```javascript
platform: {
    colors: [
        0x6c5ce7, // Purple
        0xe17055, // Orange
        // Add your colors...
    ]
}
```

### Adjust Difficulty

```javascript
difficulty: {
    easy: {
        speedMultiplier: 0.8,
        obstacleChance: 0.5
    }
    // Customize difficulty levels...
}
```

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- Inspired by Ketchapp's Rush
- Built with Three.js
- Created with ❤️

## 📞 Contact

<div dir="rtl">

للاستفسارات والدعم، يرجى التواصل من خلال GitHub Issues.

</div>

---

<div align="center">

**Made with ❤️ using Three.js**

[🌟 Star on GitHub](https://github.com/yourusername/rush-3d-game) | [🐛 Report Bug](https://github.com/yourusername/rush-3d-game/issues) | [💡 Request Feature](https://github.com/yourusername/rush-3d-game/issues)

</div>
