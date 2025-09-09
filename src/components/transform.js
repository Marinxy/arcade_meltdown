/**
 * Arcade Meltdown - Transform Component
 * Represents position, rotation, and scale of an entity
 */

class Transform {
    /**
     * Create a new Transform component
     * @param {number} x - X position (default: 0)
     * @param {number} y - Y position (default: 0)
     * @param {number} rotation - Rotation in radians (default: 0)
     */
    constructor(x = 0, y = 0, rotation = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.scale = { x: 1, y: 1 };
        this.parent = null;
        this.children = [];
    }
    
    /**
     * Translate the transform by a given amount
     * @param {number} dx - X translation
     * @param {number} dy - Y translation
     */
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    
    /**
     * Rotate the transform by a given angle
     * @param {number} angle - Rotation angle in radians
     */
    rotate(angle) {
        this.rotation += angle;
    }
    
    /**
     * Set the rotation of the transform
     * @param {number} angle - Rotation angle in radians
     */
    setRotation(angle) {
        this.rotation = angle;
    }
    
    /**
     * Set the scale of the transform
     * @param {number} sx - X scale
     * @param {number} sy - Y scale
     */
    setScale(sx, sy) {
        this.scale.x = sx;
        this.scale.y = sy;
    }
    
    /**
     * Get the world position (taking parent transforms into account)
     * @returns {object} World position {x, y}
     */
    getWorldPosition() {
        if (!this.parent) {
            return { x: this.x, y: this.y };
        }
        
        const parentPos = this.parent.getWorldPosition();
        
        // Apply parent rotation
        const cos = Math.cos(this.parent.rotation);
        const sin = Math.sin(this.parent.rotation);
        const rotatedX = this.x * cos - this.y * sin;
        const rotatedY = this.x * sin + this.y * cos;
        
        // Apply parent scale and position
        return {
            x: parentPos.x + rotatedX * this.parent.scale.x,
            y: parentPos.y + rotatedY * this.parent.scale.y
        };
    }
    
    /**
     * Get the world rotation (taking parent transforms into account)
     * @returns {number} World rotation in radians
     */
    getWorldRotation() {
        if (!this.parent) {
            return this.rotation;
        }
        
        return this.parent.getWorldRotation() + this.rotation;
    }
    
    /**
     * Get the world scale (taking parent transforms into account)
     * @returns {object} World scale {x, y}
     */
    getWorldScale() {
        if (!this.parent) {
            return { x: this.scale.x, y: this.scale.y };
        }
        
        const parentScale = this.parent.getWorldScale();
        return {
            x: parentScale.x * this.scale.x,
            y: parentScale.y * this.scale.y
        };
    }
    
    /**
     * Set the parent of this transform
     * @param {Transform} parent - Parent transform
     */
    setParent(parent) {
        // Remove from current parent
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
            }
        }
        
        // Set new parent
        this.parent = parent;
        
        // Add to new parent's children
        if (parent) {
            parent.children.push(this);
        }
    }
    
    /**
     * Add a child transform
     * @param {Transform} child - Child transform
     */
    addChild(child) {
        if (child.parent === this) return; // Already a child
        
        child.setParent(this);
    }
    
    /**
     * Remove a child transform
     * @param {Transform} child - Child transform
     */
    removeChild(child) {
        if (child.parent !== this) return; // Not our child
        
        child.setParent(null);
    }
    
    /**
     * Look at a position
     * @param {number} x - Target X position
     * @param {number} y - Target Y position
     */
    lookAt(x, y) {
        this.rotation = Math.atan2(y - this.y, x - this.x);
    }
    
    /**
     * Move in the direction of the current rotation
     * @param {number} distance - Distance to move
     */
    moveForward(distance) {
        this.x += Math.cos(this.rotation) * distance;
        this.y += Math.sin(this.rotation) * distance;
    }
    
    /**
     * Move perpendicular to the current rotation
     * @param {number} distance - Distance to move
     */
    moveRight(distance) {
        this.x += Math.cos(this.rotation + Math.PI / 2) * distance;
        this.y += Math.sin(this.rotation + Math.PI / 2) * distance;
    }
    
    /**
     * Clone this transform
     * @returns {Transform} A new transform with the same values
     */
    clone() {
        const transform = new Transform(this.x, this.y, this.rotation);
        transform.setScale(this.scale.x, this.scale.y);
        return transform;
    }
    
    /**
     * Copy values from another transform
     * @param {Transform} other - Transform to copy from
     */
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.rotation = other.rotation;
        this.setScale(other.scale.x, other.scale.y);
    }
    
    /**
     * Convert to string representation
     * @returns {string} String representation
     */
    toString() {
        return `Transform(x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}, rotation: ${(this.rotation * 180 / Math.PI).toFixed(2)}°, scale: ${this.scale.x.toFixed(2)}, ${this.scale.y.toFixed(2)})`;
    }
}

// Export for use in modules
export default Transform;