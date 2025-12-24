export class MathUtils {
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    }

    static map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    static smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }

    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    static isPowerOfTwo(value) {
        return (value & (value - 1)) === 0 && value !== 0;
    }

    static nextPowerOfTwo(value) {
        value--;
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        value++;
        return value;
    }
}

export default MathUtils;
