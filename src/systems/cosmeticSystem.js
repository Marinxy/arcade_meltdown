/**
 * Arcade Meltdown - Cosmetic System
 * Manages cosmetic unlocks and customization
 */

class CosmeticSystem {
    /**
     * Create a new cosmetic system
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Cosmetic categories
        this.categories = {
            player_skins: {
                name: "Player Skins",
                description: "Customize your player appearance",
                items: {}
            },
            weapon_skins: {
                name: "Weapon Skins",
                description: "Customize your weapon appearance",
                items: {}
            },
            player_effects: {
                name: "Player Effects",
                description: "Special effects for your player",
                items: {}
            },
            kill_effects: {
                name: "Kill Effects",
                description: "Special effects when defeating enemies",
                items: {}
            },
            emotes: {
                name: "Emotes",
                description: "Express yourself with emotes",
                items: {}
            },
            icons: {
                name: "Icons",
                description: "Custom icons for your profile",
                items: {}
            }
        };
        
        // Unlocked cosmetics
        this.unlockedCosmetics = new Set();
        
        // Equipped cosmetics
        this.equippedCosmetics = {
            player_skins: null,
            weapon_skins: {},
            player_effects: null,
            kill_effects: null,
            emotes: {},
            icons: null
        };
        
        // Unlock progress
        this.unlockProgress = {};
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the cosmetic system
     */
    init() {
        // Register cosmetics
        this.registerCosmetics();
        
        // Load saved data
        this.loadCosmeticData();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Register all available cosmetics
     */
    registerCosmetics() {
        // Player skins
        this.registerCosmetic('player_skins', 'default', {
            name: "Default",
            description: "Standard player appearance",
            rarity: "common",
            icon: "assets/cosmetics/player_skins/default.png",
            unlockMethod: "default",
            unlocked: true
        });
        
        this.registerCosmetic('player_skins', 'neon', {
            name: "Neon",
            description: "Glowing neon appearance",
            rarity: "rare",
            icon: "assets/cosmetics/player_skins/neon.png",
            unlockMethod: "score",
            unlockValue: 10000,
            unlocked: false
        });
        
        this.registerCosmetic('player_skins', 'cyber', {
            name: "Cyber",
            description: "Cybernetic enhancements",
            rarity: "epic",
            icon: "assets/cosmetics/player_skins/cyber.png",
            unlockMethod: "achievement",
            unlockValue: "survivor",
            unlocked: false
        });
        
        this.registerCosmetic('player_skins', 'retro', {
            name: "Retro",
            description: "Classic 8-bit style",
            rarity: "legendary",
            icon: "assets/cosmetics/player_skins/retro.png",
            unlockMethod: "challenge",
            unlockValue: "complete_game_no_death",
            unlocked: false
        });
        
        // Weapon skins
        this.registerCosmetic('weapon_skins', 'pistol_gold', {
            name: "Golden Pistol",
            description: "Luxurious golden finish",
            rarity: "rare",
            icon: "assets/cosmetics/weapon_skins/pistol_gold.png",
            unlockMethod: "weapon_mastery",
            unlockValue: "pistol_500_kills",
            unlocked: false,
            weaponType: "pistol"
        });
        
        this.registerCosmetic('weapon_skins', 'rifle_digital', {
            name: "Digital Rifle",
            description: "Futuristic digital camo",
            rarity: "epic",
            icon: "assets/cosmetics/weapon_skins/rifle_digital.png",
            unlockMethod: "weapon_mastery",
            unlockValue: "rifle_1000_kills",
            unlocked: false,
            weaponType: "rifle"
        });
        
        this.registerCosmetic('weapon_skins', 'shotgun_rust', {
            name: "Rusted Shotgun",
            description: "Weathered and worn look",
            rarity: "common",
            icon: "assets/cosmetics/weapon_skins/shotgun_rust.png",
            unlockMethod: "weapon_mastery",
            unlockValue: "shotgun_100_kills",
            unlocked: false,
            weaponType: "shotgun"
        });
        
        // Player effects
        this.registerCosmetic('player_effects', 'trail', {
            name: "Motion Trail",
            description: "Leaves a trail when moving",
            rarity: "rare",
            icon: "assets/cosmetics/player_effects/trail.png",
            unlockMethod: "score",
            unlockValue: 25000,
            unlocked: false
        });
        
        this.registerCosmetic('player_effects', 'glow', {
            name: "Aura Glow",
            description: "Surrounding glow effect",
            rarity: "epic",
            icon: "assets/cosmetics/player_effects/glow.png",
            unlockMethod: "achievement",
            unlockValue: "team_player",
            unlocked: false
        });
        
        // Kill effects
        this.registerCosmetic('kill_effects', 'explosion', {
            name: "Explosion",
            description: "Enemies explode on death",
            rarity: "rare",
            icon: "assets/cosmetics/kill_effects/explosion.png",
            unlockMethod: "weapon_mastery",
            unlockValue: "any_weapon_2000_kills",
            unlocked: false
        });
        
        this.registerCosmetic('kill_effects', 'pixelate', {
            name: "Pixelate",
            description: "Enemies pixelate on death",
            rarity: "epic",
            icon: "assets/cosmetics/kill_effects/pixelate.png",
            unlockMethod: "achievement",
            unlockValue: "retro_gamer",
            unlocked: false
        });
        
        // Emotes
        this.registerCosmetic('emotes', 'wave', {
            name: "Wave",
            description: "Friendly wave",
            rarity: "common",
            icon: "assets/cosmetics/emotes/wave.png",
            unlockMethod: "default",
            unlocked: true
        });
        
        this.registerCosmetic('emotes', 'dance', {
            name: "Dance",
            description: "Show off your moves",
            rarity: "rare",
            icon: "assets/cosmetics/emotes/dance.png",
            unlockMethod: "score",
            unlockValue: 5000,
            unlocked: false
        });
        
        this.registerCosmetic('emotes', 'victory', {
            name: "Victory",
            description: "Celebrate your win",
            rarity: "epic",
            icon: "assets/cosmetics/emotes/victory.png",
            unlockMethod: "achievement",
            unlockValue: "champion",
            unlocked: false
        });
        
        // Icons
        this.registerCosmetic('icons', 'default', {
            name: "Default",
            description: "Standard icon",
            rarity: "common",
            icon: "assets/cosmetics/icons/default.png",
            unlockMethod: "default",
            unlocked: true
        });
        
        this.registerCosmetic('icons', 'star', {
            name: "Star",
            description: "Shining star icon",
            rarity: "rare",
            icon: "assets/cosmetics/icons/star.png",
            unlockMethod: "achievement",
            unlockValue: "high_scorer",
            unlocked: false
        });
        
        this.registerCosmetic('icons', 'crown', {
            name: "Crown",
            description: "Royal crown icon",
            rarity: "legendary",
            icon: "assets/cosmetics/icons/crown.png",
            unlockMethod: "challenge",
            unlockValue: "beat_boss_solo",
            unlocked: false
        });
    }
    
    /**
     * Register a cosmetic item
     * @param {string} category - Cosmetic category
     * @param {string} id - Cosmetic ID
     * @param {object} data - Cosmetic data
     */
    registerCosmetic(category, id, data) {
        if (!this.categories[category]) {
            console.warn(`Unknown cosmetic category: ${category}`);
            return;
        }
        
        this.categories[category].items[id] = {
            id: id,
            category: category,
            ...data
        };
        
        // Initialize unlock progress
        if (!this.unlockProgress[id]) {
            this.unlockProgress[id] = 0;
        }
        
        // Auto-unlock if it's a default item
        if (data.unlocked && data.unlockMethod === 'default') {
            this.unlockCosmetic(id);
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        window.eventSystem.on('game:over', (gameEngine) => {
            this.onGameOver(gameEngine);
        });
        
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
        });
        
        window.eventSystem.on('achievement:unlocked', (achievementId) => {
            this.onAchievementUnlocked(achievementId);
        });
        
        window.eventSystem.on('cosmetic:unlock', (cosmeticId) => {
            this.onCosmeticUnlock(cosmeticId);
        });
        
        window.eventSystem.on('cosmetic:equip', (category, cosmeticId) => {
            this.onCosmeticEquip(category, cosmeticId);
        });
        
        window.eventSystem.on('cosmetic:unequip', (category) => {
            this.onCosmeticUnequip(category);
        });
    }
    
    /**
     * Load cosmetic data from local storage
     */
    loadCosmeticData() {
        try {
            // Load unlocked cosmetics
            const savedUnlocked = localStorage.getItem('arcademeltdown_cosmetics_unlocked');
            if (savedUnlocked) {
                const unlocked = JSON.parse(savedUnlocked);
                for (const cosmeticId of unlocked) {
                    this.unlockedCosmetics.add(cosmeticId);
                }
            }
            
            // Load equipped cosmetics
            const savedEquipped = localStorage.getItem('arcademeltdown_cosmetics_equipped');
            if (savedEquipped) {
                this.equippedCosmetics = JSON.parse(savedEquipped);
            }
            
            // Load unlock progress
            const savedProgress = localStorage.getItem('arcademeltdown_cosmetics_progress');
            if (savedProgress) {
                this.unlockProgress = JSON.parse(savedProgress);
            }
        } catch (error) {
            console.error('Failed to load cosmetic data:', error);
        }
    }
    
    /**
     * Save cosmetic data to local storage
     */
    saveCosmeticData() {
        try {
            // Save unlocked cosmetics
            localStorage.setItem('arcademeltdown_cosmetics_unlocked', 
                JSON.stringify(Array.from(this.unlockedCosmetics)));
            
            // Save equipped cosmetics
            localStorage.setItem('arcademeltdown_cosmetics_equipped', 
                JSON.stringify(this.equippedCosmetics));
            
            // Save unlock progress
            localStorage.setItem('arcademeltdown_cosmetics_progress', 
                JSON.stringify(this.unlockProgress));
        } catch (error) {
            console.error('Failed to save cosmetic data:', error);
        }
    }
    
    /**
     * Check if a cosmetic is unlocked
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {boolean} Whether the cosmetic is unlocked
     */
    isUnlocked(cosmeticId) {
        return this.unlockedCosmetics.has(cosmeticId);
    }
    
    /**
     * Unlock a cosmetic
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {boolean} Whether the cosmetic was unlocked
     */
    unlockCosmetic(cosmeticId) {
        if (this.isUnlocked(cosmeticId)) {
            return false;
        }
        
        this.unlockedCosmetics.add(cosmeticId);
        this.saveCosmeticData();
        
        // Emit unlock event
        window.eventSystem.emit('cosmetic:unlocked', cosmeticId);
        
        return true;
    }
    
    /**
     * Equip a cosmetic
     * @param {string} category - Cosmetic category
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {boolean} Whether the cosmetic was equipped
     */
    equipCosmetic(category, cosmeticId) {
        if (!this.categories[category]) {
            console.warn(`Unknown cosmetic category: ${category}`);
            return false;
        }
        
        if (!this.isUnlocked(cosmeticId)) {
            console.warn(`Cosmetic not unlocked: ${cosmeticId}`);
            return false;
        }
        
        // For weapon skins and emotes, allow multiple equipped items
        if (category === 'weapon_skins' || category === 'emotes') {
            if (!this.equippedCosmetics[category]) {
                this.equippedCosmetics[category] = {};
            }
            
            // Get weapon type if applicable
            const cosmetic = this.categories[category].items[cosmeticId];
            if (cosmetic && cosmetic.weaponType) {
                this.equippedCosmetics[category][cosmetic.weaponType] = cosmeticId;
            } else {
                this.equippedCosmetics[category][cosmeticId] = true;
            }
        } else {
            // For other categories, only one item can be equipped
            this.equippedCosmetics[category] = cosmeticId;
        }
        
        this.saveCosmeticData();
        
        // Emit equip event
        window.eventSystem.emit('cosmetic:equipped', category, cosmeticId);
        
        return true;
    }
    
    /**
     * Unequip a cosmetic
     * @param {string} category - Cosmetic category
     * @param {string} [cosmeticId] - Cosmetic ID (optional for weapon skins and emotes)
     * @returns {boolean} Whether the cosmetic was unequipped
     */
    unequipCosmetic(category, cosmeticId) {
        if (!this.categories[category]) {
            console.warn(`Unknown cosmetic category: ${category}`);
            return false;
        }
        
        if (category === 'weapon_skins' || category === 'emotes') {
            if (cosmeticId) {
                // Unequip specific item
                if (this.equippedCosmetics[category] && this.equippedCosmetics[category][cosmeticId]) {
                    delete this.equippedCosmetics[category][cosmeticId];
                }
            } else {
                // Unequip all items in category
                this.equippedCosmetics[category] = {};
            }
        } else {
            // Unequip single item
            this.equippedCosmetics[category] = null;
        }
        
        this.saveCosmeticData();
        
        // Emit unequip event
        window.eventSystem.emit('cosmetic:unequipped', category, cosmeticId);
        
        return true;
    }
    
    /**
     * Get equipped cosmetic in a category
     * @param {string} category - Cosmetic category
     * @param {string} [subCategory] - Sub-category (for weapon skins and emotes)
     * @returns {string|null} Equipped cosmetic ID or null
     */
    getEquippedCosmetic(category, subCategory) {
        if (!this.equippedCosmetics[category]) {
            return null;
        }
        
        if (subCategory && (category === 'weapon_skins' || category === 'emotes')) {
            return this.equippedCosmetics[category][subCategory] || null;
        }
        
        return this.equippedCosmetics[category];
    }
    
    /**
     * Get all cosmetics in a category
     * @param {string} category - Cosmetic category
     * @returns {object} Cosmetics in the category
     */
    getCosmeticsByCategory(category) {
        return this.categories[category] || null;
    }
    
    /**
     * Get cosmetic data
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {object|null} Cosmetic data or null if not found
     */
    getCosmetic(cosmeticId) {
        for (const category of Object.values(this.categories)) {
            if (category.items[cosmeticId]) {
                return category.items[cosmeticId];
            }
        }
        return null;
    }
    
    /**
     * Check unlock progress for a cosmetic
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {number} Unlock progress (0-1)
     */
    getUnlockProgress(cosmeticId) {
        const cosmetic = this.getCosmetic(cosmeticId);
        if (!cosmetic) {
            return 0;
        }
        
        if (this.isUnlocked(cosmeticId)) {
            return 1;
        }
        
        const progress = this.unlockProgress[cosmeticId] || 0;
        const required = cosmetic.unlockValue || 1;
        
        return Math.min(1, progress / required);
    }
    
    /**
     * Update unlock progress for a cosmetic
     * @param {string} cosmeticId - Cosmetic ID
     * @param {number} amount - Progress amount
     * @returns {boolean} Whether the cosmetic was unlocked
     */
    updateUnlockProgress(cosmeticId, amount) {
        if (this.isUnlocked(cosmeticId)) {
            return false;
        }
        
        const cosmetic = this.getCosmetic(cosmeticId);
        if (!cosmetic) {
            return false;
        }
        
        // Update progress
        if (!this.unlockProgress[cosmeticId]) {
            this.unlockProgress[cosmeticId] = 0;
        }
        
        this.unlockProgress[cosmeticId] += amount;
        
        // Check if unlocked
        const required = cosmetic.unlockValue || 1;
        if (this.unlockProgress[cosmeticId] >= required) {
            return this.unlockCosmetic(cosmeticId);
        }
        
        // Save progress
        this.saveCosmeticData();
        
        // Emit progress event
        window.eventSystem.emit('cosmetic:progress', cosmeticId, this.getUnlockProgress(cosmeticId));
        
        return false;
    }
    
    /**
     * Handle game start
     * @param {GameEngine} gameEngine - Game engine instance
     */
    onGameStart(gameEngine) {
        // Nothing specific to do here
    }
    
    /**
     * Handle game over
     * @param {GameEngine} gameEngine - Game engine instance
     */
    onGameOver(gameEngine) {
        // Check for score-based unlocks
        const score = gameEngine.score;
        
        for (const category of Object.values(this.categories)) {
            for (const cosmetic of Object.values(category.items)) {
                if (cosmetic.unlockMethod === 'score' && !this.isUnlocked(cosmetic.id)) {
                    this.updateUnlockProgress(cosmetic.id, score);
                }
            }
        }
    }
    
    /**
     * Handle player death
     * @param {Player} player - Player that died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Nothing specific to do here
    }
    
    /**
     * Handle enemy death
     * @param {Enemy} enemy - Enemy that died
     * @param {Entity} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Check for weapon mastery unlocks
        if (source && source.hasTag && source.hasTag('player')) {
            const weaponComponent = source.getComponent('Weapon');
            if (weaponComponent && weaponComponent.weapon) {
                const weaponType = weaponComponent.weapon.type;
                
                for (const category of Object.values(this.categories)) {
                    for (const cosmetic of Object.values(category.items)) {
                        if (cosmetic.unlockMethod === 'weapon_mastery' && 
                            cosmetic.weaponType === weaponType && 
                            !this.isUnlocked(cosmetic.id)) {
                            this.updateUnlockProgress(cosmetic.id, 1);
                        }
                    }
                }
            }
        }
        
        // Check for kill count unlocks
        for (const category of Object.values(this.categories)) {
            for (const cosmetic of Object.values(category.items)) {
                if (cosmetic.unlockMethod === 'weapon_mastery' && 
                    cosmetic.weaponType === 'any_weapon' && 
                    !this.isUnlocked(cosmetic.id)) {
                    this.updateUnlockProgress(cosmetic.id, 1);
                }
            }
        }
    }
    
    /**
     * Handle wave complete
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Check for wave-based unlocks
        for (const category of Object.values(this.categories)) {
            for (const cosmetic of Object.values(category.items)) {
                if (cosmetic.unlockMethod === 'waves' && !this.isUnlocked(cosmetic.id)) {
                    this.updateUnlockProgress(cosmetic.id, 1);
                }
            }
        }
    }
    
    /**
     * Handle achievement unlocked
     * @param {string} achievementId - Achievement ID
     */
    onAchievementUnlocked(achievementId) {
        // Check for achievement-based unlocks
        for (const category of Object.values(this.categories)) {
            for (const cosmetic of Object.values(category.items)) {
                if (cosmetic.unlockMethod === 'achievement' && 
                    cosmetic.unlockValue === achievementId && 
                    !this.isUnlocked(cosmetic.id)) {
                    this.unlockCosmetic(cosmetic.id);
                }
            }
        }
    }
    
    /**
     * Handle cosmetic unlock
     * @param {string} cosmeticId - Cosmetic ID
     */
    onCosmeticUnlock(cosmeticId) {
        const cosmetic = this.getCosmetic(cosmeticId);
        if (!cosmetic) {
            return;
        }
        
        console.log(`Cosmetic unlocked: ${cosmetic.name} (${cosmetic.rarity})`);
    }
    
    /**
     * Handle cosmetic equip
     * @param {string} category - Cosmetic category
     * @param {string} cosmeticId - Cosmetic ID
     */
    onCosmeticEquip(category, cosmeticId) {
        const cosmetic = this.getCosmetic(cosmeticId);
        if (!cosmetic) {
            return;
        }
        
        console.log(`Cosmetic equipped: ${cosmetic.name} in ${category}`);
    }
    
    /**
     * Handle cosmetic unequip
     * @param {string} category - Cosmetic category
     * @param {string} cosmeticId - Cosmetic ID
     */
    onCosmeticUnequip(category, cosmeticId) {
        console.log(`Cosmetic unequipped from ${category}`);
    }
    
    /**
     * Update the cosmetic system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the cosmetic system
     */
    destroy() {
        // Save data before destroying
        this.saveCosmeticData();
    }
}

// Export for use in modules
export default CosmeticSystem;