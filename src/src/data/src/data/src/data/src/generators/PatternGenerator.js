import patternsData from '../data/patterns.json';

export class PatternGenerator {
    constructor(game) {
        this.game = game;
        this.patterns = patternsData.patterns;
        this.probabilities = patternsData.patternProbabilities;
        this.currentDifficulty = 'easy';
    }

    getRandomPattern() {
        const probs = this.probabilities[this.currentDifficulty];
        const random = Math.random();
        let cumulative = 0;

        for (const [patternId, probability] of Object.entries(probs)) {
            cumulative += probability;
            if (random <= cumulative) {
                return this.patterns.find(p => p.id === patternId);
            }
        }

        return this.patterns[0]; // Fallback to first pattern
    }

    getPatternById(id) {
        return this.patterns.find(p => p.id === id);
    }

    setDifficulty(difficulty) {
        if (this.probabilities[difficulty]) {
            this.currentDifficulty = difficulty;
        }
    }

    generatePattern(pattern, startZ) {
        const platforms = [];
        const obstacles = [];
        const collectibles = [];

        for (let i = 0; i < pattern.lanes.length; i++) {
            const lane = pattern.lanes[i];
            const z = startZ - (i * 3);

            // Create platform
            platforms.push({
                lane: lane,
                z: z
            });

            // Create obstacle if specified
            if (pattern.obstacles[i] === 1) {
                obstacles.push({
                    lane: lane,
                    z: z
                });
            }

            // Create collectible if specified
            if (pattern.collectibles[i] === 1) {
                collectibles.push({
                    lane: lane,
                    z: z
                });
            }
        }

        return { platforms, obstacles, collectibles };
    }
}

export default PatternGenerator;
