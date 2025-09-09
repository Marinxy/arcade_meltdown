/**
 * Arcade Meltdown - Cosmetic UI
 * User interface for the cosmetic system
 */

class CosmeticUI {
    /**
     * Create a new cosmetic UI
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.cosmeticSystem = null;
        this.visible = false;
        this.currentCategory = 'player_skins';
        this.selectedCosmetic = null;
        
        // DOM elements
        this.container = null;
        this.categoryTabs = null;
        this.cosmeticGrid = null;
        this.cosmeticDetails = null;
        this.unlockProgress = null;
        this.equipButton = null;
        this.unequipButton = null;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the cosmetic UI
     */
    init() {
        // Get cosmetic system
        this.cosmeticSystem = this.gameEngine.getSystem('cosmeticSystem');
        
        if (!this.cosmeticSystem) {
            console.error('Cosmetic system not found');
            return;
        }
        
        // Create UI elements
        this.createUI();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Create UI elements
     */
    createUI() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'cosmetic-ui';
        this.container.className = 'cosmetic-ui hidden';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'cosmetic-ui-header';
        
        const title = document.createElement('h2');
        title.textContent = 'Cosmetics';
        header.appendChild(title);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'cosmetic-ui-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.hide());
        header.appendChild(closeButton);
        
        this.container.appendChild(header);
        
        // Create category tabs
        this.categoryTabs = document.createElement('div');
        this.categoryTabs.className = 'cosmetic-ui-tabs';
        
        for (const [categoryId, category] of Object.entries(this.cosmeticSystem.categories)) {
            const tab = document.createElement('button');
            tab.className = 'cosmetic-ui-tab';
            tab.textContent = category.name;
            tab.dataset.category = categoryId;
            
            if (categoryId === this.currentCategory) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => this.selectCategory(categoryId));
            this.categoryTabs.appendChild(tab);
        }
        
        this.container.appendChild(this.categoryTabs);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'cosmetic-ui-content';
        
        // Create cosmetic grid
        this.cosmeticGrid = document.createElement('div');
        this.cosmeticGrid.className = 'cosmetic-ui-grid';
        content.appendChild(this.cosmeticGrid);
        
        // Create cosmetic details
        this.cosmeticDetails = document.createElement('div');
        this.cosmeticDetails.className = 'cosmetic-ui-details hidden';
        
        const detailsName = document.createElement('h3');
        detailsName.className = 'cosmetic-ui-details-name';
        this.cosmeticDetails.appendChild(detailsName);
        
        const detailsRarity = document.createElement('div');
        detailsRarity.className = 'cosmetic-ui-details-rarity';
        this.cosmeticDetails.appendChild(detailsRarity);
        
        const detailsDescription = document.createElement('p');
        detailsDescription.className = 'cosmetic-ui-details-description';
        this.cosmeticDetails.appendChild(detailsDescription);
        
        const detailsUnlock = document.createElement('div');
        detailsUnlock.className = 'cosmetic-ui-details-unlock';
        this.cosmeticDetails.appendChild(detailsUnlock);
        
        // Create unlock progress
        this.unlockProgress = document.createElement('div');
        this.unlockProgress.className = 'cosmetic-ui-unlock-progress hidden';
        
        const progressLabel = document.createElement('div');
        progressLabel.className = 'cosmetic-ui-progress-label';
        progressLabel.textContent = 'Unlock Progress';
        this.unlockProgress.appendChild(progressLabel);
        
        const progressBar = document.createElement('div');
        progressBar.className = 'cosmetic-ui-progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'cosmetic-ui-progress-fill';
        progressBar.appendChild(progressFill);
        
        this.unlockProgress.appendChild(progressBar);
        
        const progressText = document.createElement('div');
        progressText.className = 'cosmetic-ui-progress-text';
        this.unlockProgress.appendChild(progressText);
        
        detailsUnlock.appendChild(this.unlockProgress);
        
        // Create buttons
        const buttons = document.createElement('div');
        buttons.className = 'cosmetic-ui-buttons';
        
        this.equipButton = document.createElement('button');
        this.equipButton.className = 'cosmetic-ui-equip button';
        this.equipButton.textContent = 'Equip';
        this.equipButton.addEventListener('click', () => this.equipSelectedCosmetic());
        buttons.appendChild(this.equipButton);
        
        this.unequipButton = document.createElement('button');
        this.unequipButton.className = 'cosmetic-ui-unequip button hidden';
        this.unequipButton.textContent = 'Unequip';
        this.unequipButton.addEventListener('click', () => this.unequipSelectedCosmetic());
        buttons.appendChild(this.unequipButton);
        
        this.cosmeticDetails.appendChild(buttons);
        content.appendChild(this.cosmeticDetails);
        
        this.container.appendChild(content);
        
        // Add to document
        document.body.appendChild(this.container);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for cosmetic events
        window.eventSystem.on('cosmetic:unlocked', (cosmeticId) => {
            this.onCosmeticUnlocked(cosmeticId);
        });
        
        window.eventSystem.on('cosmetic:equipped', (category, cosmeticId) => {
            this.onCosmeticEquipped(category, cosmeticId);
        });
        
        window.eventSystem.on('cosmetic:unequipped', (category, cosmeticId) => {
            this.onCosmeticUnequipped(category, cosmeticId);
        });
        
        // Listen for key events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.visible) {
                this.hide();
            }
        });
    }
    
    /**
     * Show the cosmetic UI
     */
    show() {
        this.visible = true;
        this.container.classList.remove('hidden');
        
        // Refresh the current category
        this.selectCategory(this.currentCategory);
    }
    
    /**
     * Hide the cosmetic UI
     */
    hide() {
        this.visible = false;
        this.container.classList.add('hidden');
    }
    
    /**
     * Select a category
     * @param {string} categoryId - Category ID
     */
    selectCategory(categoryId) {
        this.currentCategory = categoryId;
        this.selectedCosmetic = null;
        
        // Update active tab
        for (const tab of this.categoryTabs.children) {
            if (tab.dataset.category === categoryId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        }
        
        // Hide details
        this.cosmeticDetails.classList.add('hidden');
        
        // Load cosmetics for category
        this.loadCosmetics(categoryId);
    }
    
    /**
     * Load cosmetics for a category
     * @param {string} categoryId - Category ID
     */
    loadCosmetics(categoryId) {
        // Clear grid
        this.cosmeticGrid.innerHTML = '';
        
        // Get category
        const category = this.cosmeticSystem.getCosmeticsByCategory(categoryId);
        if (!category) {
            return;
        }
        
        // Sort cosmetics by rarity and then by name
        const cosmetics = Object.values(category.items).sort((a, b) => {
            const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
            const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
            if (rarityDiff !== 0) return rarityDiff;
            return a.name.localeCompare(b.name);
        });
        
        // Create cosmetic items
        for (const cosmetic of cosmetics) {
            const item = this.createCosmeticItem(cosmetic);
            this.cosmeticGrid.appendChild(item);
        }
    }
    
    /**
     * Create a cosmetic item
     * @param {object} cosmetic - Cosmetic data
     * @returns {HTMLElement} Cosmetic item element
     */
    createCosmeticItem(cosmetic) {
        const item = document.createElement('div');
        item.className = 'cosmetic-ui-item';
        item.dataset.cosmeticId = cosmetic.id;
        
        // Add rarity class
        item.classList.add(`rarity-${cosmetic.rarity}`);
        
        // Add locked class if not unlocked
        const isUnlocked = this.cosmeticSystem.isUnlocked(cosmetic.id);
        if (!isUnlocked) {
            item.classList.add('locked');
        }
        
        // Add equipped class if equipped
        const isEquipped = this.cosmeticSystem.getEquippedCosmetic(cosmetic.category, cosmetic.weaponType) === cosmetic.id;
        if (isEquipped) {
            item.classList.add('equipped');
        }
        
        // Create icon
        const icon = document.createElement('div');
        icon.className = 'cosmetic-ui-item-icon';
        
        const iconImg = document.createElement('img');
        iconImg.src = cosmetic.icon;
        iconImg.alt = cosmetic.name;
        iconImg.onerror = () => {
            // Use placeholder if icon fails to load
            iconImg.src = 'assets/ui/placeholder.png';
        };
        icon.appendChild(iconImg);
        
        item.appendChild(icon);
        
        // Create lock overlay if locked
        if (!isUnlocked) {
            const lock = document.createElement('div');
            lock.className = 'cosmetic-ui-item-lock';
            lock.textContent = '🔒';
            item.appendChild(lock);
        }
        
        // Create equipped overlay if equipped
        if (isEquipped) {
            const equipped = document.createElement('div');
            equipped.className = 'cosmetic-ui-item-equipped';
            equipped.textContent = '✓';
            item.appendChild(equipped);
        }
        
        // Add click event
        item.addEventListener('click', () => this.selectCosmetic(cosmetic.id));
        
        return item;
    }
    
    /**
     * Select a cosmetic
     * @param {string} cosmeticId - Cosmetic ID
     */
    selectCosmetic(cosmeticId) {
        this.selectedCosmetic = cosmeticId;
        
        // Get cosmetic data
        const cosmetic = this.cosmeticSystem.getCosmetic(cosmeticId);
        if (!cosmetic) {
            return;
        }
        
        // Update details
        this.updateCosmeticDetails(cosmetic);
        
        // Show details
        this.cosmeticDetails.classList.remove('hidden');
        
        // Update selected state in grid
        for (const item of this.cosmeticGrid.children) {
            if (item.dataset.cosmeticId === cosmeticId) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        }
    }
    
    /**
     * Update cosmetic details
     * @param {object} cosmetic - Cosmetic data
     */
    updateCosmeticDetails(cosmetic) {
        // Update name
        const nameElement = this.cosmeticDetails.querySelector('.cosmetic-ui-details-name');
        nameElement.textContent = cosmetic.name;
        
        // Update rarity
        const rarityElement = this.cosmeticDetails.querySelector('.cosmetic-ui-details-rarity');
        rarityElement.textContent = cosmetic.rarity.charAt(0).toUpperCase() + cosmetic.rarity.slice(1);
        rarityElement.className = `cosmetic-ui-details-rarity rarity-${cosmetic.rarity}`;
        
        // Update description
        const descriptionElement = this.cosmeticDetails.querySelector('.cosmetic-ui-details-description');
        descriptionElement.textContent = cosmetic.description;
        
        // Check if unlocked
        const isUnlocked = this.cosmeticSystem.isUnlocked(cosmetic.id);
        
        if (isUnlocked) {
            // Hide unlock progress
            this.unlockProgress.classList.add('hidden');
            
            // Check if equipped
            const isEquipped = this.cosmeticSystem.getEquippedCosmetic(cosmetic.category, cosmetic.weaponType) === cosmetic.id;
            
            if (isEquipped) {
                // Show unequip button
                this.equipButton.classList.add('hidden');
                this.unequipButton.classList.remove('hidden');
            } else {
                // Show equip button
                this.equipButton.classList.remove('hidden');
                this.unequipButton.classList.add('hidden');
            }
        } else {
            // Show unlock progress
            this.unlockProgress.classList.remove('hidden');
            
            // Update progress bar
            const progress = this.cosmeticSystem.getUnlockProgress(cosmetic.id);
            const progressFill = this.unlockProgress.querySelector('.cosmetic-ui-progress-fill');
            progressFill.style.width = `${progress * 100}%`;
            
            // Update progress text
            const progressText = this.unlockProgress.querySelector('.cosmetic-ui-progress-text');
            
            switch (cosmetic.unlockMethod) {
                case 'score':
                    progressText.textContent = `${Math.floor(progress * (cosmetic.unlockValue || 1))} / ${cosmetic.unlockValue} points`;
                    break;
                case 'weapon_mastery':
                    if (cosmetic.weaponType === 'any_weapon') {
                        progressText.textContent = `${Math.floor(progress * (cosmetic.unlockValue || 1))} / ${cosmetic.unlockValue} total kills`;
                    } else {
                        progressText.textContent = `${Math.floor(progress * (cosmetic.unlockValue || 1))} / ${cosmetic.unlockValue} ${cosmetic.weaponType} kills`;
                    }
                    break;
                case 'waves':
                    progressText.textContent = `${Math.floor(progress * (cosmetic.unlockValue || 1))} / ${cosmetic.unlockValue} waves completed`;
                    break;
                default:
                    progressText.textContent = `${Math.floor(progress * 100)}%`;
                    break;
            }
            
            // Hide buttons
            this.equipButton.classList.add('hidden');
            this.unequipButton.classList.add('hidden');
        }
    }
    
    /**
     * Equip the selected cosmetic
     */
    equipSelectedCosmetic() {
        if (!this.selectedCosmetic) {
            return;
        }
        
        const cosmetic = this.cosmeticSystem.getCosmetic(this.selectedCosmetic);
        if (!cosmetic) {
            return;
        }
        
        // Equip cosmetic
        this.cosmeticSystem.equipCosmetic(cosmetic.category, this.selectedCosmetic);
        
        // Refresh UI
        this.selectCategory(this.currentCategory);
    }
    
    /**
     * Unequip the selected cosmetic
     */
    unequipSelectedCosmetic() {
        if (!this.selectedCosmetic) {
            return;
        }
        
        const cosmetic = this.cosmeticSystem.getCosmetic(this.selectedCosmetic);
        if (!cosmetic) {
            return;
        }
        
        // Unequip cosmetic
        this.cosmeticSystem.unequipCosmetic(cosmetic.category, cosmetic.weaponType);
        
        // Refresh UI
        this.selectCategory(this.currentCategory);
    }
    
    /**
     * Handle cosmetic unlocked
     * @param {string} cosmeticId - Cosmetic ID
     */
    onCosmeticUnlocked(cosmeticId) {
        // Show notification
        this.showUnlockNotification(cosmeticId);
        
        // Refresh UI if visible
        if (this.visible) {
            this.selectCategory(this.currentCategory);
        }
    }
    
    /**
     * Handle cosmetic equipped
     * @param {string} category - Cosmetic category
     * @param {string} cosmeticId - Cosmetic ID
     */
    onCosmeticEquipped(category, cosmeticId) {
        // Refresh UI if visible
        if (this.visible) {
            this.selectCategory(this.currentCategory);
        }
    }
    
    /**
     * Handle cosmetic unequipped
     * @param {string} category - Cosmetic category
     * @param {string} cosmeticId - Cosmetic ID
     */
    onCosmeticUnequipped(category, cosmeticId) {
        // Refresh UI if visible
        if (this.visible) {
            this.selectCategory(this.currentCategory);
        }
    }
    
    /**
     * Show unlock notification
     * @param {string} cosmeticId - Cosmetic ID
     */
    showUnlockNotification(cosmeticId) {
        const cosmetic = this.cosmeticSystem.getCosmetic(cosmeticId);
        if (!cosmetic) {
            return;
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cosmetic-unlock-notification';
        
        const icon = document.createElement('img');
        icon.src = cosmetic.icon;
        icon.alt = cosmetic.name;
        notification.appendChild(icon);
        
        const text = document.createElement('div');
        text.className = 'cosmetic-unlock-text';
        
        const title = document.createElement('div');
        title.className = 'cosmetic-unlock-title';
        title.textContent = 'Cosmetic Unlocked!';
        text.appendChild(title);
        
        const name = document.createElement('div');
        name.className = 'cosmetic-unlock-name';
        name.textContent = cosmetic.name;
        text.appendChild(name);
        
        notification.appendChild(text);
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    /**
     * Update the cosmetic UI
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the cosmetic UI
     */
    destroy() {
        // Remove from document
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmeticUI;
}