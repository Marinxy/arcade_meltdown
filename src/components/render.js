/**
 * Arcade Meltdown - Render Component
 * Handles rendering properties and methods for entities
 */

class Render {
    /**
     * Create a new Render component
     * @param {string} sprite - Sprite name or path (optional)
     * @param {string} color - Color to use if no sprite (optional)
     */
    constructor(sprite = null, color = '#ffffff') {
        // Sprite or image to render
        this.sprite = sprite;
        
        // Color to use if no sprite
        this.color = color;
        
        // Whether the entity is visible
        this.visible = true;
        
        // Rendering layer (higher numbers render on top)
        this.layer = 0;
        
        // Opacity (0-1)
        this.opacity = 1;
        
        // Scale for rendering
        this.scale = { x: 1, y: 1 };
        
        // Rotation offset in radians
        this.rotationOffset = 0;
        
        // Pivot point for rotation and scaling (0-1, relative to entity size)
        this.pivot = { x: 0.5, y: 0.5 };
        
        // Whether to flip horizontally
        this.flipX = false;
        
        // Whether to flip vertically
        this.flipY = false;
        
        // Tint color (applied as overlay)
        this.tintColor = null;
        
        // Blend mode
        this.blendMode = 'source-over';
        
        // Custom render function (if needed)
        this.customRender = null;
        
        // Animation properties
        this.animation = {
            frames: [],
            currentFrame: 0,
            frameTime: 0,
            frameDuration: 100, // ms per frame
            playing: false,
            loop: true
        };
    }
    
    /**
     * Set the sprite
     * @param {string} sprite - Sprite name or path
     */
    setSprite(sprite) {
        this.sprite = sprite;
    }
    
    /**
     * Set the color
     * @param {string} color - Color string
     */
    setColor(color) {
        this.color = color;
    }
    
    /**
     * Set the opacity
     * @param {number} opacity - Opacity value (0-1)
     */
    setOpacity(opacity) {
        this.opacity = Math.max(0, Math.min(1, opacity));
    }
    
    /**
     * Hide the entity
     */
    hide() {
        this.visible = false;
    }
    
    /**
     * Show the entity
     */
    show() {
        this.visible = true;
    }
    
    /**
     * Toggle visibility
     */
    toggleVisibility() {
        this.visible = !this.visible;
    }
    
    /**
     * Set the scale
     * @param {number} sx - X scale
     * @param {number} sy - Y scale (optional, defaults to sx)
     */
    setScale(sx, sy = sx) {
        this.scale.x = sx;
        this.scale.y = sy;
    }
    
    /**
     * Set the rotation offset
     * @param {number} rotation - Rotation in radians
     */
    setRotationOffset(rotation) {
        this.rotationOffset = rotation;
    }
    
    /**
     * Set the pivot point
     * @param {number} x - X pivot (0-1)
     * @param {number} y - Y pivot (0-1)
     */
    setPivot(x, y) {
        this.pivot.x = Math.max(0, Math.min(1, x));
        this.pivot.y = Math.max(0, Math.min(1, y));
    }
    
    /**
     * Set horizontal flip
     * @param {boolean} flip - Whether to flip horizontally
     */
    setFlipX(flip) {
        this.flipX = flip;
    }
    
    /**
     * Set vertical flip
     * @param {boolean} flip - Whether to flip vertically
     */
    setFlipY(flip) {
        this.flipY = flip;
    }
    
    /**
     * Set the tint color
     * @param {string} color - Tint color string
     */
    setTintColor(color) {
        this.tintColor = color;
    }
    
    /**
     * Clear the tint color
     */
    clearTintColor() {
        this.tintColor = null;
    }
    
    /**
     * Set the blend mode
     * @param {string} blendMode - Canvas blend mode string
     */
    setBlendMode(blendMode) {
        this.blendMode = blendMode;
    }
    
    /**
     * Set a custom render function
     * @param {Function} renderFunc - Custom render function
     */
    setCustomRender(renderFunc) {
        this.customRender = renderFunc;
    }
    
    /**
     * Set up an animation
     * @param {Array} frames - Array of frame indices or names
     * @param {number} frameDuration - Duration of each frame in ms
     * @param {boolean} loop - Whether to loop the animation
     */
    setAnimation(frames, frameDuration, loop = true) {
        this.animation.frames = frames;
        this.animation.frameDuration = frameDuration;
        this.animation.loop = loop;
        this.animation.currentFrame = 0;
        this.animation.frameTime = 0;
    }
    
    /**
     * Play the current animation
     */
    playAnimation() {
        this.animation.playing = true;
    }
    
    /**
     * Pause the current animation
     */
    pauseAnimation() {
        this.animation.playing = false;
    }
    
    /**
     * Stop the current animation and reset to first frame
     */
    stopAnimation() {
        this.animation.playing = false;
        this.animation.currentFrame = 0;
        this.animation.frameTime = 0;
    }
    
    /**
     * Update the animation
     * @param {number} deltaTime - Time elapsed in ms
     */
    updateAnimation(deltaTime) {
        if (!this.animation.playing || this.animation.frames.length === 0) return;
        
        this.animation.frameTime += deltaTime;
        
        while (this.animation.frameTime >= this.animation.frameDuration) {
            this.animation.frameTime -= this.animation.frameDuration;
            this.animation.currentFrame++;
            
            // Check if we've reached the end of the animation
            if (this.animation.currentFrame >= this.animation.frames.length) {
                if (this.animation.loop) {
                    this.animation.currentFrame = 0;
                } else {
                    this.animation.currentFrame = this.animation.frames.length - 1;
                    this.animation.playing = false;
                }
            }
        }
    }
    
    /**
     * Get the current animation frame
     * @returns {*} Current frame
     */
    getCurrentFrame() {
        if (this.animation.frames.length === 0) return null;
        return this.animation.frames[this.animation.currentFrame];
    }
    
    /**
     * Clone this render component
     * @returns {Render} A new render component with the same values
     */
    clone() {
        const render = new Render(this.sprite, this.color);
        render.visible = this.visible;
        render.layer = this.layer;
        render.opacity = this.opacity;
        render.scale = { ...this.scale };
        render.rotationOffset = this.rotationOffset;
        render.pivot = { ...this.pivot };
        render.flipX = this.flipX;
        render.flipY = this.flipY;
        render.tintColor = this.tintColor;
        render.blendMode = this.blendMode;
        render.customRender = this.customRender;
        
        // Copy animation
        render.animation = {
            frames: [...this.animation.frames],
            currentFrame: this.animation.currentFrame,
            frameTime: this.animation.frameTime,
            frameDuration: this.animation.frameDuration,
            playing: this.animation.playing,
            loop: this.animation.loop
        };
        
        return render;
    }
    
    /**
     * Copy values from another render component
     * @param {Render} other - Render component to copy from
     */
    copy(other) {
        this.sprite = other.sprite;
        this.color = other.color;
        this.visible = other.visible;
        this.layer = other.layer;
        this.opacity = other.opacity;
        this.scale = { ...other.scale };
        this.rotationOffset = other.rotationOffset;
        this.pivot = { ...other.pivot };
        this.flipX = other.flipX;
        this.flipY = other.flipY;
        this.tintColor = other.tintColor;
        this.blendMode = other.blendMode;
        this.customRender = other.customRender;
        
        // Copy animation
        this.animation = {
            frames: [...other.animation.frames],
            currentFrame: other.animation.currentFrame,
            frameTime: other.animation.frameTime,
            frameDuration: other.animation.frameDuration,
            playing: other.animation.playing,
            loop: other.animation.loop
        };
    }
    
    /**
     * Convert to string representation
     * @returns {string} String representation
     */
    toString() {
        return `Render(sprite: ${this.sprite}, color: ${this.color}, visible: ${this.visible}, layer: ${this.layer}, opacity: ${this.opacity.toFixed(2)})`;
    }
}

// Export for use in modules
export default Render;