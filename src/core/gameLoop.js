/**
 * Arcade Meltdown - Game Loop
 * Implements a fixed timestep game loop for consistent physics and gameplay
 */

class GameLoop {
    /**
     * Create a new Game Loop
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Fixed timestep configuration
        this.fixedDeltaTime = 1 / 60; // 60 FPS physics
        this.maxDeltaTime = 0.25; // Maximum delta time to prevent spiral of death
        this.accumulator = 0;
        
        // FPS tracking
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.fps = 0;
        this.frameTime = 0;
        this.lastFrameTime = 0;
        
        // Timing variables
        this.lastTime = 0;
        this.currentTime = 0;
        this.deltaTime = 0;
        
        // Running state
        this.running = false;
        this.paused = false;
        
        // Animation frame ID
        this.animationFrameId = null;
    }
    
    /**
     * Start the game loop
     */
    start() {
        if (this.running) return;
        
        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();
        this.lastFpsUpdate = this.lastTime;
        this.lastFrameTime = this.lastTime;
        this.frameCount = 0;
        this.accumulator = 0;
        
        // Start the loop
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
    
    /**
     * Stop the game loop
     */
    stop() {
        if (!this.running) return;
        
        this.running = false;
        
        // Cancel the animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Pause or resume the game loop
     * @param {boolean} paused - Whether to pause the game
     */
    setPaused(paused) {
        this.paused = paused;
        
        if (!paused && this.running) {
            // Reset timing to avoid large delta time when resuming
            this.lastTime = performance.now();
        }
    }
    
    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp provided by requestAnimationFrame
     */
    loop(timestamp) {
        if (!this.running) return;
        
        // Calculate delta time
        this.currentTime = timestamp;
        this.deltaTime = (this.currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = this.currentTime;
        
        // Prevent spiral of death by clamping delta time
        if (this.deltaTime > this.maxDeltaTime) {
            this.deltaTime = this.maxDeltaTime;
        }
        
        // Update FPS counter
        this.updateFPS(timestamp);
        
        // If paused, skip updates but continue rendering
        if (this.paused) {
            this.render();
            this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
            return;
        }
        
        // Fixed timestep update
        this.accumulator += this.deltaTime;
        
        let updateCount = 0;
        const maxUpdates = 5; // Limit the number of updates to prevent spiral of death
        
        while (this.accumulator >= this.fixedDeltaTime && updateCount < maxUpdates) {
            this.update(this.fixedDeltaTime);
            this.accumulator -= this.fixedDeltaTime;
            updateCount++;
        }
        
        // Calculate interpolation factor for rendering
        const alpha = this.accumulator / this.fixedDeltaTime;
        
        // Render with interpolation
        this.render(alpha);
        
        // Continue the loop
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
    
    /**
     * Update game state
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update the game engine
        this.gameEngine.update(deltaTime);
    }
    
    /**
     * Render game state
     * @param {number} alpha - Interpolation factor (0-1)
     */
    render(alpha) {
        // Calculate frame time
        const currentTime = performance.now();
        this.frameTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Render the game engine
        this.gameEngine.render(alpha);
    }
    
    /**
     * Update FPS counter
     * @param {number} timestamp - Current timestamp
     */
    updateFPS(timestamp) {
        this.frameCount++;
        
        // Update FPS every second
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = timestamp;
            
            // Emit FPS update event
            window.eventSystem.emit('gameLoop:fpsUpdate', this.fps);
        }
    }
    
    /**
     * Get the current FPS
     * @returns {number} Current FPS
     */
    getFPS() {
        return this.fps;
    }
    
    /**
     * Get the current frame time
     * @returns {number} Current frame time in milliseconds
     */
    getFrameTime() {
        return this.frameTime;
    }
    
    /**
     * Get the current delta time
     * @returns {number} Current delta time in seconds
     */
    getDeltaTime() {
        return this.deltaTime;
    }
    
    /**
     * Check if the game loop is running
     * @returns {boolean} True if the game loop is running
     */
    isRunning() {
        return this.running;
    }
    
    /**
     * Check if the game is paused
     * @returns {boolean} True if the game is paused
     */
    isPaused() {
        return this.paused;
    }
}

// Export for use in modules
export default GameLoop;