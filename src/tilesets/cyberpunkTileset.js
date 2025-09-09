/**
 * Arcade Meltdown - Cyberpunk Arena Tileset
 * Neon-lit futuristic cityscape with holographic ads and tech elements
 */

class CyberpunkTileset {
    /**
     * Create a new Cyberpunk tileset
     */
    constructor() {
        // Tileset properties
        this.name = "Cyberpunk";
        this.description = "Neon-lit futuristic cityscape with holographic ads and tech elements";
        this.tileSize = 32;
        this.tileCount = 64;
        
        // Tile types
        this.tiles = {
            // Floor tiles
            floor_1: {
                id: 0,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                decoration: "grid",
                decorationColor: "#16213e"
            },
            floor_2: {
                id: 1,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#0f0f1e",
                decoration: "circuit",
                decorationColor: "#00ffff"
            },
            floor_3: {
                id: 2,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#16213e",
                decoration: "hologram",
                decorationColor: "#ff00ff"
            },
            floor_4: {
                id: 3,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                decoration: "neon",
                decorationColor: "#00ff00"
            },
            
            // Wall tiles
            wall_1: {
                id: 4,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                decoration: "panel",
                decorationColor: "#e94560"
            },
            wall_2: {
                id: 5,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#16213e",
                decoration: "screen",
                decorationColor: "#00ffff"
            },
            wall_3: {
                id: 6,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                decoration: "vent",
                decorationColor: "#533483"
            },
            wall_4: {
                id: 7,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#16213e",
                decoration: "ad",
                decorationColor: "#ff00ff"
            },
            
            // Corner tiles
            corner_tl: {
                id: 8,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                shape: "corner_tl"
            },
            corner_tr: {
                id: 9,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                shape: "corner_tr"
            },
            corner_bl: {
                id: 10,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                shape: "corner_bl"
            },
            corner_br: {
                id: 11,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                shape: "corner_br"
            },
            
            // Obstacle tiles
            obstacle_1: {
                id: 12,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#533483",
                shape: "crate",
                health: 100,
                destructible: true
            },
            obstacle_2: {
                id: 13,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#e94560",
                shape: "barrel",
                health: 50,
                destructible: true,
                explosive: true
            },
            obstacle_3: {
                id: 14,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#0f3460",
                shape: "terminal",
                health: 150,
                destructible: true
            },
            obstacle_4: {
                id: 15,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#16213e",
                shape: "server",
                health: 200,
                destructible: true
            },
            
            // Cover tiles
            cover_1: {
                id: 16,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#533483",
                shape: "low_wall",
                height: 0.5,
                cover: true
            },
            cover_2: {
                id: 17,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#0f3460",
                shape: "barrier",
                height: 0.7,
                cover: true
            },
            cover_3: {
                id: 18,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#e94560",
                shape: "energy_shield",
                height: 0.6,
                cover: true,
                animated: true
            },
            cover_4: {
                id: 19,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#16213e",
                shape: "hologram_wall",
                height: 0.8,
                cover: true,
                animated: true
            },
            
            // Hazard tiles
            hazard_1: {
                id: 20,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                shape: "electric_floor",
                damage: 10,
                damageInterval: 1,
                animated: true
            },
            hazard_2: {
                id: 21,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#16213e",
                shape: "toxic_pool",
                damage: 5,
                damageInterval: 0.5,
                slow: 0.5,
                animated: true
            },
            hazard_3: {
                id: 22,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#0f3460",
                shape: "laser_grid",
                damage: 15,
                damageInterval: 0.2,
                animated: true
            },
            hazard_4: {
                id: 23,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#533483",
                shape: "plasma_leak",
                damage: 8,
                damageInterval: 0.3,
                animated: true
            },
            
            // Spawn tiles
            spawn_player: {
                id: 24,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#00ffff",
                shape: "spawn_point",
                spawnType: "player"
            },
            spawn_enemy: {
                id: 25,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#e94560",
                shape: "spawn_point",
                spawnType: "enemy"
            },
            spawn_boss: {
                id: 26,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#ff00ff",
                shape: "spawn_point",
                spawnType: "boss"
            },
            spawn_powerup: {
                id: 27,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#00ff00",
                shape: "spawn_point",
                spawnType: "powerup"
            },
            
            // Objective tiles
            objective_1: {
                id: 28,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#00ff00",
                shape: "data_terminal",
                interactive: true,
                captureTime: 5
            },
            objective_2: {
                id: 29,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#00ffff",
                shape: "control_panel",
                interactive: true,
                captureTime: 3
            },
            objective_3: {
                id: 30,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#ff00ff",
                shape: "hologram_projector",
                interactive: true,
                captureTime: 7
            },
            objective_4: {
                id: 31,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#ffff00",
                shape: "power_core",
                interactive: true,
                captureTime: 10
            },
            
            // Decoration tiles
            decoration_1: {
                id: 32,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                shape: "neon_sign",
                text: "ARCADE",
                textColor: "#00ffff",
                animated: true
            },
            decoration_2: {
                id: 33,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#16213e",
                shape: "hologram_ad",
                text: "MELTDOWN",
                textColor: "#ff00ff",
                animated: true
            },
            decoration_3: {
                id: 34,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#0f3460",
                shape: "tech_plant",
                animated: true
            },
            decoration_4: {
                id: 35,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#533483",
                shape: "floating_orb",
                animated: true
            },
            
            // Door tiles
            door_1: {
                id: 36,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                shape: "sliding_door",
                open: false,
                openable: true,
                locked: false
            },
            door_2: {
                id: 37,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#16213e",
                shape: "security_door",
                open: false,
                openable: true,
                locked: true,
                keyRequired: "keycard"
            },
            door_3: {
                id: 38,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#533483",
                shape: "blast_door",
                open: false,
                openable: true,
                locked: true,
                keyRequired: "access_code"
            },
            door_4: {
                id: 39,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#e94560",
                shape: "energy_door",
                open: false,
                openable: true,
                locked: false,
                animated: true
            },
            
            // Platform tiles
            platform_1: {
                id: 40,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#0f3460",
                shape: "floating_platform",
                moving: false
            },
            platform_2: {
                id: 41,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#16213e",
                shape: "moving_platform",
                moving: true,
                moveSpeed: 1,
                moveDistance: 100,
                moveDirection: "horizontal"
            },
            platform_3: {
                id: 42,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#533483",
                shape: "moving_platform",
                moving: true,
                moveSpeed: 1.5,
                moveDistance: 150,
                moveDirection: "vertical"
            },
            platform_4: {
                id: 43,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#e94560",
                shape: "rotating_platform",
                moving: true,
                moveSpeed: 2,
                moveDistance: 0,
                moveDirection: "circular",
                rotateSpeed: 1
            },
            
            // Liquid tiles
            liquid_1: {
                id: 44,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#00ffff",
                shape: "water",
                depth: 0.5,
                slow: 0.7,
                animated: true
            },
            liquid_2: {
                id: 45,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#533483",
                shape: "acid",
                depth: 0.5,
                slow: 0.6,
                damage: 5,
                damageInterval: 1,
                animated: true
            },
            liquid_3: {
                id: 46,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#e94560",
                shape: "lava",
                depth: 0.5,
                slow: 0.5,
                damage: 20,
                damageInterval: 0.5,
                animated: true
            },
            liquid_4: {
                id: 47,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#16213e",
                shape: "liquid_metal",
                depth: 0.5,
                slow: 0.8,
                animated: true
            },
            
            // Special tiles
            special_1: {
                id: 48,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#00ff00",
                shape: "teleporter",
                destination: null,
                oneWay: false,
                animated: true
            },
            special_2: {
                id: 49,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#ff00ff",
                shape: "accelerator",
                speed: 3,
                direction: "right",
                animated: true
            },
            special_3: {
                id: 50,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#ffff00",
                shape: "jump_pad",
                jumpHeight: 5,
                animated: true
            },
            special_4: {
                id: 51,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#00ffff",
                shape: "gravity_shifter",
                gravity: -0.5,
                duration: 5,
                animated: true
            },
            
            // Background tiles
            background_1: {
                id: 52,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#0a0a0f",
                parallax: 0.2,
                decoration: "cityscape",
                decorationColor: "#1a1a2e"
            },
            background_2: {
                id: 53,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#0f0f1e",
                parallax: 0.4,
                decoration: "buildings",
                decorationColor: "#16213e"
            },
            background_3: {
                id: 54,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                parallax: 0.6,
                decoration: "neon_signs",
                decorationColor: "#00ffff"
            },
            background_4: {
                id: 55,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#16213e",
                parallax: 0.8,
                decoration: "holograms",
                decorationColor: "#ff00ff"
            },
            
            // Transition tiles
            transition_floor_wall_1: {
                id: 56,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                shape: "floor_wall",
                direction: "top"
            },
            transition_floor_wall_2: {
                id: 57,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                shape: "floor_wall",
                direction: "right"
            },
            transition_floor_wall_3: {
                id: 58,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                shape: "floor_wall",
                direction: "bottom"
            },
            transition_floor_wall_4: {
                id: 59,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#1a1a2e",
                shape: "floor_wall",
                direction: "left"
            },
            
            // Extra tiles for variety
            extra_1: {
                id: 60,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#0f0f1e",
                decoration: "cracks",
                decorationColor: "#533483"
            },
            extra_2: {
                id: 61,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#16213e",
                decoration: "stains",
                decorationColor: "#e94560"
            },
            extra_3: {
                id: 62,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#0f3460",
                decoration: "graffiti",
                decorationColor: "#00ff00"
            },
            extra_4: {
                id: 63,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#16213e",
                decoration: "warning",
                decorationColor: "#ffff00"
            }
        };
        
        // Tile palette
        this.palette = {
            primary: "#0f3460",
            secondary: "#16213e",
            accent1: "#e94560",
            accent2: "#00ffff",
            accent3: "#ff00ff",
            accent4: "#00ff00",
            accent5: "#ffff00",
            dark: "#0a0a0f",
            light: "#533483"
        };
        
        // Lighting settings
        this.lighting = {
            ambient: 0.4,
            directional: 0.6,
            pointLights: [
                { x: 0.2, y: 0.2, color: "#00ffff", intensity: 0.8, radius: 0.3 },
                { x: 0.8, y: 0.2, color: "#ff00ff", intensity: 0.8, radius: 0.3 },
                { x: 0.5, y: 0.8, color: "#00ff00", intensity: 0.8, radius: 0.3 }
            ],
            fog: {
                color: "#0a0a0f",
                density: 0.05,
                near: 10,
                far: 50
            }
        };
        
        // Particle effects
        this.particles = {
            rain: {
                enabled: false,
                color: "#00ffff",
                density: 0.1,
                speed: 2
            },
            snow: {
                enabled: false,
                color: "#ffffff",
                density: 0.05,
                speed: 0.5
            },
            dust: {
                enabled: true,
                color: "#533483",
                density: 0.02,
                speed: 0.3
            },
            embers: {
                enabled: true,
                color: "#e94560",
                density: 0.01,
                speed: 0.4
            }
        };
        
        // Sound effects
        this.sounds = {
            ambient: "cyberpunk_ambient.mp3",
            footstep: "metal_footstep.mp3",
            wall_hit: "metal_hit.mp3",
            glass_break: "glass_shatter.mp3",
            explosion: "tech_explosion.mp3",
            door_open: "sliding_door.mp3",
            hazard: "electric_hum.mp3"
        };
        
        // Music theme
        this.music = "cyberpunk_theme.mp3";
        
        // Initialize tileset
        this.init();
    }
    
    /**
     * Initialize the tileset
     */
    init() {
        // Create tile map for quick lookup
        this.tileMap = {};
        
        for (const [key, tile] of Object.entries(this.tiles)) {
            this.tileMap[tile.id] = key;
        }
        
        // Create tile type map
        this.tileTypeMap = {
            floor: [],
            wall: [],
            corner: [],
            obstacle: [],
            cover: [],
            hazard: [],
            spawn: [],
            objective: [],
            decoration: [],
            door: [],
            platform: [],
            liquid: [],
            special: [],
            background: [],
            transition: [],
            extra: []
        };
        
        for (const [key, tile] of Object.entries(this.tiles)) {
            this.tileTypeMap[tile.type].push(key);
        }
    }
    
    /**
     * Get tile by ID
     * @param {number} id - Tile ID
     * @returns {object} Tile data
     */
    getTileById(id) {
        const key = this.tileMap[id];
        return key ? this.tiles[key] : null;
    }
    
    /**
     * Get tile by name
     * @param {string} name - Tile name
     * @returns {object} Tile data
     */
    getTileByName(name) {
        return this.tiles[name];
    }
    
    /**
     * Get all tiles of a specific type
     * @param {string} type - Tile type
     * @returns {Array} Array of tile names
     */
    getTilesByType(type) {
        return this.tileTypeMap[type] || [];
    }
    
    /**
     * Get random tile of a specific type
     * @param {string} type - Tile type
     * @returns {string} Random tile name
     */
    getRandomTileByType(type) {
        const tiles = this.getTilesByType(type);
        if (tiles.length === 0) return null;
        
        return tiles[Math.floor(Math.random() * tiles.length)];
    }
    
    /**
     * Get tile palette
     * @returns {object} Tile palette
     */
    getPalette() {
        return this.palette;
    }
    
    /**
     * Get lighting settings
     * @returns {object} Lighting settings
     */
    getLighting() {
        return this.lighting;
    }
    
    /**
     * Get particle effects
     * @returns {object} Particle effects
     */
    getParticles() {
        return this.particles;
    }
    
    /**
     * Get sound effects
     * @returns {object} Sound effects
     */
    getSounds() {
        return this.sounds;
    }
    
    /**
     * Get music theme
     * @returns {string} Music theme
     */
    getMusic() {
        return this.music;
    }
    
    /**
     * Get all tiles
     * @returns {object} All tiles
     */
    getAllTiles() {
        return this.tiles;
    }
    
    /**
     * Render tile
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {string} tileName - Tile name
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Tile size
     * @param {object} options - Rendering options
     */
    renderTile(ctx, tileName, x, y, size, options = {}) {
        // Get tile data
        const tile = this.getTileByName(tileName);
        if (!tile) return;
        
        // Save context state
        ctx.save();
        
        // Set tile position
        ctx.translate(x, y);
        
        // Draw tile background
        ctx.fillStyle = tile.color;
        ctx.fillRect(0, 0, size, size);
        
        // Draw tile decoration based on type
        switch (tile.decoration) {
            case "grid":
                this.drawGridDecoration(ctx, size, tile.decorationColor);
                break;
            case "circuit":
                this.drawCircuitDecoration(ctx, size, tile.decorationColor);
                break;
            case "hologram":
                this.drawHologramDecoration(ctx, size, tile.decorationColor);
                break;
            case "neon":
                this.drawNeonDecoration(ctx, size, tile.decorationColor);
                break;
            case "panel":
                this.drawPanelDecoration(ctx, size, tile.decorationColor);
                break;
            case "screen":
                this.drawScreenDecoration(ctx, size, tile.decorationColor);
                break;
            case "vent":
                this.drawVentDecoration(ctx, size, tile.decorationColor);
                break;
            case "ad":
                this.drawAdDecoration(ctx, size, tile.decorationColor, tile.text);
                break;
            case "cracks":
                this.drawCracksDecoration(ctx, size, tile.decorationColor);
                break;
            case "stains":
                this.drawStainsDecoration(ctx, size, tile.decorationColor);
                break;
            case "graffiti":
                this.drawGraffitiDecoration(ctx, size, tile.decorationColor);
                break;
            case "warning":
                this.drawWarningDecoration(ctx, size, tile.decorationColor);
                break;
            case "cityscape":
                this.drawCityscapeDecoration(ctx, size, tile.decorationColor);
                break;
            case "buildings":
                this.drawBuildingsDecoration(ctx, size, tile.decorationColor);
                break;
            case "neon_signs":
                this.drawNeonSignsDecoration(ctx, size, tile.decorationColor);
                break;
            case "holograms":
                this.drawHologramsDecoration(ctx, size, tile.decorationColor);
                break;
        }
        
        // Draw tile shape based on type
        switch (tile.shape) {
            case "corner_tl":
                this.drawCornerShape(ctx, size, "tl");
                break;
            case "corner_tr":
                this.drawCornerShape(ctx, size, "tr");
                break;
            case "corner_bl":
                this.drawCornerShape(ctx, size, "bl");
                break;
            case "corner_br":
                this.drawCornerShape(ctx, size, "br");
                break;
            case "crate":
                this.drawCrateShape(ctx, size);
                break;
            case "barrel":
                this.drawBarrelShape(ctx, size);
                break;
            case "terminal":
                this.drawTerminalShape(ctx, size);
                break;
            case "server":
                this.drawServerShape(ctx, size);
                break;
            case "low_wall":
                this.drawLowWallShape(ctx, size);
                break;
            case "barrier":
                this.drawBarrierShape(ctx, size);
                break;
            case "energy_shield":
                this.drawEnergyShieldShape(ctx, size);
                break;
            case "hologram_wall":
                this.drawHologramWallShape(ctx, size);
                break;
            case "electric_floor":
                this.drawElectricFloorShape(ctx, size);
                break;
            case "toxic_pool":
                this.drawToxicPoolShape(ctx, size);
                break;
            case "laser_grid":
                this.drawLaserGridShape(ctx, size);
                break;
            case "plasma_leak":
                this.drawPlasmaLeakShape(ctx, size);
                break;
            case "spawn_point":
                this.drawSpawnPointShape(ctx, size, tile.spawnType);
                break;
            case "data_terminal":
                this.drawDataTerminalShape(ctx, size);
                break;
            case "control_panel":
                this.drawControlPanelShape(ctx, size);
                break;
            case "hologram_projector":
                this.drawHologramProjectorShape(ctx, size);
                break;
            case "power_core":
                this.drawPowerCoreShape(ctx, size);
                break;
            case "tech_plant":
                this.drawTechPlantShape(ctx, size);
                break;
            case "floating_orb":
                this.drawFloatingOrbShape(ctx, size);
                break;
            case "sliding_door":
                this.drawSlidingDoorShape(ctx, size, tile.open);
                break;
            case "security_door":
                this.drawSecurityDoorShape(ctx, size, tile.open);
                break;
            case "blast_door":
                this.drawBlastDoorShape(ctx, size, tile.open);
                break;
            case "energy_door":
                this.drawEnergyDoorShape(ctx, size, tile.open);
                break;
            case "floating_platform":
                this.drawFloatingPlatformShape(ctx, size);
                break;
            case "moving_platform":
                this.drawMovingPlatformShape(ctx, size);
                break;
            case "rotating_platform":
                this.drawRotatingPlatformShape(ctx, size);
                break;
            case "water":
                this.drawWaterShape(ctx, size);
                break;
            case "acid":
                this.drawAcidShape(ctx, size);
                break;
            case "lava":
                this.drawLavaShape(ctx, size);
                break;
            case "liquid_metal":
                this.drawLiquidMetalShape(ctx, size);
                break;
            case "teleporter":
                this.drawTeleporterShape(ctx, size);
                break;
            case "accelerator":
                this.drawAcceleratorShape(ctx, size, tile.direction);
                break;
            case "jump_pad":
                this.drawJumpPadShape(ctx, size);
                break;
            case "gravity_shifter":
                this.drawGravityShifterShape(ctx, size);
                break;
            case "floor_wall":
                this.drawFloorWallShape(ctx, size, tile.direction);
                break;
        }
        
        // Draw tile text if available
        if (tile.text) {
            this.drawText(ctx, size, tile.text, tile.textColor || "#ffffff");
        }
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Draw grid decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawGridDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        const gridSize = size / 4;
        
        // Draw horizontal lines
        for (let y = 0; y <= size; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }
        
        // Draw vertical lines
        for (let x = 0; x <= size; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw circuit decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawCircuitDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        
        // Draw circuit lines
        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.5);
        ctx.lineTo(size * 0.8, size * 0.5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.2);
        ctx.lineTo(size * 0.5, size * 0.8);
        ctx.stroke();
        
        // Draw circuit nodes
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        
        ctx.beginPath();
        ctx.arc(size * 0.2, size * 0.5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(size * 0.8, size * 0.5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(size * 0.5, size * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(size * 0.5, size * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw hologram decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawHologramDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // Draw hologram lines
        const lineCount = 5;
        const lineHeight = size / (lineCount + 1);
        
        for (let i = 1; i <= lineCount; i++) {
            const y = i * lineHeight;
            const offset = Math.sin(Date.now() / 500 + i) * 2;
            
            ctx.beginPath();
            ctx.moveTo(offset, y);
            ctx.lineTo(size - offset, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw neon decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawNeonDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.7;
        
        // Draw neon lines
        ctx.beginPath();
        ctx.moveTo(size * 0.1, size * 0.1);
        ctx.lineTo(size * 0.9, size * 0.1);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(size * 0.9, size * 0.1);
        ctx.lineTo(size * 0.9, size * 0.9);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(size * 0.9, size * 0.9);
        ctx.lineTo(size * 0.1, size * 0.9);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(size * 0.1, size * 0.9);
        ctx.lineTo(size * 0.1, size * 0.1);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw panel decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawPanelDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw panel
        const panelSize = size * 0.8;
        const panelX = (size - panelSize) / 2;
        const panelY = (size - panelSize) / 2;
        
        ctx.fillRect(panelX, panelY, panelSize, panelSize);
        
        // Draw panel lines
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(panelX, panelY + panelSize / 3);
        ctx.lineTo(panelX + panelSize, panelY + panelSize / 3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(panelX, panelY + panelSize * 2 / 3);
        ctx.lineTo(panelX + panelSize, panelY + panelSize * 2 / 3);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw screen decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawScreenDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw screen
        const screenWidth = size * 0.8;
        const screenHeight = size * 0.6;
        const screenX = (size - screenWidth) / 2;
        const screenY = (size - screenHeight) / 2;
        
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
        
        // Draw scanlines
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        
        const scanlineCount = 5;
        const scanlineHeight = screenHeight / scanlineCount;
        
        for (let i = 0; i < scanlineCount; i++) {
            const y = screenY + i * scanlineHeight;
            
            ctx.beginPath();
            ctx.moveTo(screenX, y);
            ctx.lineTo(screenX + screenWidth, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw vent decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawVentDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // Draw vent slats
        const slatCount = 7;
        const slatHeight = size / (slatCount + 1);
        
        for (let i = 1; i <= slatCount; i++) {
            const y = i * slatHeight;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw ad decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     * @param {string} text - Ad text
     */
    drawAdDecoration(ctx, size, color, text) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw ad background
        const adWidth = size * 0.9;
        const adHeight = size * 0.7;
        const adX = (size - adWidth) / 2;
        const adY = (size - adHeight) / 2;
        
        ctx.fillRect(adX, adY, adWidth, adHeight);
        
        // Draw ad text
        if (text) {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7;
            ctx.font = `${size * 0.15}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.fillText(text, size / 2, size / 2);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw cracks decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawCracksDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        // Draw random cracks
        const crackCount = 3;
        
        for (let i = 0; i < crackCount; i++) {
            const startX = Math.random() * size;
            const startY = Math.random() * size;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            
            const segmentCount = 5;
            
            for (let j = 0; j < segmentCount; j++) {
                x += (Math.random() - 0.5) * size * 0.2;
                y += (Math.random() - 0.5) * size * 0.2;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw stains decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawStainsDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw random stains
        const stainCount = 2;
        
        for (let i = 0; i < stainCount; i++) {
            const stainX = Math.random() * size;
            const stainY = Math.random() * size;
            const stainSize = size * (0.1 + Math.random() * 0.2);
            
            ctx.beginPath();
            ctx.arc(stainX, stainY, stainSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw graffiti decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawGraffitiDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        // Draw graffiti tag
        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.2);
        ctx.lineTo(size * 0.3, size * 0.8);
        ctx.lineTo(size * 0.7, size * 0.3);
        ctx.lineTo(size * 0.8, size * 0.7);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw warning decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawWarningDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        // Draw warning triangle
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX + radius * Math.cos(Math.PI / 6), centerY + radius * Math.sin(Math.PI / 6));
        ctx.lineTo(centerX - radius * Math.cos(Math.PI / 6), centerY + radius * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.stroke();
        
        // Draw exclamation mark
        ctx.fillStyle = color;
        ctx.font = `${size * 0.2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText("!", centerX, centerY);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw cityscape decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawCityscapeDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        
        // Draw buildings
        const buildingCount = 5;
        const buildingWidth = size / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
            const buildingHeight = size * (0.3 + Math.random() * 0.5);
            const buildingX = i * buildingWidth;
            const buildingY = size - buildingHeight;
            
            ctx.fillRect(buildingX, buildingY, buildingWidth - 1, buildingHeight);
            
            // Draw windows
            ctx.fillStyle = "#ffff00";
            ctx.globalAlpha = 0.3;
            
            const windowSize = buildingWidth * 0.2;
            const windowSpacing = buildingWidth * 0.3;
            
            for (let y = buildingY + windowSpacing; y < size - windowSpacing; y += windowSize + windowSpacing) {
                for (let x = buildingX + windowSpacing; x < buildingX + buildingWidth - windowSpacing; x += windowSize + windowSpacing) {
                    if (Math.random() > 0.3) {
                        ctx.fillRect(x, y, windowSize, windowSize);
                    }
                }
            }
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw buildings decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawBuildingsDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw buildings
        const buildingCount = 3;
        const buildingWidth = size / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
            const buildingHeight = size * (0.5 + Math.random() * 0.5);
            const buildingX = i * buildingWidth;
            const buildingY = size - buildingHeight;
            
            ctx.fillRect(buildingX, buildingY, buildingWidth - 1, buildingHeight);
            
            // Draw antenna
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.4;
            
            ctx.beginPath();
            ctx.moveTo(buildingX + buildingWidth / 2, buildingY);
            ctx.lineTo(buildingX + buildingWidth / 2, buildingY - size * 0.2);
            ctx.stroke();
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.3;
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw neon signs decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawNeonSignsDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.6;
        
        // Draw neon signs
        const signCount = 2;
        
        for (let i = 0; i < signCount; i++) {
            const signWidth = size * 0.3;
            const signHeight = size * 0.1;
            const signX = size * 0.2 + i * size * 0.5;
            const signY = size * 0.3;
            
            ctx.strokeRect(signX, signY, signWidth, signHeight);
            
            // Draw neon glow
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(signX - 2, signY - 2, signWidth + 4, signHeight + 4);
            
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.6;
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw holograms decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawHologramsDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // Draw hologram projections
        const hologramCount = 2;
        
        for (let i = 0; i < hologramCount; i++) {
            const hologramX = size * 0.25 + i * size * 0.5;
            const hologramY = size * 0.5;
            const hologramSize = size * 0.2;
            
            // Draw hologram base
            ctx.beginPath();
            ctx.ellipse(hologramX, hologramY + hologramSize, hologramSize, hologramSize * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw hologram projection
            ctx.beginPath();
            ctx.moveTo(hologramX, hologramY - hologramSize);
            ctx.lineTo(hologramX - hologramSize, hologramY + hologramSize);
            ctx.lineTo(hologramX + hologramSize, hologramY + hologramSize);
            ctx.closePath();
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw corner shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} direction - Corner direction
     */
    drawCornerShape(ctx, size, direction) {
        ctx.fillStyle = "#0f3460";
        
        switch (direction) {
            case "tl":
                // Top-left corner
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(size, 0);
                ctx.lineTo(0, size);
                ctx.closePath();
                ctx.fill();
                break;
            case "tr":
                // Top-right corner
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(size, 0);
                ctx.lineTo(size, size);
                ctx.closePath();
                ctx.fill();
                break;
            case "bl":
                // Bottom-left corner
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, size);
                ctx.lineTo(size, size);
                ctx.closePath();
                ctx.fill();
                break;
            case "br":
                // Bottom-right corner
                ctx.beginPath();
                ctx.moveTo(size, 0);
                ctx.lineTo(size, size);
                ctx.lineTo(0, size);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }
    
    /**
     * Draw crate shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawCrateShape(ctx, size) {
        ctx.fillStyle = "#533483";
        
        // Draw crate
        const crateSize = size * 0.8;
        const crateX = (size - crateSize) / 2;
        const crateY = (size - crateSize) / 2;
        
        ctx.fillRect(crateX, crateY, crateSize, crateSize);
        
        // Draw crate details
        ctx.strokeStyle = "#0f3460";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(crateX, crateY + crateSize / 3);
        ctx.lineTo(crateX + crateSize, crateY + crateSize / 3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(crateX, crateY + crateSize * 2 / 3);
        ctx.lineTo(crateX + crateSize, crateY + crateSize * 2 / 3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(crateX + crateSize / 3, crateY);
        ctx.lineTo(crateX + crateSize / 3, crateY + crateSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(crateX + crateSize * 2 / 3, crateY);
        ctx.lineTo(crateX + crateSize * 2 / 3, crateY + crateSize);
        ctx.stroke();
    }
    
    /**
     * Draw barrel shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawBarrelShape(ctx, size) {
        ctx.fillStyle = "#e94560";
        
        // Draw barrel
        const barrelWidth = size * 0.6;
        const barrelHeight = size * 0.8;
        const barrelX = (size - barrelWidth) / 2;
        const barrelY = (size - barrelHeight) / 2;
        
        // Draw barrel body
        ctx.fillRect(barrelX, barrelY, barrelWidth, barrelHeight);
        
        // Draw barrel top
        ctx.beginPath();
        ctx.ellipse(barrelX + barrelWidth / 2, barrelY, barrelWidth / 2, barrelWidth / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw barrel bottom
        ctx.beginPath();
        ctx.ellipse(barrelX + barrelWidth / 2, barrelY + barrelHeight, barrelWidth / 2, barrelWidth / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw barrel details
        ctx.strokeStyle = "#0f3460";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(barrelX, barrelY + barrelHeight / 3);
        ctx.lineTo(barrelX + barrelWidth, barrelY + barrelHeight / 3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(barrelX, barrelY + barrelHeight * 2 / 3);
        ctx.lineTo(barrelX + barrelWidth, barrelY + barrelHeight * 2 / 3);
        ctx.stroke();
    }
    
    /**
     * Draw terminal shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawTerminalShape(ctx, size) {
        ctx.fillStyle = "#0f3460";
        
        // Draw terminal
        const terminalWidth = size * 0.8;
        const terminalHeight = size * 0.7;
        const terminalX = (size - terminalWidth) / 2;
        const terminalY = (size - terminalHeight) / 2;
        
        ctx.fillRect(terminalX, terminalY, terminalWidth, terminalHeight);
        
        // Draw terminal screen
        ctx.fillStyle = "#00ffff";
        ctx.globalAlpha = 0.7;
        
        const screenWidth = terminalWidth * 0.9;
        const screenHeight = terminalHeight * 0.6;
        const screenX = terminalX + (terminalWidth - screenWidth) / 2;
        const screenY = terminalY + (terminalHeight - screenHeight) / 2;
        
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
        
        // Draw terminal text
        ctx.fillStyle = "#0f3460";
        ctx.globalAlpha = 0.8;
        ctx.font = `${size * 0.1}px monospace`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        
        const lines = [
            "> SYSTEM ONLINE",
            "> INITIALIZING...",
            "> READY"
        ];
        
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], screenX + 5, screenY + 5 + i * size * 0.12);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw server shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawServerShape(ctx, size) {
        ctx.fillStyle = "#16213e";
        
        // Draw server
        const serverWidth = size * 0.6;
        const serverHeight = size * 0.8;
        const serverX = (size - serverWidth) / 2;
        const serverY = (size - serverHeight) / 2;
        
        ctx.fillRect(serverX, serverY, serverWidth, serverHeight);
        
        // Draw server details
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        
        // Draw server panels
        const panelCount = 4;
        const panelHeight = serverHeight / panelCount;
        
        for (let i = 0; i < panelCount; i++) {
            const panelY = serverY + i * panelHeight;
            
            ctx.beginPath();
            ctx.moveTo(serverX, panelY);
            ctx.lineTo(serverX + serverWidth, panelY);
            ctx.stroke();
        }
        
        // Draw server lights
        const lightColors = ["#00ff00", "#ffff00", "#ff0000"];
        
        for (let i = 0; i < panelCount; i++) {
            const lightY = serverY + i * panelHeight + panelHeight / 2;
            const lightColor = lightColors[i % lightColors.length];
            
            ctx.fillStyle = lightColor;
            ctx.globalAlpha = 0.7;
            
            ctx.beginPath();
            ctx.arc(serverX + serverWidth - 5, lightY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw low wall shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawLowWallShape(ctx, size) {
        ctx.fillStyle = "#533483";
        
        // Draw low wall
        const wallHeight = size * 0.5;
        
        ctx.fillRect(0, size - wallHeight, size, wallHeight);
        
        // Draw wall details
        ctx.strokeStyle = "#0f3460";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(0, size - wallHeight);
        ctx.lineTo(size, size - wallHeight);
        ctx.stroke();
    }
    
    /**
     * Draw barrier shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawBarrierShape(ctx, size) {
        ctx.fillStyle = "#0f3460";
        
        // Draw barrier
        const barrierWidth = size * 0.2;
        const barrierHeight = size * 0.7;
        const barrierX = (size - barrierWidth) / 2;
        const barrierY = (size - barrierHeight) / 2;
        
        ctx.fillRect(barrierX, barrierY, barrierWidth, barrierHeight);
        
        // Draw barrier base
        const baseWidth = size * 0.4;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
    }
    
    /**
     * Draw energy shield shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawEnergyShieldShape(ctx, size) {
        ctx.strokeStyle = "#e94560";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        // Draw energy shield
        const shieldWidth = size * 0.8;
        const shieldHeight = size * 0.6;
        const shieldX = (size - shieldWidth) / 2;
        const shieldY = (size - shieldHeight) / 2;
        
        // Draw shield outline
        ctx.strokeRect(shieldX, shieldY, shieldWidth, shieldHeight);
        
        // Draw shield energy
        ctx.fillStyle = "#e94560";
        ctx.globalAlpha = 0.2;
        
        ctx.fillRect(shieldX, shieldY, shieldWidth, shieldHeight);
        
        // Draw shield pattern
        ctx.strokeStyle = "#e94560";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        const patternSize = 10;
        
        for (let x = shieldX; x < shieldX + shieldWidth; x += patternSize) {
            ctx.beginPath();
            ctx.moveTo(x, shieldY);
            ctx.lineTo(x, shieldY + shieldHeight);
            ctx.stroke();
        }
        
        for (let y = shieldY; y < shieldY + shieldHeight; y += patternSize) {
            ctx.beginPath();
            ctx.moveTo(shieldX, y);
            ctx.lineTo(shieldX + shieldWidth, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw hologram wall shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawHologramWallShape(ctx, size) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        // Draw hologram wall
        const wallWidth = size * 0.8;
        const wallHeight = size * 0.7;
        const wallX = (size - wallWidth) / 2;
        const wallY = (size - wallHeight) / 2;
        
        // Draw wall outline
        ctx.strokeRect(wallX, wallY, wallWidth, wallHeight);
        
        // Draw wall pattern
        const lineCount = 5;
        const lineHeight = wallHeight / lineCount;
        
        for (let i = 1; i < lineCount; i++) {
            const y = wallY + i * lineHeight;
            const offset = Math.sin(Date.now() / 500 + i) * 2;
            
            ctx.beginPath();
            ctx.moveTo(wallX + offset, y);
            ctx.lineTo(wallX + wallWidth + offset, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw electric floor shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawElectricFloorShape(ctx, size) {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, size, size);
        
        // Draw electric pattern
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        
        const gridSize = size / 4;
        
        // Draw grid
        for (let x = 0; x <= size; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }
        
        for (let y = 0; y <= size; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }
        
        // Draw electric arcs
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 10;
        
        for (let i = 0; i < 3; i++) {
            const startX = Math.random() * size;
            const startY = Math.random() * size;
            const endX = startX + (Math.random() - 0.5) * size * 0.5;
            const endY = startY + (Math.random() - 0.5) * size * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            // Create jagged line
            const segments = 5;
            for (let j = 1; j <= segments; j++) {
                const t = j / segments;
                const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 10;
                const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 10;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw toxic pool shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawToxicPoolShape(ctx, size) {
        ctx.fillStyle = "#16213e";
        ctx.fillRect(0, 0, size, size);
        
        // Draw toxic pool
        ctx.fillStyle = "#533483";
        ctx.globalAlpha = 0.6;
        
        const poolRadius = size * 0.4;
        const poolX = size / 2;
        const poolY = size / 2;
        
        ctx.beginPath();
        ctx.arc(poolX, poolY, poolRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw toxic bubbles
        ctx.fillStyle = "#00ff00";
        ctx.globalAlpha = 0.7;
        
        const bubbleCount = 5;
        
        for (let i = 0; i < bubbleCount; i++) {
            const angle = (i / bubbleCount) * Math.PI * 2;
            const distance = poolRadius * 0.7;
            const bubbleX = poolX + Math.cos(angle) * distance;
            const bubbleY = poolY + Math.sin(angle) * distance;
            const bubbleSize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw laser grid shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawLaserGridShape(ctx, size) {
        ctx.fillStyle = "#0f3460";
        ctx.fillRect(0, 0, size, size);
        
        // Draw laser grid
        ctx.strokeStyle = "#e94560";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#e94560";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const gridSize = size / 3;
        
        // Draw horizontal lasers
        for (let y = gridSize; y < size; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }
        
        // Draw vertical lasers
        for (let x = gridSize; x < size; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw plasma leak shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawPlasmaLeakShape(ctx, size) {
        ctx.fillStyle = "#16213e";
        ctx.fillRect(0, 0, size, size);
        
        // Draw plasma leak
        ctx.fillStyle = "#e94560";
        ctx.globalAlpha = 0.6;
        
        const leakRadius = size * 0.3;
        const leakX = size / 2;
        const leakY = size / 2;
        
        ctx.beginPath();
        ctx.arc(leakX, leakY, leakRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw plasma particles
        ctx.fillStyle = "#ff00ff";
        ctx.globalAlpha = 0.8;
        
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = leakRadius * (1 + Math.random() * 0.5);
            const particleX = leakX + Math.cos(angle) * distance;
            const particleY = leakY + Math.sin(angle) * distance;
            const particleSize = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw spawn point shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} spawnType - Spawn type
     */
    drawSpawnPointShape(ctx, size, spawnType) {
        // Set color based on spawn type
        let color;
        switch (spawnType) {
            case "player":
                color = "#00ffff";
                break;
            case "enemy":
                color = "#e94560";
                break;
            case "boss":
                color = "#ff00ff";
                break;
            case "powerup":
                color = "#00ff00";
                break;
            default:
                color = "#ffffff";
        }
        
        // Draw spawn point
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const spawnRadius = size * 0.4;
        const spawnX = size / 2;
        const spawnY = size / 2;
        
        // Draw spawn circle
        ctx.beginPath();
        ctx.arc(spawnX, spawnY, spawnRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw spawn symbol
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        
        switch (spawnType) {
            case "player":
                // Draw player symbol
                ctx.beginPath();
                ctx.moveTo(spawnX, spawnY - spawnRadius * 0.5);
                ctx.lineTo(spawnX - spawnRadius * 0.4, spawnY + spawnRadius * 0.5);
                ctx.lineTo(spawnX + spawnRadius * 0.4, spawnY + spawnRadius * 0.5);
                ctx.closePath();
                ctx.fill();
                break;
            case "enemy":
                // Draw enemy symbol
                ctx.beginPath();
                ctx.moveTo(spawnX - spawnRadius * 0.3, spawnY - spawnRadius * 0.3);
                ctx.lineTo(spawnX + spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.moveTo(spawnX + spawnRadius * 0.3, spawnY - spawnRadius * 0.3);
                ctx.lineTo(spawnX - spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.stroke();
                break;
            case "boss":
                // Draw boss symbol
                ctx.beginPath();
                ctx.arc(spawnX, spawnY, spawnRadius * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(spawnX - spawnRadius * 0.5, spawnY);
                ctx.lineTo(spawnX + spawnRadius * 0.5, spawnY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(spawnX, spawnY - spawnRadius * 0.5);
                ctx.lineTo(spawnX, spawnY + spawnRadius * 0.5);
                ctx.stroke();
                break;
            case "powerup":
                // Draw powerup symbol
                ctx.beginPath();
                ctx.moveTo(spawnX, spawnY - spawnRadius * 0.5);
                ctx.lineTo(spawnX - spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.lineTo(spawnX + spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(spawnX, spawnY, spawnRadius * 0.2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw data terminal shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawDataTerminalShape(ctx, size) {
        ctx.fillStyle = "#0f3460";
        
        // Draw terminal base
        const baseWidth = size * 0.8;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
        
        // Draw terminal pole
        const poleWidth = size * 0.1;
        const poleHeight = size * 0.6;
        const poleX = (size - poleWidth) / 2;
        const poleY = baseY - poleHeight;
        
        ctx.fillRect(poleX, poleY, poleWidth, poleHeight);
        
        // Draw terminal screen
        const screenWidth = size * 0.6;
        const screenHeight = size * 0.3;
        const screenX = (size - screenWidth) / 2;
        const screenY = poleY;
        
        ctx.fillStyle = "#00ff00";
        ctx.globalAlpha = 0.7;
        
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
        
        // Draw terminal text
        ctx.fillStyle = "#0f3460";
        ctx.globalAlpha = 0.8;
        ctx.font = `${size * 0.1}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText("DATA", size / 2, screenY + screenHeight / 2);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw control panel shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawControlPanelShape(ctx, size) {
        ctx.fillStyle = "#0f3460";
        
        // Draw panel
        const panelWidth = size * 0.8;
        const panelHeight = size * 0.6;
        const panelX = (size - panelWidth) / 2;
        const panelY = (size - panelHeight) / 2;
        
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        
        // Draw panel controls
        const controlSize = size * 0.1;
        const controlSpacing = size * 0.2;
        
        for (let x = panelX + controlSpacing; x < panelX + panelWidth - controlSpacing; x += controlSpacing) {
            for (let y = panelY + controlSpacing; y < panelY + panelHeight - controlSpacing; y += controlSpacing) {
                // Draw button
                ctx.fillStyle = "#00ffff";
                ctx.globalAlpha = 0.7;
                
                ctx.beginPath();
                ctx.arc(x, y, controlSize / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw button light
                ctx.fillStyle = Math.random() > 0.5 ? "#00ff00" : "#ff0000";
                ctx.globalAlpha = 0.8;
                
                ctx.beginPath();
                ctx.arc(x, y, controlSize / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw hologram projector shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawHologramProjectorShape(ctx, size) {
        ctx.fillStyle = "#0f3460";
        
        // Draw projector base
        const baseWidth = size * 0.6;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
        
        // Draw projector pole
        const poleWidth = size * 0.1;
        const poleHeight = size * 0.5;
        const poleX = (size - poleWidth) / 2;
        const poleY = baseY - poleHeight;
        
        ctx.fillRect(poleX, poleY, poleWidth, poleHeight);
        
        // Draw projector head
        const headWidth = size * 0.3;
        const headHeight = size * 0.2;
        const headX = (size - headWidth) / 2;
        const headY = poleY - headHeight;
        
        ctx.fillRect(headX, headY, headWidth, headHeight);
        
        // Draw hologram projection
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        const projectionHeight = size * 0.3;
        const projectionWidth = size * 0.4;
        const projectionX = (size - projectionWidth) / 2;
        const projectionY = headY - projectionHeight;
        
        // Draw projection outline
        ctx.strokeRect(projectionX, projectionY, projectionWidth, projectionHeight);
        
        // Draw projection pattern
        const lineCount = 3;
        const lineHeight = projectionHeight / (lineCount + 1);
        
        for (let i = 1; i <= lineCount; i++) {
            const y = projectionY + i * lineHeight;
            const offset = Math.sin(Date.now() / 500 + i) * 2;
            
            ctx.beginPath();
            ctx.moveTo(projectionX + offset, y);
            ctx.lineTo(projectionX + projectionWidth + offset, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw power core shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawPowerCoreShape(ctx, size) {
        // Draw power core base
        ctx.fillStyle = "#0f3460";
        
        const baseWidth = size * 0.8;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
        
        // Draw power core pole
        const poleWidth = size * 0.1;
        const poleHeight = size * 0.6;
        const poleX = (size - poleWidth) / 2;
        const poleY = baseY - poleHeight;
        
        ctx.fillRect(poleX, poleY, poleWidth, poleHeight);
        
        // Draw power core
        const coreRadius = size * 0.2;
        const coreX = size / 2;
        const coreY = poleY - coreRadius;
        
        // Draw core glow
        const gradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreRadius * 2);
        gradient.addColorStop(0, "rgba(255, 255, 0, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // Draw core
        ctx.fillStyle = "#ffff00";
        ctx.globalAlpha = 0.8;
        
        ctx.beginPath();
        ctx.arc(coreX, coreY, coreRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core energy
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ffff00";
        ctx.shadowBlur = 10;
        
        const energyCount = 8;
        
        for (let i = 0; i < energyCount; i++) {
            const angle = (i / energyCount) * Math.PI * 2;
            const startRadius = coreRadius;
            const endRadius = coreRadius * 1.5;
            
            ctx.beginPath();
            ctx.moveTo(
                coreX + Math.cos(angle) * startRadius,
                coreY + Math.sin(angle) * startRadius
            );
            ctx.lineTo(
                coreX + Math.cos(angle) * endRadius,
                coreY + Math.sin(angle) * endRadius
            );
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw tech plant shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawTechPlantShape(ctx, size) {
        // Draw plant pot
        ctx.fillStyle = "#0f3460";
        
        const potWidth = size * 0.4;
        const potHeight = size * 0.2;
        const potX = (size - potWidth) / 2;
        const potY = size - potHeight;
        
        ctx.fillRect(potX, potY, potWidth, potHeight);
        
        // Draw plant stem
        const stemWidth = size * 0.05;
        const stemHeight = size * 0.5;
        const stemX = (size - stemWidth) / 2;
        const stemY = potY - stemHeight;
        
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(stemX, stemY, stemWidth, stemHeight);
        
        // Draw plant leaves
        const leafCount = 5;
        
        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2 - Math.PI / 2;
            const leafLength = size * 0.2;
            const leafX = stemX + Math.cos(angle) * leafLength;
            const leafY = stemY + Math.sin(angle) * leafLength;
            
            ctx.beginPath();
            ctx.moveTo(stemX, stemY);
            ctx.quadraticCurveTo(
                stemX + Math.cos(angle) * leafLength / 2,
                stemY + Math.sin(angle) * leafLength / 2,
                leafX,
                leafY
            );
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw plant tech details
        ctx.fillStyle = "#00ffff";
        ctx.globalAlpha = 0.5;
        
        const detailCount = 3;
        
        for (let i = 0; i < detailCount; i++) {
            const angle = (i / detailCount) * Math.PI * 2;
            const detailRadius = size * 0.1;
            const detailX = stemX + Math.cos(angle) * detailRadius;
            const detailY = stemY + Math.sin(angle) * detailRadius;
            
            ctx.beginPath();
            ctx.arc(detailX, detailY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw floating orb shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawFloatingOrbShape(ctx, size) {
        // Draw orb
        const orbRadius = size * 0.2;
        const orbX = size / 2;
        const orbY = size / 2;
        
        // Draw orb glow
        const gradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 2);
        gradient.addColorStop(0, "rgba(83, 52, 131, 0.8)");
        gradient.addColorStop(1, "rgba(83, 52, 131, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // Draw orb
        ctx.fillStyle = "#533483";
        ctx.globalAlpha = 0.8;
        
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw orb details
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        const lineCount = 3;
        
        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(
                orbX + Math.cos(angle) * orbRadius * 0.7,
                orbY + Math.sin(angle) * orbRadius * 0.7
            );
            ctx.lineTo(
                orbX + Math.cos(angle + Math.PI) * orbRadius * 0.7,
                orbY + Math.sin(angle + Math.PI) * orbRadius * 0.7
            );
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw sliding door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawSlidingDoorShape(ctx, size, open) {
        ctx.fillStyle = "#0f3460";
        
        // Draw door frame
        const frameWidth = size * 0.1;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.8 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#16213e";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw door details
            ctx.strokeStyle = "#00ffff";
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            
            const panelCount = 3;
            const panelHeight = doorHeight / panelCount;
            
            for (let i = 1; i < panelCount; i++) {
                const y = frameWidth + i * panelHeight;
                
                ctx.beginPath();
                ctx.moveTo(frameWidth, y);
                ctx.lineTo(frameWidth + doorWidth, y);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Draw security door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawSecurityDoorShape(ctx, size, open) {
        ctx.fillStyle = "#0f3460";
        
        // Draw door frame
        const frameWidth = size * 0.15;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.7 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#16213e";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw door details
            ctx.strokeStyle = "#e94560";
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7;
            
            // Draw door pattern
            const patternSize = 10;
            
            for (let x = frameWidth + patternSize; x < frameWidth + doorWidth; x += patternSize * 2) {
                for (let y = frameWidth + patternSize; y < frameWidth + doorHeight; y += patternSize * 2) {
                    ctx.strokeRect(x, y, patternSize, patternSize);
                }
            }
            
            // Draw lock
            ctx.fillStyle = "#ffff00";
            ctx.globalAlpha = 0.8;
            
            const lockX = frameWidth + doorWidth / 2;
            const lockY = frameWidth + doorHeight / 2;
            const lockRadius = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(lockX, lockY, lockRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Draw blast door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawBlastDoorShape(ctx, size, open) {
        ctx.fillStyle = "#0f3460";
        
        // Draw door frame
        const frameWidth = size * 0.2;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.6 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#533483";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw door details
            ctx.strokeStyle = "#e94560";
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.7;
            
            // Draw door reinforcement
            const reinforcementCount = 3;
            const reinforcementHeight = doorHeight / reinforcementCount;
            
            for (let i = 0; i < reinforcementCount; i++) {
                const y = frameWidth + i * reinforcementHeight;
                
                ctx.beginPath();
                ctx.moveTo(frameWidth, y);
                ctx.lineTo(frameWidth + doorWidth, y);
                ctx.stroke();
            }
            
            // Draw bolts
            ctx.fillStyle = "#0f3460";
            ctx.globalAlpha = 0.8;
            
            const boltRadius = size * 0.03;
            const boltSpacing = size * 0.2;
            
            for (let x = frameWidth + boltSpacing; x < frameWidth + doorWidth; x += boltSpacing) {
                for (let y = frameWidth + boltSpacing; y < frameWidth + doorHeight; y += boltSpacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, boltRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Draw energy door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawEnergyDoorShape(ctx, size, open) {
        // Draw door frame
        ctx.fillStyle = "#0f3460";
        
        const frameWidth = size * 0.1;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw energy field
        if (!open) {
            const doorWidth = size * 0.8 - frameWidth * 2;
            const doorHeight = size - frameWidth * 2;
            const doorX = frameWidth;
            const doorY = frameWidth;
            
            // Draw energy field
            ctx.strokeStyle = "#e94560";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#e94560";
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 0.7;
            
            // Draw energy lines
            const lineCount = 8;
            
            for (let i = 0; i < lineCount; i++) {
                const x = doorX + (i / (lineCount - 1)) * doorWidth;
                const offset = Math.sin(Date.now() / 200 + i) * 5;
                
                ctx.beginPath();
                ctx.moveTo(x + offset, doorY);
                ctx.lineTo(x + offset, doorY + doorHeight);
                ctx.stroke();
            }
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Draw floating platform shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawFloatingPlatformShape(ctx, size) {
        // Draw platform
        ctx.fillStyle = "#0f3460";
        
        const platformWidth = size * 0.8;
        const platformHeight = size * 0.2;
        const platformX = (size - platformWidth) / 2;
        const platformY = (size - platformHeight) / 2;
        
        ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
        
        // Draw platform details
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        // Draw platform lines
        const lineCount = 3;
        const lineSpacing = platformWidth / (lineCount + 1);
        
        for (let i = 1; i <= lineCount; i++) {
            const x = platformX + i * lineSpacing;
            
            ctx.beginPath();
            ctx.moveTo(x, platformY);
            ctx.lineTo(x, platformY + platformHeight);
            ctx.stroke();
        }
        
        // Draw platform supports
        const supportWidth = size * 0.05;
        const supportHeight = size * 0.3;
        const supportX1 = platformX + platformWidth * 0.2;
        const supportX2 = platformX + platformWidth * 0.8;
        const supportY = platformY + platformHeight;
        
        ctx.fillStyle = "#16213e";
        ctx.fillRect(supportX1 - supportWidth / 2, supportY, supportWidth, supportHeight);
        ctx.fillRect(supportX2 - supportWidth / 2, supportY, supportWidth, supportHeight);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw moving platform shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawMovingPlatformShape(ctx, size) {
        // Draw platform
        ctx.fillStyle = "#16213e";
        
        const platformWidth = size * 0.8;
        const platformHeight = size * 0.2;
        const platformX = (size - platformWidth) / 2;
        const platformY = (size - platformHeight) / 2;
        
        ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
        
        // Draw platform details
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        // Draw platform lines
        const lineCount = 3;
        const lineSpacing = platformWidth / (lineCount + 1);
        
        for (let i = 1; i <= lineCount; i++) {
            const x = platformX + i * lineSpacing;
            
            ctx.beginPath();
            ctx.moveTo(x, platformY);
            ctx.lineTo(x, platformY + platformHeight);
            ctx.stroke();
        }
        
        // Draw platform direction indicator
        ctx.fillStyle = "#00ff00";
        ctx.globalAlpha = 0.7;
        
        const arrowX = platformX + platformWidth / 2;
        const arrowY = platformY + platformHeight / 2;
        const arrowSize = size * 0.1;
        
        ctx.beginPath();
        ctx.moveTo(arrowX - arrowSize, arrowY);
        ctx.lineTo(arrowX + arrowSize, arrowY);
        ctx.lineTo(arrowX, arrowY - arrowSize);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw rotating platform shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawRotatingPlatformShape(ctx, size) {
        // Draw platform
        ctx.fillStyle = "#533483";
        
        const platformRadius = size * 0.3;
        const platformX = size / 2;
        const platformY = size / 2;
        
        ctx.beginPath();
        ctx.arc(platformX, platformY, platformRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw platform details
        ctx.strokeStyle = "#e94560";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        // Draw platform lines
        const lineCount = 6;
        
        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(
                platformX + Math.cos(angle) * platformRadius * 0.3,
                platformY + Math.sin(angle) * platformRadius * 0.3
            );
            ctx.lineTo(
                platformX + Math.cos(angle) * platformRadius * 0.9,
                platformY + Math.sin(angle) * platformRadius * 0.9
            );
            ctx.stroke();
        }
        
        // Draw rotation indicator
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        
        ctx.beginPath();
        ctx.arc(platformX, platformY, platformRadius * 1.2, 0, Math.PI * 1.5);
        ctx.stroke();
        
        // Draw arrow
        const arrowAngle = Math.PI * 1.5;
        const arrowX = platformX + Math.cos(arrowAngle) * platformRadius * 1.2;
        const arrowY = platformY + Math.sin(arrowAngle) * platformRadius * 1.2;
        const arrowSize = size * 0.05;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
            arrowX - Math.cos(arrowAngle - Math.PI / 6) * arrowSize * 2,
            arrowY - Math.sin(arrowAngle - Math.PI / 6) * arrowSize * 2
        );
        ctx.lineTo(
            arrowX - Math.cos(arrowAngle + Math.PI / 6) * arrowSize * 2,
            arrowY - Math.sin(arrowAngle + Math.PI / 6) * arrowSize * 2
        );
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw water shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawWaterShape(ctx, size) {
        // Draw water
        ctx.fillStyle = "#00ffff";
        ctx.globalAlpha = 0.5;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw water waves
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        
        const waveCount = 3;
        const waveHeight = size * 0.1;
        
        for (let i = 0; i < waveCount; i++) {
            const y = size * 0.2 + i * size * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x <= size; x += 5) {
                const waveY = y + Math.sin((x / size) * Math.PI * 4 + Date.now() / 1000 + i) * waveHeight;
                ctx.lineTo(x, waveY);
            }
            
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw acid shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawAcidShape(ctx, size) {
        // Draw acid
        ctx.fillStyle = "#533483";
        ctx.globalAlpha = 0.6;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw acid bubbles
        ctx.fillStyle = "#00ff00";
        ctx.globalAlpha = 0.7;
        
        const bubbleCount = 8;
        
        for (let i = 0; i < bubbleCount; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const bubbleSize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(x, y, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw lava shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawLavaShape(ctx, size) {
        // Draw lava
        ctx.fillStyle = "#e94560";
        ctx.globalAlpha = 0.7;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw lava glow
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2);
        gradient.addColorStop(0, "rgba(255, 100, 0, 0.5)");
        gradient.addColorStop(1, "rgba(255, 100, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // Draw lava bubbles
        ctx.fillStyle = "#ffff00";
        ctx.globalAlpha = 0.8;
        
        const bubbleCount = 5;
        
        for (let i = 0; i < bubbleCount; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const bubbleSize = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(x, y, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw liquid metal shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawLiquidMetalShape(ctx, size) {
        // Draw liquid metal
        ctx.fillStyle = "#16213e";
        ctx.globalAlpha = 0.8;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw metal ripples
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        const rippleCount = 3;
        const maxRippleRadius = size * 0.4;
        
        for (let i = 0; i < rippleCount; i++) {
            const rippleRadius = (Date.now() / 500 + i) % maxRippleRadius;
            const rippleAlpha = 1 - (rippleRadius / maxRippleRadius);
            
            ctx.globalAlpha = rippleAlpha * 0.5;
            
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, rippleRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw teleporter shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawTeleporterShape(ctx, size) {
        // Draw teleporter base
        ctx.fillStyle = "#0f3460";
        
        const baseRadius = size * 0.4;
        const baseX = size / 2;
        const baseY = size / 2;
        
        ctx.beginPath();
        ctx.arc(baseX, baseY, baseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw teleporter ring
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const ringRadius = size * 0.3;
        
        ctx.beginPath();
        ctx.arc(baseX, baseY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw teleporter energy
        ctx.fillStyle = "#00ffff";
        ctx.globalAlpha = 0.5;
        
        const energyCount = 8;
        
        for (let i = 0; i < energyCount; i++) {
            const angle = (i / energyCount) * Math.PI * 2 + Date.now() / 1000;
            const energyRadius = ringRadius * 0.7;
            const energyX = baseX + Math.cos(angle) * energyRadius;
            const energyY = baseY + Math.sin(angle) * energyRadius;
            const energySize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(energyX, energyY, energySize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw accelerator shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} direction - Accelerator direction
     */
    drawAcceleratorShape(ctx, size, direction) {
        // Draw accelerator base
        ctx.fillStyle = "#0f3460";
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw accelerator field
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ff00ff";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.7;
        
        // Draw accelerator lines based on direction
        const lineCount = 5;
        const lineSpacing = size / (lineCount + 1);
        
        for (let i = 1; i <= lineCount; i++) {
            let x1, y1, x2, y2;
            
            switch (direction) {
                case "right":
                    x1 = 0;
                    y1 = i * lineSpacing;
                    x2 = size;
                    y2 = i * lineSpacing;
                    break;
                case "left":
                    x1 = size;
                    y1 = i * lineSpacing;
                    x2 = 0;
                    y2 = i * lineSpacing;
                    break;
                case "up":
                    x1 = i * lineSpacing;
                    y1 = size;
                    x2 = i * lineSpacing;
                    y2 = 0;
                    break;
                case "down":
                    x1 = i * lineSpacing;
                    y1 = 0;
                    x2 = i * lineSpacing;
                    y2 = size;
                    break;
            }
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Draw accelerator arrow
        ctx.fillStyle = "#ff00ff";
        ctx.globalAlpha = 0.8;
        
        const arrowSize = size * 0.1;
        let arrowX, arrowY;
        
        switch (direction) {
            case "right":
                arrowX = size * 0.8;
                arrowY = size / 2;
                break;
            case "left":
                arrowX = size * 0.2;
                arrowY = size / 2;
                break;
            case "up":
                arrowX = size / 2;
                arrowY = size * 0.2;
                break;
            case "down":
                arrowX = size / 2;
                arrowY = size * 0.8;
                break;
        }
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        
        switch (direction) {
            case "right":
                ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize);
                ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
                break;
            case "left":
                ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
                ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
                break;
            case "up":
                ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
                ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
                break;
            case "down":
                ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize);
                ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
                break;
        }
        
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw jump pad shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawJumpPadShape(ctx, size) {
        // Draw jump pad base
        ctx.fillStyle = "#0f3460";
        
        const baseRadius = size * 0.4;
        const baseX = size / 2;
        const baseY = size / 2;
        
        ctx.beginPath();
        ctx.arc(baseX, baseY, baseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw jump pad field
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ffff00";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.7;
        
        const fieldRadius = size * 0.3;
        
        ctx.beginPath();
        ctx.arc(baseX, baseY, fieldRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw jump pad energy
        ctx.fillStyle = "#ffff00";
        ctx.globalAlpha = 0.5;
        
        const energyCount = 6;
        
        for (let i = 0; i < energyCount; i++) {
            const angle = (i / energyCount) * Math.PI * 2;
            const energyRadius = fieldRadius * 0.7;
            const energyX = baseX + Math.cos(angle) * energyRadius;
            const energyY = baseY + Math.sin(angle) * energyRadius;
            const energySize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(energyX, energyY, energySize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw jump pad arrow
        ctx.fillStyle = "#ffff00";
        ctx.globalAlpha = 0.8;
        
        const arrowX = baseX;
        const arrowY = baseY - fieldRadius * 0.5;
        const arrowSize = size * 0.1;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
        ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw gravity shifter shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawGravityShifterShape(ctx, size) {
        // Draw gravity shifter base
        ctx.fillStyle = "#0f3460";
        
        const baseRadius = size * 0.4;
        const baseX = size / 2;
        const baseY = size / 2;
        
        ctx.beginPath();
        ctx.arc(baseX, baseY, baseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw gravity shifter field
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.7;
        
        const fieldRadius = size * 0.3;
        
        ctx.beginPath();
        ctx.arc(baseX, baseY, fieldRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw gravity shifter symbol
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        
        // Draw up arrow
        ctx.beginPath();
        ctx.moveTo(baseX, baseY - fieldRadius * 0.7);
        ctx.lineTo(baseX - fieldRadius * 0.3, baseY - fieldRadius * 0.3);
        ctx.lineTo(baseX + fieldRadius * 0.3, baseY - fieldRadius * 0.3);
        ctx.closePath();
        ctx.stroke();
        
        // Draw down arrow
        ctx.beginPath();
        ctx.moveTo(baseX, baseY + fieldRadius * 0.7);
        ctx.lineTo(baseX - fieldRadius * 0.3, baseY + fieldRadius * 0.3);
        ctx.lineTo(baseX + fieldRadius * 0.3, baseY + fieldRadius * 0.3);
        ctx.closePath();
        ctx.stroke();
        
        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(baseX - fieldRadius * 0.7, baseY);
        ctx.lineTo(baseX + fieldRadius * 0.7, baseY);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw floor wall transition shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} direction - Transition direction
     */
    drawFloorWallShape(ctx, size, direction) {
        // Draw floor
        ctx.fillStyle = "#1a1a2e";
        
        switch (direction) {
            case "top":
                ctx.fillRect(0, size / 2, size, size / 2);
                break;
            case "right":
                ctx.fillRect(0, 0, size / 2, size);
                break;
            case "bottom":
                ctx.fillRect(0, 0, size, size / 2);
                break;
            case "left":
                ctx.fillRect(size / 2, 0, size / 2, size);
                break;
        }
        
        // Draw wall
        ctx.fillStyle = "#0f3460";
        
        switch (direction) {
            case "top":
                ctx.fillRect(0, 0, size, size / 2);
                break;
            case "right":
                ctx.fillRect(size / 2, 0, size / 2, size);
                break;
            case "bottom":
                ctx.fillRect(0, size / 2, size, size / 2);
                break;
            case "left":
                ctx.fillRect(0, 0, size / 2, size);
                break;
        }
        
        // Draw transition line
        ctx.strokeStyle = "#16213e";
        ctx.lineWidth = 1;
        
        switch (direction) {
            case "top":
                ctx.beginPath();
                ctx.moveTo(0, size / 2);
                ctx.lineTo(size, size / 2);
                ctx.stroke();
                break;
            case "right":
                ctx.beginPath();
                ctx.moveTo(size / 2, 0);
                ctx.lineTo(size / 2, size);
                ctx.stroke();
                break;
            case "bottom":
                ctx.beginPath();
                ctx.moveTo(0, size / 2);
                ctx.lineTo(size, size / 2);
                ctx.stroke();
                break;
            case "left":
                ctx.beginPath();
                ctx.moveTo(size / 2, 0);
                ctx.lineTo(size / 2, size);
                ctx.stroke();
                break;
        }
    }
    
    /**
     * Draw text
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} text - Text to draw
     * @param {string} color - Text color
     */
    drawText(ctx, size, text, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.font = `${size * 0.2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText(text, size / 2, size / 2);
        
        ctx.globalAlpha = 1;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberpunkTileset;
}