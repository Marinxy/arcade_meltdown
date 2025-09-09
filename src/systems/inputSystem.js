/**
 * Arcade Meltdown - Input System
 * Handles keyboard and mouse input for player control
 */

class InputSystem {
    /**
     * Create a new Input System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Input state
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            buttons: {
                left: false,
                middle: false,
                right: false
            }
        };
        
        // Key bindings
        this.keyBindings = {
            // Movement
            moveUp: ['KeyW', 'ArrowUp'],
            moveDown: ['KeyS', 'ArrowDown'],
            moveLeft: ['KeyA', 'ArrowLeft'],
            moveRight: ['KeyD', 'ArrowRight'],
            
            // Actions
            special: ['Space'],
            reload: ['KeyR'],
            interact: ['KeyE'],
            
            // System
            pause: ['Escape'],
            menu: ['Tab']
        };
        
        // Input callbacks
        this.callbacks = {
            onKeyDown: null,
            onKeyUp: null,
            onMouseDown: null,
            onMouseUp: null,
            onMouseMove: null,
            onMouseWheel: null
        };
        
        // Canvas element
        this.canvas = gameEngine.canvas;
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the input system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Load key bindings from config
        this.loadKeyBindings();
        
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            this.onConfigChange(event);
        });
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Handle window focus/blur
        window.addEventListener('blur', this.handleWindowBlur.bind(this));
        window.addEventListener('focus', this.handleWindowFocus.bind(this));
    }
    
    /**
     * Load key bindings from config
     */
    loadKeyBindings() {
        const configBindings = window.config.get('controls.keyBindings');
        
        if (configBindings) {
            // Update key bindings from config
            for (const [action, key] of Object.entries(configBindings)) {
                if (this.keyBindings[action]) {
                    // Replace the first key in the array with the config key
                    this.keyBindings[action][0] = key;
                }
            }
        }
    }
    
    /**
     * Handle key down event
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        // Store key state
        this.keys[e.code] = true;
        
        // Handle special keys
        this.handleSpecialKeys(e.code, true);
        
        // Prevent default behavior for game keys
        if (this.isGameKey(e.code)) {
            e.preventDefault();
        }
        
        // Trigger callback
        if (this.callbacks.onKeyDown) {
            this.callbacks.onKeyDown(e.code, e);
        }
    }
    
    /**
     * Handle key up event
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyUp(e) {
        // Store key state
        this.keys[e.code] = false;
        
        // Handle special keys
        this.handleSpecialKeys(e.code, false);
        
        // Prevent default behavior for game keys
        if (this.isGameKey(e.code)) {
            e.preventDefault();
        }
        
        // Trigger callback
        if (this.callbacks.onKeyUp) {
            this.callbacks.onKeyUp(e.code, e);
        }
    }
    
    /**
     * Handle mouse down event
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseDown(e) {
        // Update mouse button state
        switch (e.button) {
            case 0: // Left button
                this.mouse.buttons.left = true;
                break;
            case 1: // Middle button
                this.mouse.buttons.middle = true;
                break;
            case 2: // Right button
                this.mouse.buttons.right = true;
                break;
        }
        
        // Update mouse position
        this.updateMousePosition(e);
        
        // Prevent default behavior
        e.preventDefault();
        
        // Trigger callback
        if (this.callbacks.onMouseDown) {
            this.callbacks.onMouseDown(e.button, e);
        }
    }
    
    /**
     * Handle mouse up event
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseUp(e) {
        // Update mouse button state
        switch (e.button) {
            case 0: // Left button
                this.mouse.buttons.left = false;
                break;
            case 1: // Middle button
                this.mouse.buttons.middle = false;
                break;
            case 2: // Right button
                this.mouse.buttons.right = false;
                break;
        }
        
        // Update mouse position
        this.updateMousePosition(e);
        
        // Prevent default behavior
        e.preventDefault();
        
        // Trigger callback
        if (this.callbacks.onMouseUp) {
            this.callbacks.onMouseUp(e.button, e);
        }
    }
    
    /**
     * Handle mouse move event
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        // Update mouse position
        this.updateMousePosition(e);
        
        // Trigger callback
        if (this.callbacks.onMouseMove) {
            this.callbacks.onMouseMove(e);
        }
    }
    
    /**
     * Handle mouse wheel event
     * @param {WheelEvent} e - Wheel event
     */
    handleMouseWheel(e) {
        // Prevent default behavior
        e.preventDefault();
        
        // Trigger callback
        if (this.callbacks.onMouseWheel) {
            this.callbacks.onMouseWheel(e.deltaY, e);
        }
    }
    
    /**
     * Handle window blur event
     */
    handleWindowBlur() {
        // Clear all input states when window loses focus
        this.keys = {};
        this.mouse.buttons.left = false;
        this.mouse.buttons.middle = false;
        this.mouse.buttons.right = false;
    }
    
    /**
     * Handle window focus event
     */
    handleWindowFocus() {
        // Input states will be updated as keys are pressed again
    }
    
    /**
     * Update mouse position
     * @param {MouseEvent} e - Mouse event
     */
    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    /**
     * Handle special keys (pause, menu, etc.)
     * @param {string} code - Key code
     * @param {boolean} pressed - Whether the key is pressed
     */
    handleSpecialKeys(code, pressed) {
        // Pause game
        if (this.isKeyBound('pause', code) && pressed) {
            this.togglePause();
        }
        
        // Toggle menu
        if (this.isKeyBound('menu', code) && pressed) {
            this.toggleMenu();
        }
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        if (this.gameEngine.gameState === 'playing') {
            this.gameEngine.gameState = 'paused';
            this.gameEngine.gameLoop.setPaused(true);
            window.eventSystem.emit('game:paused', this.gameEngine);
        } else if (this.gameEngine.gameState === 'paused') {
            this.gameEngine.gameState = 'playing';
            this.gameEngine.gameLoop.setPaused(false);
            window.eventSystem.emit('game:resumed', this.gameEngine);
        }
    }
    
    /**
     * Toggle menu
     */
    toggleMenu() {
        if (this.gameEngine.gameState === 'playing' || this.gameEngine.gameState === 'paused') {
            // This would open an in-game menu
            window.eventSystem.emit('game:menuToggle', this.gameEngine);
        }
    }
    
    /**
     * Check if a key is used for game controls
     * @param {string} code - Key code
     * @returns {boolean} True if the key is a game key
     */
    isGameKey(code) {
        for (const [action, keys] of Object.entries(this.keyBindings)) {
            if (keys.includes(code)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if a key is bound to an action
     * @param {string} action - Action to check
     * @param {string} code - Key code
     * @returns {boolean} True if the key is bound to the action
     */
    isKeyBound(action, code) {
        const keys = this.keyBindings[action];
        return keys && keys.includes(code);
    }
    
    /**
     * Check if a key is currently pressed
     * @param {string} code - Key code
     * @returns {boolean} True if the key is pressed
     */
    isKeyPressed(code) {
        return !!this.keys[code];
    }
    
    /**
     * Check if an action is currently active
     * @param {string} action - Action to check
     * @returns {boolean} True if the action is active
     */
    isActionActive(action) {
        const keys = this.keyBindings[action];
        if (!keys) return false;
        
        for (const key of keys) {
            if (this.isKeyPressed(key)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get the current mouse position
     * @returns {object} Mouse position {x, y}
     */
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    /**
     * Check if a mouse button is currently pressed
     * @param {string} button - Button to check ('left', 'middle', 'right')
     * @returns {boolean} True if the button is pressed
     */
    isMouseButtonPressed(button) {
        return !!this.mouse.buttons[button];
    }
    
    /**
     * Set a callback for an input event
     * @param {string} event - Event type ('onKeyDown', 'onKeyUp', etc.)
     * @param {Function} callback - Callback function
     */
    setCallback(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }
    
    /**
     * Update the input system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update player input based on current input state
        if (this.gameEngine.gameState === 'playing' && this.gameEngine.player) {
            this.updatePlayerInput(deltaTime);
        }
    }
    
    /**
     * Update player input
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updatePlayerInput(deltaTime) {
        const player = this.gameEngine.player;
        if (!player) return;
        
        // Update movement input
        player.input.up = this.isActionActive('moveUp');
        player.input.down = this.isActionActive('moveDown');
        player.input.left = this.isActionActive('moveLeft');
        player.input.right = this.isActionActive('moveRight');
        
        // Update mouse input
        player.input.mouseX = this.mouse.x;
        player.input.mouseY = this.mouse.y;
        player.input.mousePressed = this.isMouseButtonPressed('left');
        
        // Update action input
        player.input.special = this.isActionActive('special');
        player.input.reload = this.isActionActive('reload');
        player.input.interact = this.isActionActive('interact');
    }
    
    /**
     * Handle config changes
     * @param {object} event - Config change event
     */
    onConfigChange(event) {
        const { path, value } = event;
        
        // Update key bindings if they changed
        if (path.startsWith('controls.keyBindings')) {
            this.loadKeyBindings();
        }
    }
    
    /**
     * Destroy the input system
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('wheel', this.handleMouseWheel);
        this.canvas.removeEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        window.removeEventListener('blur', this.handleWindowBlur);
        window.removeEventListener('focus', this.handleWindowFocus);
        
        // Clear input state
        this.keys = {};
        this.mouse.buttons.left = false;
        this.mouse.buttons.middle = false;
        this.mouse.buttons.right = false;
        
        // Clear callbacks
        for (const callback in this.callbacks) {
            this.callbacks[callback] = null;
        }
    }
}

// Export for use in modules
export default InputSystem;