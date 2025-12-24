import * as THREE from 'three';

export class ColorUtils {
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static lerpColor(color1, color2, t) {
        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);
        return c1.lerp(c2, t);
    }

    static randomColor() {
        return Math.floor(Math.random() * 0xffffff);
    }

    static lighten(color, amount) {
        const c = new THREE.Color(color);
        c.offsetHSL(0, 0, amount);
        return c.getHex();
    }

    static darken(color, amount) {
        return this.lighten(color, -amount);
    }

    static complementary(color) {
        const c = new THREE.Color(color);
        c.offsetHSL(0.5, 0, 0);
        return c.getHex();
    }

    static getContrastColor(color) {
        const c = new THREE.Color(color);
        const luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
        return luminance > 0.5 ? 0x000000 : 0xffffff;
    }
}

export default ColorUtils;
