/**
 * Arcade Meltdown - Object Pool
 * Provides efficient object pooling to reduce garbage collection and improve performance
 */

class ObjectPool {
    /**
     * Create a new object pool
     * @param {Function} objectClass - Class constructor for objects in the pool
     * @param {number} initialSize - Initial number of objects to create (default: 100)
     */
    constructor(objectClass, initialSize = 100) {
        this.objectClass = objectClass;
        this.available = [];
        this.inUse = new Set();
        
        // Pre-allocate objects
        for (let i = 0; i < initialSize; i++) {
            this.available.push(new objectClass());
        }
    }
    
    /**
     * Acquire an object from the pool
     * @returns {object} An object from the pool
     */
    acquire() {
        let obj;
        
        if (this.available.length > 0) {
            obj = this.available.pop();
        } else {
            // Create a new object if none are available
            obj = new this.objectClass();
        }
        
        this.inUse.add(obj);
        return obj;
    }
    
    /**
     * Release an object back to the pool
     * @param {object} obj - Object to release
     */
    release(obj) {
        if (this.inUse.has(obj)) {
            this.inUse.delete(obj);
            
            // Reset object state if it has a reset method
            if (typeof obj.reset === 'function') {
                obj.reset();
            }
            
            this.available.push(obj);
        }
    }
    
    /**
     * Clear the pool and release all objects
     */
    clear() {
        this.available.length = 0;
        this.inUse.clear();
    }
    
    /**
     * Get the number of available objects
     * @returns {number} Number of available objects
     */
    getAvailableCount() {
        return this.available.length;
    }
    
    /**
     * Get the number of objects in use
     * @returns {number} Number of objects in use
     */
    getInUseCount() {
        return this.inUse.size;
    }
    
    /**
     * Get the total number of objects managed by the pool
     * @returns {number} Total number of objects
     */
    getTotalCount() {
        return this.available.length + this.inUse.size;
    }
    
    /**
     * Expand the pool by creating more objects
     * @param {number} count - Number of additional objects to create
     */
    expand(count) {
        for (let i = 0; i < count; i++) {
            this.available.push(new this.objectClass());
        }
    }
    
    /**
     * Shrink the pool by removing unused objects
     * @param {number} count - Maximum number of objects to remove
     */
    shrink(count) {
        const removeCount = Math.min(count, this.available.length);
        this.available.splice(0, removeCount);
    }
}

/**
 * Pool Manager - Manages multiple object pools
 */
class PoolManager {
    constructor() {
        this.pools = new Map();
        this.gcThreshold = 1000; // Objects before GC suggestion
        this.objectCount = 0;
    }
    
    /**
     * Get or create a pool for a specific class
     * @param {string} className - Name identifier for the class
     * @param {Function} objectClass - Class constructor
     * @param {number} initialSize - Initial size of the pool
     * @returns {ObjectPool} The object pool
     */
    getPool(className, objectClass, initialSize = 100) {
        if (!this.pools.has(className)) {
            this.pools.set(className, new ObjectPool(objectClass, initialSize));
        }
        return this.pools.get(className);
    }
    
    /**
     * Create an object from a pool
     * @param {string} className - Name identifier for the class
     * @param {Function} objectClass - Class constructor (required if pool doesn't exist)
     * @param {Array} args - Arguments to pass to the object's init method
     * @returns {object} The created object
     */
    createObject(className, objectClass, ...args) {
        const pool = this.getPool(className, objectClass);
        const obj = pool.acquire();
        
        // Initialize object if it has an init method
        if (typeof obj.init === 'function') {
            obj.init(...args);
        }
        
        this.objectCount++;
        
        // Suggest garbage collection if threshold is reached
        if (this.objectCount > this.gcThreshold) {
            this.suggestGarbageCollection();
        }
        
        return obj;
    }
    
    /**
     * Destroy an object and return it to the pool
     * @param {string} className - Name identifier for the class
     * @param {object} obj - Object to destroy
     */
    destroyObject(className, obj) {
        const pool = this.pools.get(className);
        if (pool) {
            pool.release(obj);
            this.objectCount--;
        }
    }
    
    /**
     * Suggest garbage collection for pools
     */
    suggestGarbageCollection() {
        // Clean up unused pools
        for (const [className, pool] of this.pools) {
            if (pool.getInUseCount() === 0 && pool.getAvailableCount() > 50) {
                pool.shrink(25); // Remove 25 unused objects
            }
        }
        
        this.objectCount = 0;
    }
    
    /**
     * Get statistics about all pools
     * @returns {object} Statistics object
     */
    getStats() {
        const stats = {
            totalObjects: 0,
            totalInUse: 0,
            totalAvailable: 0,
            pools: {}
        };
        
        for (const [className, pool] of this.pools) {
            const available = pool.getAvailableCount();
            const inUse = pool.getInUseCount();
            const total = pool.getTotalCount();
            
            stats.totalObjects += total;
            stats.totalInUse += inUse;
            stats.totalAvailable += available;
            
            stats.pools[className] = {
                available,
                inUse,
                total
            };
        }
        
        return stats;
    }
    
    /**
     * Clear all pools
     */
    clearAll() {
        for (const pool of this.pools.values()) {
            pool.clear();
        }
        this.objectCount = 0;
    }
}

// Create a global instance of the pool manager
window.poolManager = new PoolManager();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ObjectPool, PoolManager };
}