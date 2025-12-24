export class Tween {
    constructor(object, target, duration, easing = 'linear') {
        this.object = object;
        this.target = target;
        this.duration = duration;
        this.easing = easing;
        this.startValues = {};
        this.startTime = null;
        this.onComplete = null;
        this.onUpdate = null;
        this.isPlaying = false;

        // Store start values
        for (const key in target) {
            this.startValues[key] = object[key];
        }
    }

    start() {
        this.startTime = Date.now();
        this.isPlaying = true;
        this.update();
        return this;
    }

    update() {
        if (!this.isPlaying) return;

        const now = Date.now();
        const elapsed = now - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        const easedProgress = this.applyEasing(progress);

        // Update object properties
        for (const key in this.target) {
            const start = this.startValues[key];
            const end = this.target[key];
            this.object[key] = start + (end - start) * easedProgress;
        }

        if (this.onUpdate) {
            this.onUpdate(easedProgress);
        }

        if (progress < 1) {
            requestAnimationFrame(() => this.update());
        } else {
            this.isPlaying = false;
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }

    applyEasing(t) {
        const easings = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
            },
            easeOutElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
            },
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) return n1 * t * t;
                if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
                if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        };

        return easings[this.easing] ? easings[this.easing](t) : t;
    }

    stop() {
        this.isPlaying = false;
        return this;
    }

    then(callback) {
        this.onComplete = callback;
        return this;
    }

    onChange(callback) {
        this.onUpdate = callback;
        return this;
    }

    static to(object, target, duration, easing) {
        return new Tween(object, target, duration, easing).start();
    }
}

export default Tween;
