/**
 * Arcade Meltdown - Expansion Soundtrack UI
 * User interface for the expansion soundtrack system
 */

class ExpansionSoundtrackUI {
    /**
     * Create a new expansion soundtrack UI
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.soundtrackSystem = null;
        this.visible = false;
        
        // DOM elements
        this.container = null;
        this.packGrid = null;
        this.packDetails = null;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the expansion soundtrack UI
     */
    init() {
        // Get soundtrack system
        this.soundtrackSystem = this.gameEngine.getSystem('expansionSoundtrackSystem');
        
        if (!this.soundtrackSystem) {
            console.error('Expansion soundtrack system not found');
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
        this.container.id = 'expansion-soundtrack-ui';
        this.container.className = 'expansion-soundtrack-ui hidden';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'expansion-soundtrack-ui-header';
        
        const title = document.createElement('h2');
        title.textContent = 'Soundtrack Packs';
        header.appendChild(title);
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Expand your audio experience with additional music and sound effects';
        header.appendChild(subtitle);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'expansion-soundtrack-ui-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.hide());
        header.appendChild(closeButton);
        
        this.container.appendChild(header);
        
        // Create content
        const content = document.createElement('div');
        content.className = 'expansion-soundtrack-ui-content';
        
        // Create pack grid
        this.packGrid = document.createElement('div');
        this.packGrid.className = 'expansion-soundtrack-ui-grid';
        content.appendChild(this.packGrid);
        
        // Create pack details
        this.packDetails = document.createElement('div');
        this.packDetails.className = 'expansion-soundtrack-ui-details hidden';
        content.appendChild(this.packDetails);
        
        this.container.appendChild(content);
        
        // Add to document
        document.body.appendChild(this.container);
        
        // Load packs
        this.loadPacks();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for soundtrack events
        window.eventSystem.on('soundtrack:purchased', (packId) => {
            this.onPackPurchased(packId);
        });
        
        window.eventSystem.on('soundtrack:enabled', (packId) => {
            this.onPackEnabled(packId);
        });
        
        window.eventSystem.on('soundtrack:disabled', (packId) => {
            this.onPackDisabled(packId);
        });
        
        // Listen for key events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.visible) {
                this.hide();
            }
        });
    }
    
    /**
     * Show the expansion soundtrack UI
     */
    show() {
        this.visible = true;
        this.container.classList.remove('hidden');
        
        // Refresh packs
        this.loadPacks();
    }
    
    /**
     * Hide the expansion soundtrack UI
     */
    hide() {
        this.visible = false;
        this.container.classList.add('hidden');
    }
    
    /**
     * Load packs into the grid
     */
    loadPacks() {
        // Clear grid
        this.packGrid.innerHTML = '';
        
        // Get all packs
        const packs = this.soundtrackSystem.getAllPacks();
        
        // Create pack items
        for (const [packId, pack] of Object.entries(packs)) {
            const item = this.createPackItem(packId, pack);
            this.packGrid.appendChild(item);
        }
    }
    
    /**
     * Create a pack item
     * @param {string} packId - Pack ID
     * @param {object} pack - Pack data
     * @returns {HTMLElement} Pack item element
     */
    createPackItem(packId, pack) {
        const item = document.createElement('div');
        item.className = 'expansion-soundtrack-ui-item';
        item.dataset.packId = packId;
        
        // Add purchased class if purchased
        if (pack.purchased) {
            item.classList.add('purchased');
        }
        
        // Add enabled class if enabled
        if (pack.enabled) {
            item.classList.add('enabled');
        }
        
        // Create icon
        const icon = document.createElement('div');
        icon.className = 'expansion-soundtrack-ui-item-icon';
        
        const iconImg = document.createElement('img');
        iconImg.src = `assets/ui/soundtrack/${packId}.png`;
        iconImg.alt = pack.name;
        iconImg.onerror = () => {
            // Use placeholder if icon fails to load
            iconImg.src = 'assets/ui/placeholder.png';
        };
        icon.appendChild(iconImg);
        
        item.appendChild(icon);
        
        // Create info
        const info = document.createElement('div');
        info.className = 'expansion-soundtrack-ui-item-info';
        
        const name = document.createElement('h3');
        name.textContent = pack.name;
        info.appendChild(name);
        
        const description = document.createElement('p');
        description.textContent = pack.description;
        info.appendChild(description);
        
        const price = document.createElement('div');
        price.className = 'expansion-soundtrack-ui-item-price';
        price.textContent = pack.purchased ? 'Purchased' : `$${(pack.price / 100).toFixed(2)}`;
        info.appendChild(price);
        
        item.appendChild(info);
        
        // Create status
        const status = document.createElement('div');
        status.className = 'expansion-soundtrack-ui-item-status';
        
        if (pack.enabled) {
            status.textContent = 'Enabled';
            status.classList.add('enabled');
        } else if (pack.purchased) {
            status.textContent = 'Purchased';
            status.classList.add('purchased');
        } else {
            status.textContent = 'Not Purchased';
            status.classList.add('not-purchased');
        }
        
        item.appendChild(status);
        
        // Create buttons
        const buttons = document.createElement('div');
        buttons.className = 'expansion-soundtrack-ui-item-buttons';
        
        if (pack.purchased) {
            if (pack.enabled) {
                const disableButton = document.createElement('button');
                disableButton.className = 'expansion-soundtrack-ui-button disable';
                disableButton.textContent = 'Disable';
                disableButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.disablePack(packId);
                });
                buttons.appendChild(disableButton);
            } else {
                const enableButton = document.createElement('button');
                enableButton.className = 'expansion-soundtrack-ui-button enable';
                enableButton.textContent = 'Enable';
                enableButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enablePack(packId);
                });
                buttons.appendChild(enableButton);
            }
        } else {
            const purchaseButton = document.createElement('button');
            purchaseButton.className = 'expansion-soundtrack-ui-button purchase';
            purchaseButton.textContent = 'Purchase';
            purchaseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.purchasePack(packId);
            });
            buttons.appendChild(purchaseButton);
        }
        
        const detailsButton = document.createElement('button');
        detailsButton.className = 'expansion-soundtrack-ui-button details';
        detailsButton.textContent = 'Details';
        detailsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPackDetails(packId);
        });
        buttons.appendChild(detailsButton);
        
        item.appendChild(buttons);
        
        // Add click event
        item.addEventListener('click', () => this.showPackDetails(packId));
        
        return item;
    }
    
    /**
     * Show pack details
     * @param {string} packId - Pack ID
     */
    showPackDetails(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack) {
            return;
        }
        
        // Hide grid
        this.packGrid.classList.add('hidden');
        
        // Show details
        this.packDetails.classList.remove('hidden');
        this.packDetails.innerHTML = '';
        
        // Create back button
        const backButton = document.createElement('button');
        backButton.className = 'expansion-soundtrack-ui-back';
        backButton.textContent = '← Back to Packs';
        backButton.addEventListener('click', () => {
            this.packDetails.classList.add('hidden');
            this.packGrid.classList.remove('hidden');
        });
        this.packDetails.appendChild(backButton);
        
        // Create header
        const header = document.createElement('div');
        header.className = 'expansion-soundtrack-ui-details-header';
        
        const icon = document.createElement('div');
        icon.className = 'expansion-soundtrack-ui-details-icon';
        
        const iconImg = document.createElement('img');
        iconImg.src = `assets/ui/soundtrack/${packId}.png`;
        iconImg.alt = pack.name;
        iconImg.onerror = () => {
            // Use placeholder if icon fails to load
            iconImg.src = 'assets/ui/placeholder.png';
        };
        icon.appendChild(iconImg);
        
        const info = document.createElement('div');
        info.className = 'expansion-soundtrack-ui-details-info';
        
        const name = document.createElement('h2');
        name.textContent = pack.name;
        info.appendChild(name);
        
        const description = document.createElement('p');
        description.textContent = pack.description;
        info.appendChild(description);
        
        const price = document.createElement('div');
        price.className = 'expansion-soundtrack-ui-details-price';
        price.textContent = pack.purchased ? 'Purchased' : `$${(pack.price / 100).toFixed(2)}`;
        info.appendChild(price);
        
        header.appendChild(icon);
        header.appendChild(info);
        this.packDetails.appendChild(header);
        
        // Create tracks list
        const tracksContainer = document.createElement('div');
        tracksContainer.className = 'expansion-soundtrack-ui-details-tracks';
        
        const tracksTitle = document.createElement('h3');
        tracksTitle.textContent = 'Tracks';
        tracksContainer.appendChild(tracksTitle);
        
        const tracksList = document.createElement('div');
        tracksList.className = 'expansion-soundtrack-ui-tracks-list';
        
        for (const track of pack.tracks) {
            const trackItem = document.createElement('div');
            trackItem.className = 'expansion-soundtrack-ui-track-item';
            
            const trackName = document.createElement('div');
            trackName.className = 'expansion-soundtrack-ui-track-name';
            trackName.textContent = track.name;
            trackItem.appendChild(trackName);
            
            const trackType = document.createElement('div');
            trackType.className = 'expansion-soundtrack-ui-track-type';
            trackType.textContent = track.type === 'music' ? 'Music' : 'Sound Effect';
            trackItem.appendChild(trackType);
            
            const trackControls = document.createElement('div');
            trackControls.className = 'expansion-soundtrack-ui-track-controls';
            
            if (pack.purchased && pack.enabled) {
                const playButton = document.createElement('button');
                playButton.className = 'expansion-soundtrack-ui-track-play';
                playButton.textContent = '▶';
                playButton.addEventListener('click', () => {
                    this.playTrackPreview(packId, track.id, playButton);
                });
                trackControls.appendChild(playButton);
            } else {
                const lockedIcon = document.createElement('div');
                lockedIcon.className = 'expansion-soundtrack-ui-track-locked';
                lockedIcon.textContent = '🔒';
                trackControls.appendChild(lockedIcon);
            }
            
            trackItem.appendChild(trackControls);
            tracksList.appendChild(trackItem);
        }
        
        tracksContainer.appendChild(tracksList);
        this.packDetails.appendChild(tracksContainer);
        
        // Create action buttons
        const actions = document.createElement('div');
        actions.className = 'expansion-soundtrack-ui-details-actions';
        
        if (pack.purchased) {
            if (pack.enabled) {
                const disableButton = document.createElement('button');
                disableButton.className = 'expansion-soundtrack-ui-button disable';
                disableButton.textContent = 'Disable Pack';
                disableButton.addEventListener('click', () => {
                    this.disablePack(packId);
                    this.showPackDetails(packId);
                });
                actions.appendChild(disableButton);
            } else {
                const enableButton = document.createElement('button');
                enableButton.className = 'expansion-soundtrack-ui-button enable';
                enableButton.textContent = 'Enable Pack';
                enableButton.addEventListener('click', () => {
                    this.enablePack(packId);
                    this.showPackDetails(packId);
                });
                actions.appendChild(enableButton);
            }
        } else {
            const purchaseButton = document.createElement('button');
            purchaseButton.className = 'expansion-soundtrack-ui-button purchase';
            purchaseButton.textContent = `Purchase for $${(pack.price / 100).toFixed(2)}`;
            purchaseButton.addEventListener('click', () => {
                this.purchasePack(packId);
                this.showPackDetails(packId);
            });
            actions.appendChild(purchaseButton);
        }
        
        this.packDetails.appendChild(actions);
    }
    
    /**
     * Play a track preview
     * @param {string} packId - Pack ID
     * @param {string} trackId - Track ID
     * @param {HTMLButtonElement} playButton - Play button element
     */
    playTrackPreview(packId, trackId, playButton) {
        // Get pack and track
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack || !pack.purchased || !pack.enabled) {
            return;
        }
        
        const track = pack.tracks.find(t => t.id === trackId);
        if (!track || !track.audio) {
            return;
        }
        
        // Stop all other previews
        const allPlayButtons = this.packDetails.querySelectorAll('.expansion-soundtrack-ui-track-play');
        for (const button of allPlayButtons) {
            if (button !== playButton) {
                button.textContent = '▶';
                
                // Find and pause the corresponding audio
                const trackItem = button.closest('.expansion-soundtrack-ui-track-item');
                if (trackItem) {
                    const trackName = trackItem.querySelector('.expansion-soundtrack-ui-track-name').textContent;
                    const t = pack.tracks.find(t => t.name === trackName);
                    if (t && t.audio) {
                        t.audio.pause();
                        t.audio.currentTime = 0;
                    }
                }
            }
        }
        
        // Toggle play/pause
        if (track.audio.paused) {
            track.audio.currentTime = 0;
            track.audio.play().catch(error => {
                console.error(`Failed to play track ${trackId}:`, error);
            });
            playButton.textContent = '⏸';
            
            // Reset button when track ends
            track.audio.onended = () => {
                playButton.textContent = '▶';
                track.audio.onended = null;
            };
        } else {
            track.audio.pause();
            track.audio.currentTime = 0;
            playButton.textContent = '▶';
        }
    }
    
    /**
     * Purchase a pack
     * @param {string} packId - Pack ID
     */
    purchasePack(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack || pack.purchased) {
            return;
        }
        
        // Confirm purchase
        if (!confirm(`Are you sure you want to purchase "${pack.name}" for $${(pack.price / 100).toFixed(2)}?`)) {
            return;
        }
        
        // Purchase pack
        if (this.soundtrackSystem.purchasePack(packId)) {
            this.showMessage(`Successfully purchased "${pack.name}"!`, 'success');
            this.loadPacks();
        } else {
            this.showMessage(`Failed to purchase "${pack.name}".`, 'error');
        }
    }
    
    /**
     * Enable a pack
     * @param {string} packId - Pack ID
     */
    enablePack(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack || !pack.purchased || pack.enabled) {
            return;
        }
        
        // Enable pack
        if (this.soundtrackSystem.enablePack(packId)) {
            this.showMessage(`"${pack.name}" is now enabled!`, 'success');
            this.loadPacks();
        } else {
            this.showMessage(`Failed to enable "${pack.name}".`, 'error');
        }
    }
    
    /**
     * Disable a pack
     * @param {string} packId - Pack ID
     */
    disablePack(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack || !pack.enabled) {
            return;
        }
        
        // Disable pack
        if (this.soundtrackSystem.disablePack(packId)) {
            this.showMessage(`"${pack.name}" is now disabled.`, 'info');
            this.loadPacks();
        } else {
            this.showMessage(`Failed to disable "${pack.name}".`, 'error');
        }
    }
    
    /**
     * Handle pack purchased
     * @param {string} packId - Pack ID
     */
    onPackPurchased(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack) {
            return;
        }
        
        this.showMessage(`New soundtrack pack available: "${pack.name}"`, 'success');
        
        // Refresh UI if visible
        if (this.visible) {
            this.loadPacks();
        }
    }
    
    /**
     * Handle pack enabled
     * @param {string} packId - Pack ID
     */
    onPackEnabled(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack) {
            return;
        }
        
        // Refresh UI if visible
        if (this.visible) {
            this.loadPacks();
        }
    }
    
    /**
     * Handle pack disabled
     * @param {string} packId - Pack ID
     */
    onPackDisabled(packId) {
        const pack = this.soundtrackSystem.getPack(packId);
        if (!pack) {
            return;
        }
        
        // Refresh UI if visible
        if (this.visible) {
            this.loadPacks();
        }
    }
    
    /**
     * Show a message to the user
     * @param {string} message - Message text
     * @param {string} type - Message type (info, success, warning, error)
     */
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `expansion-soundtrack-ui-message expansion-soundtrack-ui-message-${type}`;
        messageEl.textContent = message;
        
        // Add to document
        document.body.appendChild(messageEl);
        
        // Show message
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 500);
        }, 3000);
    }
    
    /**
     * Update the expansion soundtrack UI
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the expansion soundtrack UI
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
    module.exports = ExpansionSoundtrackUI;
}