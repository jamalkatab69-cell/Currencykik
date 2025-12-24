import * as THREE from 'three';
import { VisualConfig } from '../config/visualConfig.js';

export class ColorGenerator {
    constructor() {
        this.palettes = VisualConfig.colorPalettes;
        this.currentPalette = 'default';
        this.colorIndex = 0;
    }

    setPalette(paletteName) {
        if (this.palettes[paletteName]) {
            this.currentPalette = paletteName;
            this.colorIndex = 0;
        }
    }

    getNextPlatformColor() {
        const palette = this.palettes[this.currentPalette];
        const color = palette.platforms[this.colorIndex % palette.platforms.length];
        this.colorIndex++;
        return color;
    }

    getRandomPlatformColor() {
        const palette = this.palettes[this.currentPalette];
        const randomIndex = Math.floor(Math.random() * palette.platforms.length);
        return palette.platforms[randomIndex];
    }

    getObstacleColor() {
        const palette = this.palettes[this.currentPalette];
        const randomIndex = Math.floor(Math.random() * palette.obstacles.length);
        return palette.obstacles[randomIndex];
    }

    getCollectibleColor() {
        const palette = this.palettes[this.currentPalette];
        return palette.collectibles;
    }

    getPlayerColor() {
        const palette = this.palettes[this.currentPalette];
        return palette.player;
    }

    getBackgroundColor() {
        const palette = this.palettes[this.currentPalette];
        return palette.background;
    }

    generateGradient(color1, color2, steps) {
        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);
        const gradient = [];

        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const color = c1.clone().lerp(c2, t);
            gradient.push(color.getHex());
        }

        return gradient;
    }

    getComplementaryColor(color) {
        const c = new THREE.Color(color);
        c.offsetHSL(0.5, 0, 0);
        return c.getHex();
    }

    getRandomPalette() {
        const paletteNames = Object.keys(this.palettes);
        const randomName = paletteNames[Math.floor(Math.random() * paletteNames.length)];
        return randomName;
    }
}

export default ColorGenerator;
