/**
 * Arcade Meltdown - Math Utilities
 * Collection of mathematical functions and utilities for game development
 */

const MathUtils = {
    /**
     * Calculate the distance between two points
     * @param {number} x1 - First point X coordinate
     * @param {number} y1 - First point Y coordinate
     * @param {number} x2 - Second point X coordinate
     * @param {number} y2 - Second point Y coordinate
     * @returns {number} Distance between the points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    /**
     * Calculate the angle between two points in radians
     * @param {number} x1 - First point X coordinate
     * @param {number} y1 - First point Y coordinate
     * @param {number} x2 - Second point X coordinate
     * @param {number} y2 - Second point Y coordinate
     * @returns {number} Angle in radians
     */
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    /**
     * Calculate the difference between two angles
     * @param {number} angle1 - First angle in radians
     * @param {number} angle2 - Second angle in radians
     * @returns {number} Angle difference in radians
     */
    angleDifference(angle1, angle2) {
        let diff = angle2 - angle1;
        
        // Normalize to [-PI, PI]
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        
        return diff;
    },
    
    /**
     * Normalize a vector
     * @param {number} x - Vector X component
     * @param {number} y - Vector Y component
     * @returns {object} Normalized vector {x, y}
     */
    normalize(x, y) {
        const length = Math.sqrt(x * x + y * y);
        if (length === 0) return { x: 0, y: 0 };
        return { x: x / length, y: y / length };
    },
    
    /**
     * Calculate dot product of two vectors
     * @param {number} x1 - First vector X component
     * @param {number} y1 - First vector Y component
     * @param {number} x2 - Second vector X component
     * @param {number} y2 - Second vector Y component
     * @returns {number} Dot product
     */
    dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    },
    
    /**
     * Calculate cross product of two 2D vectors
     * @param {number} x1 - First vector X component
     * @param {number} y1 - First vector Y component
     * @param {number} x2 - Second vector X component
     * @param {number} y2 - Second vector Y component
     * @returns {number} Cross product (Z component of 3D cross product)
     */
    cross(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    },
    
    /**
     * Linear interpolation between two values
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    },
    
    /**
     * Smoothstep interpolation
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Smoothly interpolated value
     */
    smoothstep(a, b, t) {
        t = Math.max(0, Math.min(1, t));
        t = t * t * (3 - 2 * t);
        return a + (b - a) * t;
    },
    
    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    /**
     * Generate a random number between min and max
     * @param {number} min - Minimum value (default: 0)
     * @param {number} max - Maximum value (default: 1)
     * @returns {number} Random number
     */
    random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Choose a random element from an array
     * @param {Array} array - Array to choose from
     * @returns {*} Random element
     */
    randomChoice(array) {
        if (!array || array.length === 0) return undefined;
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Check if a point is inside a circle
     * @param {number} px - Point X coordinate
     * @param {number} py - Point Y coordinate
     * @param {number} cx - Circle center X coordinate
     * @param {number} cy - Circle center Y coordinate
     * @param {number} radius - Circle radius
     * @returns {boolean} True if point is inside circle
     */
    pointInCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy <= radius * radius;
    },
    
    /**
     * Check if a point is inside a rectangle
     * @param {number} px - Point X coordinate
     * @param {number} py - Point Y coordinate
     * @param {number} rx - Rectangle X coordinate
     * @param {number} ry - Rectangle Y coordinate
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @returns {boolean} True if point is inside rectangle
     */
    pointInRect(px, py, rx, ry, width, height) {
        return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
    },
    
    /**
     * Check if two circles intersect
     * @param {number} x1 - First circle center X coordinate
     * @param {number} y1 - First circle center Y coordinate
     * @param {number} r1 - First circle radius
     * @param {number} x2 - Second circle center X coordinate
     * @param {number} y2 - Second circle center Y coordinate
     * @param {number} r2 - Second circle radius
     * @returns {boolean} True if circles intersect
     */
    circleIntersect(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    },
    
    /**
     * Rotate a point around an origin
     * @param {number} px - Point X coordinate
     * @param {number} py - Point Y coordinate
     * @param {number} ox - Origin X coordinate
     * @param {number} oy - Origin Y coordinate
     * @param {number} angle - Rotation angle in radians
     * @returns {object} Rotated point {x, y}
     */
    rotatePoint(px, py, ox, oy, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = px - ox;
        const dy = py - oy;
        
        return {
            x: ox + dx * cos - dy * sin,
            y: oy + dx * sin + dy * cos
        };
    },
    
    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} Angle in radians
     */
    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    },
    
    /**
     * Convert radians to degrees
     * @param {number} radians - Angle in radians
     * @returns {number} Angle in degrees
     */
    radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    },
    
    /**
     * Calculate the next power of two
     * @param {number} value - Input value
     * @returns {number} Next power of two
     */
    nextPowerOfTwo(value) {
        return Math.pow(2, Math.ceil(Math.log2(value)));
    },
    
    /**
     * Perform a binary search on a sorted array
     * @param {Array} array - Sorted array to search
     * @param {*} value - Value to find
     * @param {function} compare - Comparison function (a, b) => number
     * @returns {number} Index of found element or -1 if not found
     */
    binarySearch(array, value, compare = (a, b) => a - b) {
        let left = 0;
        let right = array.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const cmp = compare(array[mid], value);
            
            if (cmp === 0) return mid;
            if (cmp < 0) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1;
    }
};

// Export for use in modules
export default MathUtils;