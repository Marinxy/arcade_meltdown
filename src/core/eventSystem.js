/**
 * Arcade Meltdown - Event System
 * Manages game events and event listeners
 */

class EventSystem {
    /**
     * Create a new event system
     */
    constructor() {
        // Event listeners
        this.listeners = {};
        
        // Event queue
        this.eventQueue = [];
        
        // Processing flag
        this.processing = false;
    }
    
    /**
     * Initialize the event system
     */
    init() {
        // Nothing to initialize here
    }
    
    /**
     * Add an event listener
     * @param {string} event - Event name
     * @param {function} callback - Event callback
     * @param {object} context - Callback context
     */
    on(event, callback, context = null) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        
        this.listeners[event].push({
            callback,
            context
        });
    }
    
    /**
     * Remove an event listener
     * @param {string} event - Event name
     * @param {function} callback - Event callback
     * @param {object} context - Callback context
     */
    off(event, callback, context = null) {
        if (!this.listeners[event]) {
            return;
        }
        
        this.listeners[event] = this.listeners[event].filter(listener => {
            return listener.callback !== callback || listener.context !== context;
        });
        
        // Remove empty listener arrays
        if (this.listeners[event].length === 0) {
            delete this.listeners[event];
        }
    }
    
    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data = null) {
        // Add event to queue
        this.eventQueue.push({
            event,
            data,
            timestamp: Date.now()
        });
        
        // Process events if not already processing
        if (!this.processing) {
            this.processEvents();
        }
    }
    
    /**
     * Process events in the queue
     */
    processEvents() {
        this.processing = true;
        
        // Process all events in the queue
        while (this.eventQueue.length > 0) {
            const eventObj = this.eventQueue.shift();
            this.dispatchEvent(eventObj.event, eventObj.data);
        }
        
        this.processing = false;
    }
    
    /**
     * Dispatch an event to all listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    dispatchEvent(event, data) {
        if (!this.listeners[event]) {
            return;
        }
        
        // Create a copy of the listeners array to avoid issues with listeners being removed during dispatch
        const listeners = [...this.listeners[event]];
        
        // Call each listener
        for (const listener of listeners) {
            try {
                if (listener.context) {
                    listener.callback.call(listener.context, data);
                } else {
                    listener.callback(data);
                }
            } catch (error) {
                console.error(`Error in event listener for '${event}':`, error);
            }
        }
    }
    
    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    removeAllListeners(event) {
        if (event) {
            delete this.listeners[event];
        } else {
            this.listeners = {};
        }
    }
    
    /**
     * Get all listeners for an event
     * @param {string} event - Event name
     * @returns {Array} Array of listeners
     */
    getListeners(event) {
        return this.listeners[event] || [];
    }
    
    /**
     * Check if there are any listeners for an event
     * @param {string} event - Event name
     * @returns {boolean} True if there are listeners for the event
     */
    hasListeners(event) {
        return !!(this.listeners[event] && this.listeners[event].length > 0);
    }
    
    /**
     * Get the number of listeners for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    listenerCount(event) {
        return this.listeners[event] ? this.listeners[event].length : 0;
    }
    
    /**
     * Get the names of all events with listeners
     * @returns {Array} Array of event names
     */
    eventNames() {
        return Object.keys(this.listeners);
    }
    
    /**
     * Update the event system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Process any remaining events
        if (this.eventQueue.length > 0 && !this.processing) {
            this.processEvents();
        }
    }
    
    /**
     * Destroy the event system
     */
    destroy() {
        // Remove all listeners
        this.listeners = {};
        
        // Clear event queue
        this.eventQueue = [];
    }
}

// Export for use in modules
export default EventSystem;