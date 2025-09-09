/**
 * Arcade Meltdown - Glitch/CRT Visual Effect System
 * Creates retro CRT monitor and glitch effects for visual style
 */

class GlitchEffect {
    /**
     * Create a new Glitch Effect system
     * @param {GameEngine} gameEngine - Game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Effect properties
        this.enabled = true;
        this.intensity = 0; // Current effect intensity (0-1)
        this.targetIntensity = 0; // Target effect intensity
        this.intensityChangeSpeed = 2; // Speed of intensity changes
        
        // CRT properties
        this.crtEnabled = true;
        this.crtCurve = 0.2; // CRT monitor curve
        this.crtBrightness = 1.1; // CRT brightness
        this.crtContrast = 1.1; // CRT contrast
        this.crtSaturation = 1.1; // CRT saturation
        this.scanlineCount = 200; // Number of scanlines
        this.scanlineOpacity = 0.1; // Opacity of scanlines
        
        // Glitch properties
        this.glitchEnabled = true;
        this.glitchProbability = 0.05; // Probability of glitch effect
        this.glitchIntensity = 0.2; // Intensity of glitch effects
        this.glitchDuration = 0.2; // Duration of glitch effects in seconds
        this.glitchCooldown = 1; // Cooldown between glitch effects in seconds
        this.glitchTimer = 0; // Timer for glitch cooldown
        this.activeGlitches = []; // Currently active glitch effects
        
        // Chromatic aberration properties
        this.chromaticAberrationEnabled = true;
        this.chromaticAberrationIntensity = 2; // Intensity of chromatic aberration
        
        // Noise properties
        this.noiseEnabled = true;
        this.noiseIntensity = 0.1; // Intensity of noise effect
        
        // Vignette properties
        this.vignetteEnabled = true;
        this.vignetteIntensity = 0.5; // Intensity of vignette effect
        this.vignetteRadius = 0.8; // Radius of vignette effect
        
        // Flicker properties
        this.flickerEnabled = true;
        this.flickerIntensity = 0.05; // Intensity of flicker effect
        this.flickerSpeed = 10; // Speed of flicker effect
        this.flickerTimer = 0; // Timer for flicker effect
        
        // Screen shake properties
        this.screenShakeEnabled = true;
        this.screenShakeIntensity = 0; // Current screen shake intensity
        this.screenShakeDecay = 5; // Decay rate of screen shake
        this.screenShakeOffsetX = 0; // Current X offset
        this.screenShakeOffsetY = 0; // Current Y offset
        
        // Color shift properties
        this.colorShiftEnabled = true;
        this.colorShiftIntensity = 0; // Current color shift intensity
        this.colorShiftDecay = 3; // Decay rate of color shift
        this.colorShiftHue = 0; // Current hue shift
        this.colorShiftTimer = 0; // Timer for color shift
        
        // Initialize system
        this.init();
    }
    
    /**
     * Initialize the glitch effect system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Create offscreen canvas for effects
        this.createOffscreenCanvas();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for chaos meter changes
        window.eventSystem.on('chaos:increase', (chaosLevel, amount) => {
            this.onChaosIncrease(chaosLevel, amount);
        });
        
        // Listen for chaos tier changes
        window.eventSystem.on('chaos:tierChange', (newTier, oldTier) => {
            this.onChaosTierChange(newTier, oldTier);
        });
        
        // Listen for boss phase transitions
        window.eventSystem.on('boss:phaseTransition', (boss, phase) => {
            this.onBossPhaseTransition(boss, phase);
        });
        
        // Listen for boss enrage
        window.eventSystem.on('boss:enrage', (boss) => {
            this.onBossEnrage(boss);
        });
        
        // Listen for mini-boss phase transitions
        window.eventSystem.on('miniBoss:phaseTransition', (miniBoss, phase) => {
            this.onMiniBossPhaseTransition(miniBoss, phase);
        });
        
        // Listen for player death
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        // Listen for wave complete
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
        });
    }
    
    /**
     * Create offscreen canvas for effects
     */
    createOffscreenCanvas() {
        // Create offscreen canvas
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.gameEngine.canvas.width;
        this.offscreenCanvas.height = this.gameEngine.canvas.height;
        
        // Get offscreen context
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        
        // Create effect canvas
        this.effectCanvas = document.createElement('canvas');
        this.effectCanvas.width = this.gameEngine.canvas.width;
        this.effectCanvas.height = this.gameEngine.canvas.height;
        
        // Get effect context
        this.effectCtx = this.effectCanvas.getContext('2d');
    }
    
    /**
     * Update the glitch effect system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update intensity
        if (this.intensity !== this.targetIntensity) {
            const diff = this.targetIntensity - this.intensity;
            this.intensity += diff * this.intensityChangeSpeed * deltaTime;
            
            // Clamp intensity
            this.intensity = Math.max(0, Math.min(1, this.intensity));
        }
        
        // Update screen shake
        this.updateScreenShake(deltaTime);
        
        // Update color shift
        this.updateColorShift(deltaTime);
        
        // Update flicker
        this.updateFlicker(deltaTime);
        
        // Update glitch timer
        if (this.glitchTimer > 0) {
            this.glitchTimer -= deltaTime;
        }
        
        // Update active glitches
        this.updateActiveGlitches(deltaTime);
        
        // Try to trigger new glitch
        if (this.glitchTimer <= 0 && this.glitchEnabled) {
            this.tryTriggerGlitch();
        }
        
        // Resize offscreen canvases if needed
        this.resizeCanvases();
    }
    
    /**
     * Update screen shake
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateScreenShake(deltaTime) {
        // Update screen shake intensity
        if (this.screenShakeIntensity > 0) {
            this.screenShakeIntensity = Math.max(0, this.screenShakeIntensity - this.screenShakeDecay * deltaTime);
        }
        
        // Calculate screen shake offset
        if (this.screenShakeIntensity > 0) {
            this.screenShakeOffsetX = (Math.random() - 0.5) * this.screenShakeIntensity * 10;
            this.screenShakeOffsetY = (Math.random() - 0.5) * this.screenShakeIntensity * 10;
        } else {
            this.screenShakeOffsetX = 0;
            this.screenShakeOffsetY = 0;
        }
    }
    
    /**
     * Update color shift
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateColorShift(deltaTime) {
        // Update color shift intensity
        if (this.colorShiftIntensity > 0) {
            this.colorShiftIntensity = Math.max(0, this.colorShiftIntensity - this.colorShiftDecay * deltaTime);
        }
        
        // Update color shift timer
        this.colorShiftTimer += deltaTime;
        
        // Calculate hue shift
        if (this.colorShiftIntensity > 0) {
            this.colorShiftHue = Math.sin(this.colorShiftTimer * 5) * this.colorShiftIntensity * 30;
        } else {
            this.colorShiftHue = 0;
        }
    }
    
    /**
     * Update flicker
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateFlicker(deltaTime) {
        // Update flicker timer
        this.flickerTimer += deltaTime;
    }
    
    /**
     * Update active glitches
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateActiveGlitches(deltaTime) {
        // Update each active glitch
        for (let i = this.activeGlitches.length - 1; i >= 0; i--) {
            const glitch = this.activeGlitches[i];
            
            // Update glitch timer
            glitch.timer -= deltaTime;
            
            // Remove glitch if timer expired
            if (glitch.timer <= 0) {
                this.activeGlitches.splice(i, 1);
            }
        }
    }
    
    /**
     * Try to trigger a glitch effect
     */
    tryTriggerGlitch() {
        // Calculate glitch probability based on intensity
        const probability = this.glitchProbability * (1 + this.intensity * 2);
        
        // Check if should trigger glitch
        if (Math.random() < probability) {
            // Create glitch effect
            const glitch = {
                type: this.getRandomGlitchType(),
                timer: this.glitchDuration,
                intensity: this.glitchIntensity * (0.5 + Math.random() * 0.5) * (1 + this.intensity)
            };
            
            // Add to active glitches
            this.activeGlitches.push(glitch);
            
            // Set glitch cooldown
            this.glitchTimer = this.glitchCooldown;
        }
    }
    
    /**
     * Get random glitch type
     * @returns {string} Random glitch type
     */
    getRandomGlitchType() {
        const glitchTypes = [
            'digital',
            'chromatic',
            'slice',
            'displacement',
            'pixelate'
        ];
        
        return glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
    }
    
    /**
     * Apply effects to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    applyEffects(ctx) {
        // Skip if not enabled
        if (!this.enabled) return;
        
        // Save context state
        ctx.save();
        
        // Apply screen shake offset
        ctx.translate(this.screenShakeOffsetX, this.screenShakeOffsetY);
        
        // Restore context state
        ctx.restore();
        
        // Apply effects to offscreen canvas
        this.applyEffectsToOffscreenCanvas();
        
        // Draw offscreen canvas to main canvas
        ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
    
    /**
     * Apply effects to offscreen canvas
     */
    applyEffectsToOffscreenCanvas() {
        // Get main context
        const ctx = this.gameEngine.ctx;
        
        // Copy main canvas to offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.drawImage(this.gameEngine.canvas, 0, 0);
        
        // Apply CRT effect
        if (this.crtEnabled) {
            this.applyCRTEffect();
        }
        
        // Apply glitch effects
        if (this.glitchEnabled && this.activeGlitches.length > 0) {
            this.applyGlitchEffects();
        }
        
        // Apply chromatic aberration
        if (this.chromaticAberrationEnabled) {
            this.applyChromaticAberration();
        }
        
        // Apply noise
        if (this.noiseEnabled) {
            this.applyNoise();
        }
        
        // Apply vignette
        if (this.vignetteEnabled) {
            this.applyVignette();
        }
        
        // Apply flicker
        if (this.flickerEnabled) {
            this.applyFlicker();
        }
        
        // Apply color shift
        if (this.colorShiftEnabled && this.colorShiftIntensity > 0) {
            this.applyColorShift();
        }
    }
    
    /**
     * Apply CRT effect
     */
    applyCRTEffect() {
        // Create temporary canvas for CRT effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Apply brightness and contrast
        this.offscreenCtx.filter = `brightness(${this.crtBrightness}) contrast(${this.crtContrast}) saturate(${this.crtSaturation})`;
        this.offscreenCtx.drawImage(tempCanvas, 0, 0);
        this.offscreenCtx.filter = 'none';
        
        // Apply scanlines
        this.offscreenCtx.strokeStyle = 'rgba(0, 0, 0, ' + this.scanlineOpacity + ')';
        this.offscreenCtx.lineWidth = 1;
        
        const scanlineHeight = this.offscreenCanvas.height / this.scanlineCount;
        for (let i = 0; i < this.scanlineCount; i++) {
            const y = i * scanlineHeight;
            this.offscreenCtx.beginPath();
            this.offscreenCtx.moveTo(0, y);
            this.offscreenCtx.lineTo(this.offscreenCanvas.width, y);
            this.offscreenCtx.stroke();
        }
        
        // Apply CRT curve (barrel distortion)
        // This is a simplified version - a full implementation would use WebGL shaders
        const centerX = this.offscreenCanvas.width / 2;
        const centerY = this.offscreenCanvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Create image data for pixel manipulation
        const imageData = this.offscreenCtx.getImageData(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        const data = imageData.data;
        
        // Apply barrel distortion
        for (let y = 0; y < this.offscreenCanvas.height; y++) {
            for (let x = 0; x < this.offscreenCanvas.width; x++) {
                // Calculate distance from center
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate distortion factor
                const distortion = 1 + this.crtCurve * (distance / maxDistance) * (distance / maxDistance);
                
                // Calculate source position
                const srcX = centerX + dx / distortion;
                const srcY = centerY + dy / distortion;
                
                // Skip if outside bounds
                if (srcX < 0 || srcX >= this.offscreenCanvas.width || 
                    srcY < 0 || srcY >= this.offscreenCanvas.height) {
                    continue;
                }
                
                // Calculate source and destination indices
                const srcIndex = (Math.floor(srcY) * this.offscreenCanvas.width + Math.floor(srcX)) * 4;
                const dstIndex = (y * this.offscreenCanvas.width + x) * 4;
                
                // Copy pixel data
                data[dstIndex] = data[srcIndex];         // R
                data[dstIndex + 1] = data[srcIndex + 1]; // G
                data[dstIndex + 2] = data[srcIndex + 2]; // B
                data[dstIndex + 3] = data[srcIndex + 3]; // A
            }
        }
        
        // Put modified image data back
        this.offscreenCtx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Apply glitch effects
     */
    applyGlitchEffects() {
        // Apply each active glitch
        for (const glitch of this.activeGlitches) {
            switch (glitch.type) {
                case 'digital':
                    this.applyDigitalGlitch(glitch.intensity);
                    break;
                    
                case 'chromatic':
                    this.applyChromaticGlitch(glitch.intensity);
                    break;
                    
                case 'slice':
                    this.applySliceGlitch(glitch.intensity);
                    break;
                    
                case 'displacement':
                    this.applyDisplacementGlitch(glitch.intensity);
                    break;
                    
                case 'pixelate':
                    this.applyPixelateGlitch(glitch.intensity);
                    break;
            }
        }
    }
    
    /**
     * Apply digital glitch effect
     * @param {number} intensity - Glitch intensity
     */
    applyDigitalGlitch(intensity) {
        // Create image data for pixel manipulation
        const imageData = this.offscreenCtx.getImageData(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        const data = imageData.data;
        
        // Calculate number of pixels to affect
        const pixelCount = this.offscreenCanvas.width * this.offscreenCanvas.height;
        const affectedPixels = Math.floor(pixelCount * intensity * 0.1);
        
        // Apply digital noise to random pixels
        for (let i = 0; i < affectedPixels; i++) {
            // Select random pixel
            const pixelIndex = Math.floor(Math.random() * pixelCount) * 4;
            
            // Apply random color shift
            const shift = Math.floor(Math.random() * 100) - 50;
            data[pixelIndex] = Math.max(0, Math.min(255, data[pixelIndex] + shift));     // R
            data[pixelIndex + 1] = Math.max(0, Math.min(255, data[pixelIndex + 1] + shift)); // G
            data[pixelIndex + 2] = Math.max(0, Math.min(255, data[pixelIndex + 2] + shift)); // B
        }
        
        // Put modified image data back
        this.offscreenCtx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Apply chromatic glitch effect
     * @param {number} intensity - Glitch intensity
     */
    applyChromaticGlitch(intensity) {
        // Create temporary canvas for chromatic aberration
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Calculate offset based on intensity
        const offset = intensity * 10;
        
        // Draw red channel with offset
        this.offscreenCtx.globalCompositeOperation = 'screen';
        this.offscreenCtx.fillStyle = 'red';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.globalCompositeOperation = 'destination-in';
        this.offscreenCtx.drawImage(tempCanvas, -offset, 0);
        
        // Draw green channel with no offset
        this.offscreenCtx.globalCompositeOperation = 'screen';
        this.offscreenCtx.fillStyle = 'green';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.globalCompositeOperation = 'destination-in';
        this.offscreenCtx.drawImage(tempCanvas, 0, 0);
        
        // Draw blue channel with offset
        this.offscreenCtx.globalCompositeOperation = 'screen';
        this.offscreenCtx.fillStyle = 'blue';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.globalCompositeOperation = 'destination-in';
        this.offscreenCtx.drawImage(tempCanvas, offset, 0);
        
        // Reset composite operation
        this.offscreenCtx.globalCompositeOperation = 'source-over';
    }
    
    /**
     * Apply slice glitch effect
     * @param {number} intensity - Glitch intensity
     */
    applySliceGlitch(intensity) {
        // Create temporary canvas for slice effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Draw temporary canvas to offscreen canvas
        this.offscreenCtx.drawImage(tempCanvas, 0, 0);
        
        // Calculate number of slices based on intensity
        const sliceCount = Math.floor(intensity * 10) + 1;
        
        // Apply random slices
        for (let i = 0; i < sliceCount; i++) {
            // Calculate slice position
            const y = Math.random() * this.offscreenCanvas.height;
            const height = Math.random() * 50 + 10;
            const offset = (Math.random() - 0.5) * intensity * 50;
            
            // Get slice image data
            const sliceData = this.offscreenCtx.getImageData(0, y, this.offscreenCanvas.width, height);
            
            // Clear slice area
            this.offscreenCtx.clearRect(0, y, this.offscreenCanvas.width, height);
            
            // Draw slice with offset
            this.offscreenCtx.putImageData(sliceData, offset, y);
        }
    }
    
    /**
     * Apply displacement glitch effect
     * @param {number} intensity - Glitch intensity
     */
    applyDisplacementGlitch(intensity) {
        // Create temporary canvas for displacement effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Draw temporary canvas to offscreen canvas
        this.offscreenCtx.drawImage(tempCanvas, 0, 0);
        
        // Create image data for pixel manipulation
        const imageData = this.offscreenCtx.getImageData(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        const data = imageData.data;
        
        // Apply displacement
        const gridSize = Math.floor(10 / intensity) + 1;
        
        for (let y = 0; y < this.offscreenCanvas.height; y += gridSize) {
            for (let x = 0; x < this.offscreenCanvas.width; x += gridSize) {
                // Calculate random displacement
                const dx = (Math.random() - 0.5) * intensity * 20;
                const dy = (Math.random() - 0.5) * intensity * 20;
                
                // Calculate source and destination positions
                const srcX = Math.floor(x);
                const srcY = Math.floor(y);
                const dstX = Math.floor(x + dx);
                const dstY = Math.floor(y + dy);
                
                // Skip if outside bounds
                if (dstX < 0 || dstX >= this.offscreenCanvas.width || 
                    dstY < 0 || dstY >= this.offscreenCanvas.height) {
                    continue;
                }
                
                // Calculate source and destination indices
                const srcIndex = (srcY * this.offscreenCanvas.width + srcX) * 4;
                const dstIndex = (dstY * this.offscreenCanvas.width + dstX) * 4;
                
                // Copy pixel data
                data[dstIndex] = data[srcIndex];         // R
                data[dstIndex + 1] = data[srcIndex + 1]; // G
                data[dstIndex + 2] = data[srcIndex + 2]; // B
                data[dstIndex + 3] = data[srcIndex + 3]; // A
            }
        }
        
        // Put modified image data back
        this.offscreenCtx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Apply pixelate glitch effect
     * @param {number} intensity - Glitch intensity
     */
    applyPixelateGlitch(intensity) {
        // Create temporary canvas for pixelate effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Calculate pixel size based on intensity
        const pixelSize = Math.floor(intensity * 20) + 2;
        
        // Draw pixelated image
        this.offscreenCtx.imageSmoothingEnabled = false;
        
        for (let y = 0; y < this.offscreenCanvas.height; y += pixelSize) {
            for (let x = 0; x < this.offscreenCanvas.width; x += pixelSize) {
                // Get pixel color
                const pixelData = tempCtx.getImageData(x, y, 1, 1).data;
                
                // Draw pixel
                this.offscreenCtx.fillStyle = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
                this.offscreenCtx.fillRect(x, y, pixelSize, pixelSize);
            }
        }
        
        // Reset image smoothing
        this.offscreenCtx.imageSmoothingEnabled = true;
    }
    
    /**
     * Apply chromatic aberration effect
     */
    applyChromaticAberration() {
        // Create temporary canvas for chromatic aberration
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Calculate offset based on intensity
        const offset = this.chromaticAberrationIntensity * (1 + this.intensity * 2);
        
        // Draw red channel with offset
        this.offscreenCtx.globalCompositeOperation = 'screen';
        this.offscreenCtx.fillStyle = 'red';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.globalCompositeOperation = 'destination-in';
        this.offscreenCtx.drawImage(tempCanvas, -offset, 0);
        
        // Draw green channel with no offset
        this.offscreenCtx.globalCompositeOperation = 'screen';
        this.offscreenCtx.fillStyle = 'green';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.globalCompositeOperation = 'destination-in';
        this.offscreenCtx.drawImage(tempCanvas, 0, 0);
        
        // Draw blue channel with offset
        this.offscreenCtx.globalCompositeOperation = 'screen';
        this.offscreenCtx.fillStyle = 'blue';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offscreenCtx.globalCompositeOperation = 'destination-in';
        this.offscreenCtx.drawImage(tempCanvas, offset, 0);
        
        // Reset composite operation
        this.offscreenCtx.globalCompositeOperation = 'source-over';
    }
    
    /**
     * Apply noise effect
     */
    applyNoise() {
        // Create image data for noise
        const imageData = this.offscreenCtx.createImageData(this.offscreenCanvas.width, this.offscreenCanvas.height);
        const data = imageData.data;
        
        // Generate noise
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255 * this.noiseIntensity * (1 + this.intensity);
            
            data[i] = noise;     // R
            data[i + 1] = noise; // G
            data[i + 2] = noise; // B
            data[i + 3] = 255;   // A
        }
        
        // Apply noise with overlay blend mode
        this.offscreenCtx.globalCompositeOperation = 'overlay';
        this.offscreenCtx.putImageData(imageData, 0, 0);
        
        // Reset composite operation
        this.offscreenCtx.globalCompositeOperation = 'source-over';
    }
    
    /**
     * Apply vignette effect
     */
    applyVignette() {
        // Create radial gradient
        const centerX = this.offscreenCanvas.width / 2;
        const centerY = this.offscreenCanvas.height / 2;
        const radius = Math.min(centerX, centerY) * this.vignetteRadius;
        
        const gradient = this.offscreenCtx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, ' + this.vignetteIntensity * (1 + this.intensity) + ')');
        
        // Apply vignette
        this.offscreenCtx.globalCompositeOperation = 'multiply';
        this.offscreenCtx.fillStyle = gradient;
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Reset composite operation
        this.offscreenCtx.globalCompositeOperation = 'source-over';
    }
    
    /**
     * Apply flicker effect
     */
    applyFlicker() {
        // Calculate flicker amount
        const flickerAmount = Math.sin(this.flickerTimer * this.flickerSpeed) * 
                             this.flickerIntensity * 
                             (1 + this.intensity * 2);
        
        // Apply flicker
        if (flickerAmount > 0) {
            this.offscreenCtx.globalCompositeOperation = 'multiply';
            this.offscreenCtx.fillStyle = `rgba(255, 255, 255, ${flickerAmount})`;
            this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
            this.offscreenCtx.globalCompositeOperation = 'source-over';
        }
    }
    
    /**
     * Apply color shift effect
     */
    applyColorShift() {
        // Create temporary canvas for color shift
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.offscreenCanvas.width;
        tempCanvas.height = this.offscreenCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy offscreen canvas to temporary canvas
        tempCtx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Apply hue rotation filter
        this.offscreenCtx.filter = `hue-rotate(${this.colorShiftHue}deg)`;
        this.offscreenCtx.drawImage(tempCanvas, 0, 0);
        this.offscreenCtx.filter = 'none';
    }
    
    /**
     * Resize canvases if needed
     */
    resizeCanvases() {
        // Check if main canvas size changed
        if (this.offscreenCanvas.width !== this.gameEngine.canvas.width || 
            this.offscreenCanvas.height !== this.gameEngine.canvas.height) {
            
            // Resize offscreen canvas
            this.offscreenCanvas.width = this.gameEngine.canvas.width;
            this.offscreenCanvas.height = this.gameEngine.canvas.height;
            
            // Resize effect canvas
            this.effectCanvas.width = this.gameEngine.canvas.width;
            this.effectCanvas.height = this.gameEngine.canvas.height;
        }
    }
    
    /**
     * Handle chaos increase event
     * @param {number} chaosLevel - Current chaos level
     * @param {number} amount - Amount of increase
     */
    onChaosIncrease(chaosLevel, amount) {
        // Increase target intensity based on chaos level
        this.targetIntensity = Math.min(1, chaosLevel / 100);
        
        // Trigger screen shake
        this.screenShakeIntensity = Math.min(10, amount * 0.1);
        
        // Trigger color shift
        this.colorShiftIntensity = Math.min(3, amount * 0.03);
    }
    
    /**
     * Handle chaos tier change event
     * @param {object} newTier - New chaos tier
     * @param {object} oldTier - Old chaos tier
     */
    onChaosTierChange(newTier, oldTier) {
        // Trigger strong glitch effect
        this.triggerStrongGlitch();
        
        // Trigger screen shake
        this.screenShakeIntensity = 8;
        
        // Trigger color shift
        this.colorShiftIntensity = 2;
    }
    
    /**
     * Handle boss phase transition event
     * @param {Boss} boss - Boss that transitioned
     * @param {number} phase - New phase
     */
    onBossPhaseTransition(boss, phase) {
        // Trigger strong glitch effect
        this.triggerStrongGlitch();
        
        // Trigger screen shake
        this.screenShakeIntensity = 10;
        
        // Trigger color shift
        this.colorShiftIntensity = 3;
    }
    
    /**
     * Handle boss enrage event
     * @param {Boss} boss - Boss that enraged
     */
    onBossEnrage(boss) {
        // Trigger strong glitch effect
        this.triggerStrongGlitch();
        
        // Trigger screen shake
        this.screenShakeIntensity = 8;
        
        // Trigger color shift
        this.colorShiftIntensity = 2.5;
    }
    
    /**
     * Handle mini-boss phase transition event
     * @param {MiniBoss} miniBoss - Mini-boss that transitioned
     * @param {number} phase - New phase
     */
    onMiniBossPhaseTransition(miniBoss, phase) {
        // Trigger medium glitch effect
        this.triggerMediumGlitch();
        
        // Trigger screen shake
        this.screenShakeIntensity = 5;
        
        // Trigger color shift
        this.colorShiftIntensity = 1.5;
    }
    
    /**
     * Handle player death event
     * @param {Player} player - Player that died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Trigger medium glitch effect
        this.triggerMediumGlitch();
        
        // Trigger screen shake
        this.screenShakeIntensity = 6;
        
        // Trigger color shift
        this.colorShiftIntensity = 2;
    }
    
    /**
     * Handle wave complete event
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Decrease target intensity
        this.targetIntensity = Math.max(0, this.targetIntensity - 0.2);
    }
    
    /**
     * Trigger strong glitch effect
     */
    triggerStrongGlitch() {
        // Create multiple strong glitch effects
        for (let i = 0; i < 5; i++) {
            const glitch = {
                type: this.getRandomGlitchType(),
                timer: 0.5 + Math.random() * 0.5,
                intensity: 0.8 + Math.random() * 0.2
            };
            
            // Add to active glitches
            this.activeGlitches.push(glitch);
        }
    }
    
    /**
     * Trigger medium glitch effect
     */
    triggerMediumGlitch() {
        // Create multiple medium glitch effects
        for (let i = 0; i < 3; i++) {
            const glitch = {
                type: this.getRandomGlitchType(),
                timer: 0.3 + Math.random() * 0.3,
                intensity: 0.5 + Math.random() * 0.3
            };
            
            // Add to active glitches
            this.activeGlitches.push(glitch);
        }
    }
    
    /**
     * Shake screen
     * @param {number} intensity - Screen shake intensity
     * @param {number} duration - Screen shake duration
     */
    shakeScreen(intensity, duration) {
        // Set screen shake intensity
        this.screenShakeIntensity = Math.max(this.screenShakeIntensity, intensity);
    }
    
    /**
     * Get current intensity
     * @returns {number} Current intensity
     */
    getIntensity() {
        return this.intensity;
    }
    
    /**
     * Set target intensity
     * @param {number} intensity - Target intensity
     */
    setTargetIntensity(intensity) {
        this.targetIntensity = Math.max(0, Math.min(1, intensity));
    }
    
    /**
     * Enable/disable effects
     * @param {boolean} enabled - Whether effects are enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Destroy the glitch effect system
     */
    destroy() {
        // No specific cleanup needed
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlitchEffect;
}