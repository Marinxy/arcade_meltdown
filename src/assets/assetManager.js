/**
 * Arcade Meltdown - Asset Manager
 * Manages loading and caching of game assets (sprites, sounds, etc.)
 */

class AssetManager {
    /**
     * Create a new Asset Manager
     */
    constructor() {
        this.images = new Map();
        this.sounds = new Map();
        this.fonts = new Map();
        this.loadingPromises = new Map();
    }
    
    /**
     * Initialize the asset manager
     */
    init() {
        // Preload essential assets
        this.preloadEssentialAssets();
    }
    
    /**
     * Preload essential assets that are needed immediately
     */
    async preloadEssentialAssets() {
        const essentialAssets = [
            'assets/sprites/players/heavy.png',
            'assets/sprites/players/scout.png',
            'assets/sprites/players/engineer.png',
            'assets/sprites/players/medic.png',
            'assets/sprites/enemies/grunt.png',
            'assets/sprites/bullets/bullet.png',
            'assets/sprites/ui/crosshair.png'
        ];
        
        for (const assetPath of essentialAssets) {
            await this.loadImage(assetPath);
        }
    }
    
    /**
     * Load an image asset
     * @param {string} path - Path to the image file
     * @returns {Promise<HTMLImageElement>} Promise that resolves to the loaded image
     */
    loadImage(path) {
        // Return cached image if already loaded
        if (this.images.has(path)) {
            return Promise.resolve(this.images.get(path));
        }
        
        // Return existing promise if already loading
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }
        
        // Create loading promise
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.images.set(path, img);
                this.loadingPromises.delete(path);
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load image: ${path}, using placeholder`);
                // Create a colored rectangle as fallback
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext('2d');
                
                // Draw colored rectangle based on path
                const color = this.getColorFromPath(path);
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 32, 32);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(0, 0, 32, 32);
                
                // Convert canvas to image
                const fallbackImg = new Image();
                fallbackImg.src = canvas.toDataURL();
                fallbackImg.onload = () => {
                    this.images.set(path, fallbackImg);
                    this.loadingPromises.delete(path);
                    resolve(fallbackImg);
                };
            };
            
            img.src = path;
        });
        
        this.loadingPromises.set(path, promise);
        return promise;
    }
    
    /**
     * Load a sound asset
     * @param {string} path - Path to the sound file
     * @returns {Promise<HTMLAudioElement>} Promise that resolves to the loaded audio
     */
    loadSound(path) {
        // Return cached sound if already loaded
        if (this.sounds.has(path)) {
            return Promise.resolve(this.sounds.get(path));
        }
        
        // Return existing promise if already loading
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }
        
        // Create loading promise
        const promise = new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.oncanplaythrough = () => {
                this.sounds.set(path, audio);
                this.loadingPromises.delete(path);
                resolve(audio);
            };
            
            audio.onerror = () => {
                console.warn(`Failed to load sound: ${path}, using silent audio`);
                // Create silent audio as fallback
                const silentAudio = new Audio();
                silentAudio.volume = 0;
                this.sounds.set(path, silentAudio);
                this.loadingPromises.delete(path);
                resolve(silentAudio);
            };
            
            audio.src = path;
            audio.load();
        });
        
        this.loadingPromises.set(path, promise);
        return promise;
    }
    
    /**
     * Get a loaded image
     * @param {string} path - Path to the image file
     * @returns {HTMLImageElement|null} The loaded image or null if not loaded
     */
    getImage(path) {
        return this.images.get(path) || null;
    }
    
    /**
     * Get a loaded sound
     * @param {string} path - Path to the sound file
     * @returns {HTMLAudioElement|null} The loaded sound or null if not loaded
     */
    getSound(path) {
        return this.sounds.get(path) || null;
    }
    
    /**
     * Get color based on asset path for placeholder generation
     * @param {string} path - Asset path
     * @returns {string} Color hex code
     */
    getColorFromPath(path) {
        if (path.includes('heavy')) return '#8B4513';
        if (path.includes('scout')) return '#00FF00';
        if (path.includes('engineer')) return '#FFA500';
        if (path.includes('medic')) return '#FF0000';
        if (path.includes('grunt')) return '#800080';
        if (path.includes('spitter')) return '#00FFFF';
        if (path.includes('bruiser')) return '#FF4500';
        if (path.includes('miniBoss')) return '#FFD700';
        if (path.includes('boss')) return '#DC143C';
        if (path.includes('bullet')) return '#FFFF00';
        if (path.includes('explosion')) return '#FF4500';
        if (path.includes('crosshair')) return '#FFFFFF';
        return '#808080'; // Default gray
    }
    
    /**
     * Check if an asset is loaded
     * @param {string} path - Path to the asset
     * @returns {boolean} True if loaded
     */
    isLoaded(path) {
        return this.images.has(path) || this.sounds.has(path);
    }
    
    /**
     * Get loading progress (0-1)
     * @returns {number} Loading progress
     */
    getLoadingProgress() {
        const totalAssets = this.images.size + this.sounds.size + this.loadingPromises.size;
        const loadedAssets = this.images.size + this.sounds.size;
        return totalAssets > 0 ? loadedAssets / totalAssets : 1;
    }
    
    /**
     * Clear all cached assets
     */
    clear() {
        this.images.clear();
        this.sounds.clear();
        this.fonts.clear();
        this.loadingPromises.clear();
    }
    
    /**
     * Destroy the asset manager
     */
    destroy() {
        this.clear();
    }
}

// Export for use in modules
export default AssetManager;
