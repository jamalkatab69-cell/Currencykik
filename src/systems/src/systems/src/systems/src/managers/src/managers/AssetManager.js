import * as THREE from 'three';

export class AssetManager {
    constructor() {
        this.assets = {
            textures: {},
            audio: {},
            models: {}
        };
        this.loaders = {
            texture: new THREE.TextureLoader(),
            audio: null // Would use AudioLoader in production
        };
    }

    async load(type, name, url) {
        try {
            switch(type) {
                case 'texture':
                    return await this.loadTexture(name, url);
                case 'audio':
                    return await this.loadAudio(name, url);
                default:
                    throw new Error(`Unknown asset type: ${type}`);
            }
        } catch (error) {
            console.warn(`Failed to load ${type} ${name}:`, error);
            return null;
        }
    }

    async loadTexture(name, url) {
        return new Promise((resolve, reject) => {
            this.loaders.texture.load(
                url,
                (texture) => {
                    this.assets.textures[name] = texture;
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }

    async loadAudio(name, url) {
        // Placeholder for audio loading
        return Promise.resolve(null);
    }

    get(type, name) {
        return this.assets[type + 's']?.[name];
    }

    getTexture(name) {
        return this.assets.textures[name];
    }

    getAudio(name) {
        return this.assets.audio[name];
    }
}

export default AssetManager;
