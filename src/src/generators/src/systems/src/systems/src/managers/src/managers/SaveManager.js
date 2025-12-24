export class SaveManager {
    constructor() {
        this.storageKey = 'rush_3d_save';
        this.data = this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load save data:', error);
        }
        
        return this.getDefaultData();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.warn('Failed to save data:', error);
        }
    }

    getDefaultData() {
        return {
            bestScore: 0,
            totalGames: 0,
            totalScore: 0,
            settings: {
                music: true,
                sfx: true,
                vibration: true,
                quality: 'medium'
            }
        };
    }

    getBestScore() {
        return this.data.bestScore || 0;
    }

    setBestScore(score) {
        if (score > this.data.bestScore) {
            this.data.bestScore = score;
            this.save();
            return true;
        }
        return false;
    }

    incrementGames() {
        this.data.totalGames++;
        this.save();
    }

    addToTotalScore(score) {
        this.data.totalScore += score;
        this.save();
    }

    getSetting(key) {
        return this.data.settings[key];
    }

    setSetting(key, value) {
        this.data.settings[key] = value;
        this.save();
    }

    reset() {
        this.data = this.getDefaultData();
        this.save();
    }
}

export default SaveManager;
