export class ScoreSystem {
    constructor(game) {
        this.game = game;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.lastScoreTime = 0;
        this.comboTimeout = 3000; // ms
    }

    reset() {
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.lastScoreTime = 0;
    }

    addScore(points) {
        // Add combo multiplier
        const multiplier = 1 + (this.combo * 0.1);
        const finalPoints = Math.floor(points * multiplier);
        
        this.score += finalPoints;
        this.incrementCombo();
        
        console.log(`+${finalPoints} points (combo x${this.combo})`);
    }

    incrementCombo() {
        this.combo++;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        this.lastScoreTime = Date.now();
    }

    breakCombo() {
        if (this.combo > 0) {
            console.log(`Combo broken! Max: ${this.combo}`);
        }
        this.combo = 0;
    }

    update() {
        // Check combo timeout
        if (this.combo > 0 && Date.now() - this.lastScoreTime > this.comboTimeout) {
            this.breakCombo();
        }
    }

    getScore() {
        return this.score;
    }

    getCombo() {
        return this.combo;
    }

    getMaxCombo() {
        return this.maxCombo;
    }
}

export default ScoreSystem;
