export class AudioSystem {
    constructor() {
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentMusic = null;
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
    }

    init() {
        // Initialize audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('🔊 Audio system initialized');
    }

    playSFX(soundName) {
        if (!this.sfxEnabled) return;
        
        // For now, use simple beep sounds
        // In production, you would load actual audio files
        const frequency = this.getSFXFrequency(soundName);
        this.playBeep(frequency, 0.1, this.sfxVolume);
    }

    getSFXFrequency(soundName) {
        const frequencies = {
            'move': 400,
            'jump': 600,
            'collect': 800,
            'crash': 200,
            'fall': 150,
            'gameover': 100
        };
        return frequencies[soundName] || 440;
    }

    playBeep(frequency, duration, volume) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMusic(musicName) {
        if (!this.musicEnabled) return;
        
        // Stop current music
        this.stopMusic();
        
        // In production, load and play actual music file
        console.log(`🎵 Playing music: ${musicName}`);
        this.currentMusic = musicName;
    }

    stopMusic() {
        if (this.currentMusic) {
            console.log(`🎵 Stopping music: ${this.currentMusic}`);
            this.currentMusic = null;
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            console.log(`⏸ Music paused`);
        }
    }

    resumeMusic() {
        if (this.currentMusic) {
            console.log(`▶ Music resumed`);
        }
    }

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
    }

    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}

export default AudioSystem;
