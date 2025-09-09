/**
 * Arcade Meltdown - Map Editor
 * User interface for creating and editing community maps
 */

class MapEditor {
    /**
     * Create a new map editor
     * @param {GameEngine} gameEngine - The game engine instance
     * @param {CommunityMapSystem} mapSystem - The map system instance
     */
    constructor(gameEngine, mapSystem) {
        this.gameEngine = gameEngine;
        this.mapSystem = mapSystem;
        
        // Editor state
        this.visible = false;
        this.currentMap = null;
        this.selectedTile = 1; // Wall tile
        this.selectedTool = 'paint'; // paint, fill, erase, spawn, objective
        this.testMode = false;
        
        // Tile types
        this.tileTypes = {
            0: { name: 'Empty', color: '#111111', walkable: true },
            1: { name: 'Wall', color: '#444444', walkable: false },
            2: { name: 'Water', color: '#0066cc', walkable: false },
            3: { name: 'Lava', color: '#ff6600', walkable: false, damage: 10 },
            4: { name: 'Slime', color: '#00cc66', walkable: true, slow: 0.5 },
            5: { name: 'Ice', color: '#99ccff', walkable: true, slippery: true },
            6: { name: 'Boost Pad', color: '#ffff00', walkable: true, boost: 2 },
            7: { name: 'Teleporter', color: '#cc00ff', walkable: true, teleport: true }
        };
        
        // DOM elements
        this.container = null;
        this.toolbar = null;
        this.tilePalette = null;
        this.propertiesPanel = null;
        this.canvas = null;
        this.ctx = null;
        
        // Mouse state
        this.mouseDown = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the map editor
     */
    init() {
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
        this.container.id = 'map-editor';
        this.container.className = 'map-editor hidden';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'map-editor-header';
        
        const title = document.createElement('h2');
        title.textContent = 'Map Editor';
        header.appendChild(title);
        
        const buttons = document.createElement('div');
        buttons.className = 'map-editor-header-buttons';
        
        const newButton = document.createElement('button');
        newButton.className = 'map-editor-button';
        newButton.textContent = 'New';
        newButton.addEventListener('click', () => this.newMap());
        buttons.appendChild(newButton);
        
        const loadButton = document.createElement('button');
        loadButton.className = 'map-editor-button';
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => this.showLoadDialog());
        buttons.appendChild(loadButton);
        
        const saveButton = document.createElement('button');
        saveButton.className = 'map-editor-button';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => this.saveMap());
        buttons.appendChild(saveButton);
        
        const testButton = document.createElement('button');
        testButton.className = 'map-editor-button';
        testButton.textContent = 'Test';
        testButton.addEventListener('click', () => this.testMap());
        buttons.appendChild(testButton);
        
        const publishButton = document.createElement('button');
        publishButton.className = 'map-editor-button';
        publishButton.textContent = 'Publish';
        publishButton.addEventListener('click', () => this.publishMap());
        buttons.appendChild(publishButton);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'map-editor-button map-editor-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.close());
        buttons.appendChild(closeButton);
        
        header.appendChild(buttons);
        this.container.appendChild(header);
        
        // Create main content
        const content = document.createElement('div');
        content.className = 'map-editor-content';
        
        // Create toolbar
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'map-editor-toolbar';
        
        // Tool buttons
        const tools = [
            { id: 'paint', name: 'Paint', icon: '🖌️' },
            { id: 'fill', name: 'Fill', icon: '🪣' },
            { id: 'erase', name: 'Erase', icon: '🧽' },
            { id: 'spawn', name: 'Spawn', icon: '🚩' },
            { id: 'objective', name: 'Objective', icon: '🎯' }
        ];
        
        for (const tool of tools) {
            const toolButton = document.createElement('button');
            toolButton.className = 'map-editor-tool-button';
            toolButton.dataset.tool = tool.id;
            toolButton.title = tool.name;
            toolButton.textContent = tool.icon;
            
            if (tool.id === this.selectedTool) {
                toolButton.classList.add('active');
            }
            
            toolButton.addEventListener('click', () => this.selectTool(tool.id));
            this.toolbar.appendChild(toolButton);
        }
        
        content.appendChild(this.toolbar);
        
        // Create editor area
        const editorArea = document.createElement('div');
        editorArea.className = 'map-editor-area';
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'map-editor-canvas';
        this.ctx = this.canvas.getContext('2d');
        editorArea.appendChild(this.canvas);
        
        // Create tile palette
        this.tilePalette = document.createElement('div');
        this.tilePalette.className = 'map-editor-tile-palette';
        
        for (const [tileId, tileType] of Object.entries(this.tileTypes)) {
            const tileButton = document.createElement('button');
            tileButton.className = 'map-editor-tile-button';
            tileButton.dataset.tile = tileId;
            tileButton.title = tileType.name;
            tileButton.style.backgroundColor = tileType.color;
            
            if (parseInt(tileId) === this.selectedTile) {
                tileButton.classList.add('active');
            }
            
            tileButton.addEventListener('click', () => this.selectTile(parseInt(tileId)));
            this.tilePalette.appendChild(tileButton);
        }
        
        editorArea.appendChild(this.tilePalette);
        content.appendChild(editorArea);
        
        // Create properties panel
        this.propertiesPanel = document.createElement('div');
        this.propertiesPanel.className = 'map-editor-properties';
        
        const propertiesTitle = document.createElement('h3');
        propertiesTitle.textContent = 'Map Properties';
        this.propertiesPanel.appendChild(propertiesTitle);
        
        // Map name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        this.propertiesPanel.appendChild(nameLabel);
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'map-editor-name';
        nameInput.placeholder = 'Enter map name';
        this.propertiesPanel.appendChild(nameInput);
        
        // Map description
        const descLabel = document.createElement('label');
        descLabel.textContent = 'Description:';
        this.propertiesPanel.appendChild(descLabel);
        
        const descInput = document.createElement('textarea');
        descInput.id = 'map-editor-description';
        descInput.placeholder = 'Enter map description';
        descInput.rows = 4;
        this.propertiesPanel.appendChild(descInput);
        
        // Map dimensions
        const dimensionsLabel = document.createElement('label');
        dimensionsLabel.textContent = 'Dimensions:';
        this.propertiesPanel.appendChild(dimensionsLabel);
        
        const dimensionsContainer = document.createElement('div');
        dimensionsContainer.className = 'map-editor-dimensions';
        
        const widthLabel = document.createElement('label');
        widthLabel.textContent = 'Width:';
        dimensionsContainer.appendChild(widthLabel);
        
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.id = 'map-editor-width';
        widthInput.min = '10';
        widthInput.max = '100';
        widthInput.value = '40';
        dimensionsContainer.appendChild(widthInput);
        
        const heightLabel = document.createElement('label');
        heightLabel.textContent = 'Height:';
        dimensionsContainer.appendChild(heightLabel);
        
        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.id = 'map-editor-height';
        heightInput.min = '10';
        heightInput.max = '100';
        heightInput.value = '30';
        dimensionsContainer.appendChild(heightInput);
        
        this.propertiesPanel.appendChild(dimensionsContainer);
        
        // Map difficulty
        const difficultyLabel = document.createElement('label');
        difficultyLabel.textContent = 'Difficulty:';
        this.propertiesPanel.appendChild(difficultyLabel);
        
        const difficultySelect = document.createElement('select');
        difficultySelect.id = 'map-editor-difficulty';
        
        const difficulties = [
            { value: 'easy', text: 'Easy' },
            { value: 'medium', text: 'Medium' },
            { value: 'hard', text: 'Hard' },
            { value: 'extreme', text: 'Extreme' }
        ];
        
        for (const difficulty of difficulties) {
            const option = document.createElement('option');
            option.value = difficulty.value;
            option.textContent = difficulty.text;
            difficultySelect.appendChild(option);
        }
        
        this.propertiesPanel.appendChild(difficultySelect);
        
        // Map tags
        const tagsLabel = document.createElement('label');
        tagsLabel.textContent = 'Tags (comma separated):';
        this.propertiesPanel.appendChild(tagsLabel);
        
        const tagsInput = document.createElement('input');
        tagsInput.type = 'text';
        tagsInput.id = 'map-editor-tags';
        tagsInput.placeholder = 'e.g. small, arena, fast';
        this.propertiesPanel.appendChild(tagsInput);
        
        // Resize button
        const resizeButton = document.createElement('button');
        resizeButton.className = 'map-editor-button';
        resizeButton.textContent = 'Resize Map';
        resizeButton.addEventListener('click', () => this.resizeMap());
        this.propertiesPanel.appendChild(resizeButton);
        
        content.appendChild(this.propertiesPanel);
        this.container.appendChild(content);
        
        // Add to document
        document.body.appendChild(this.container);
        
        // Create a new map by default
        this.newMap();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Canvas mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
        
        // Canvas context menu (disable)
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Property input events
        const nameInput = document.getElementById('map-editor-name');
        if (nameInput) {
            nameInput.addEventListener('input', () => this.updateMapProperties());
        }
        
        const descInput = document.getElementById('map-editor-description');
        if (descInput) {
            descInput.addEventListener('input', () => this.updateMapProperties());
        }
        
        const difficultySelect = document.getElementById('map-editor-difficulty');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', () => this.updateMapProperties());
        }
        
        const tagsInput = document.getElementById('map-editor-tags');
        if (tagsInput) {
            tagsInput.addEventListener('input', () => this.updateMapProperties());
        }
        
        // Listen for key events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.visible) {
                this.close();
            }
        });
    }
    
    /**
     * Show the map editor
     */
    show() {
        this.visible = true;
        this.container.classList.remove('hidden');
        
        // Resize canvas to fit container
        this.resizeCanvas();
    }
    
    /**
     * Hide the map editor
     */
    hide() {
        this.visible = false;
        this.container.classList.add('hidden');
    }
    
    /**
     * Close the map editor
     */
    close() {
        // Check if there are unsaved changes
        if (this.hasUnsavedChanges()) {
            if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
                return;
            }
        }
        
        this.hide();
        
        // Emit editor closed event
        window.eventSystem.emit('editor:stop');
    }
    
    /**
     * Create a new map
     */
    newMap() {
        // Get dimensions from inputs
        const widthInput = document.getElementById('map-editor-width');
        const heightInput = document.getElementById('map-editor-height');
        
        const width = widthInput ? parseInt(widthInput.value) : 40;
        const height = heightInput ? parseInt(heightInput.value) : 30;
        
        // Create new map
        this.currentMap = {
            id: null,
            name: 'Untitled Map',
            description: '',
            author: this.mapSystem.getLocalPlayerId(),
            authorName: 'You',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            published: false,
            tiles: Array(width * height).fill(0),
            width: width,
            height: height,
            tileSize: 40,
            spawnPoints: [],
            objectives: [],
            difficulty: 'medium',
            tags: []
        };
        
        // Update properties panel
        this.updatePropertiesPanel();
        
        // Resize canvas
        this.resizeCanvas();
        
        // Render map
        this.render();
    }
    
    /**
     * Load a map
     * @param {string} mapId - Map ID
     */
    loadMap(mapId) {
        const map = this.mapSystem.getMap(mapId);
        if (!map) {
            console.warn(`Map not found: ${mapId}`);
            return;
        }
        
        // Create a copy of the map
        this.currentMap = {
            ...map,
            tiles: [...map.tiles],
            spawnPoints: [...map.spawnPoints],
            objectives: [...map.objectives]
        };
        
        // Update properties panel
        this.updatePropertiesPanel();
        
        // Resize canvas
        this.resizeCanvas();
        
        // Render map
        this.render();
    }
    
    /**
     * Save the current map
     */
    saveMap() {
        if (!this.currentMap) {
            return;
        }
        
        // Update map properties
        this.updateMapProperties();
        
        // Save map
        const mapId = this.mapSystem.saveMap(this.currentMap);
        
        // Update current map ID
        this.currentMap.id = mapId;
        
        // Show success message
        this.showMessage('Map saved successfully!', 'success');
    }
    
    /**
     * Publish the current map
     */
    publishMap() {
        if (!this.currentMap) {
            return;
        }
        
        // Update map properties
        this.updateMapProperties();
        
        // Check if map has a name
        if (!this.currentMap.name || this.currentMap.name.trim() === '') {
            this.showMessage('Please enter a map name before publishing.', 'error');
            return;
        }
        
        // Save map first
        const mapId = this.mapSystem.saveMap(this.currentMap);
        this.currentMap.id = mapId;
        
        // Publish map
        if (this.mapSystem.publishMap(mapId)) {
            this.showMessage('Map published successfully!', 'success');
        } else {
            this.showMessage('Failed to publish map.', 'error');
        }
    }
    
    /**
     * Test the current map
     */
    testMap() {
        if (!this.currentMap) {
            return;
        }
        
        // Update map properties
        this.updateMapProperties();
        
        // Save map
        const mapId = this.mapSystem.saveMap(this.currentMap);
        
        // Emit test event
        window.eventSystem.emit('editor:test');
    }
    
    /**
     * Show the load dialog
     */
    showLoadDialog() {
        // In a real implementation, this would show a dialog with all available maps
        const maps = this.mapSystem.getMapsByCategory('my_maps');
        
        if (maps.length === 0) {
            this.showMessage('You have no saved maps.', 'info');
            return;
        }
        
        // For now, just load the first map
        this.loadMap(maps[0]);
    }
    
    /**
     * Resize the map
     */
    resizeMap() {
        if (!this.currentMap) {
            return;
        }
        
        // Get new dimensions
        const widthInput = document.getElementById('map-editor-width');
        const heightInput = document.getElementById('map-editor-height');
        
        const newWidth = widthInput ? parseInt(widthInput.value) : this.currentMap.width;
        const newHeight = heightInput ? parseInt(heightInput.value) : this.currentMap.height;
        
        // Check if dimensions changed
        if (newWidth === this.currentMap.width && newHeight === this.currentMap.height) {
            return;
        }
        
        // Create new tiles array
        const newTiles = Array(newWidth * newHeight).fill(0);
        
        // Copy existing tiles
        for (let y = 0; y < Math.min(this.currentMap.height, newHeight); y++) {
            for (let x = 0; x < Math.min(this.currentMap.width, newWidth); x++) {
                const oldIndex = y * this.currentMap.width + x;
                const newIndex = y * newWidth + x;
                newTiles[newIndex] = this.currentMap.tiles[oldIndex];
            }
        }
        
        // Update map
        this.currentMap.tiles = newTiles;
        this.currentMap.width = newWidth;
        this.currentMap.height = newHeight;
        
        // Resize canvas
        this.resizeCanvas();
        
        // Render map
        this.render();
        
        this.showMessage('Map resized successfully!', 'success');
    }
    
    /**
     * Resize the canvas
     */
    resizeCanvas() {
        if (!this.currentMap) {
            return;
        }
        
        // Set canvas size
        this.canvas.width = this.currentMap.width * this.currentMap.tileSize;
        this.canvas.height = this.currentMap.height * this.currentMap.tileSize;
        
        // Render map
        this.render();
    }
    
    /**
     * Update the properties panel with current map data
     */
    updatePropertiesPanel() {
        if (!this.currentMap) {
            return;
        }
        
        // Update name
        const nameInput = document.getElementById('map-editor-name');
        if (nameInput) {
            nameInput.value = this.currentMap.name || '';
        }
        
        // Update description
        const descInput = document.getElementById('map-editor-description');
        if (descInput) {
            descInput.value = this.currentMap.description || '';
        }
        
        // Update dimensions
        const widthInput = document.getElementById('map-editor-width');
        if (widthInput) {
            widthInput.value = this.currentMap.width;
        }
        
        const heightInput = document.getElementById('map-editor-height');
        if (heightInput) {
            heightInput.value = this.currentMap.height;
        }
        
        // Update difficulty
        const difficultySelect = document.getElementById('map-editor-difficulty');
        if (difficultySelect) {
            difficultySelect.value = this.currentMap.difficulty || 'medium';
        }
        
        // Update tags
        const tagsInput = document.getElementById('map-editor-tags');
        if (tagsInput) {
            tagsInput.value = this.currentMap.tags ? this.currentMap.tags.join(', ') : '';
        }
    }
    
    /**
     * Update map properties from the properties panel
     */
    updateMapProperties() {
        if (!this.currentMap) {
            return;
        }
        
        // Update name
        const nameInput = document.getElementById('map-editor-name');
        if (nameInput) {
            this.currentMap.name = nameInput.value;
        }
        
        // Update description
        const descInput = document.getElementById('map-editor-description');
        if (descInput) {
            this.currentMap.description = descInput.value;
        }
        
        // Update difficulty
        const difficultySelect = document.getElementById('map-editor-difficulty');
        if (difficultySelect) {
            this.currentMap.difficulty = difficultySelect.value;
        }
        
        // Update tags
        const tagsInput = document.getElementById('map-editor-tags');
        if (tagsInput) {
            this.currentMap.tags = tagsInput.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
        }
    }
    
    /**
     * Select a tool
     * @param {string} tool - Tool ID
     */
    selectTool(tool) {
        this.selectedTool = tool;
        
        // Update active tool button
        for (const button of this.toolbar.querySelectorAll('.map-editor-tool-button')) {
            if (button.dataset.tool === tool) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }
    
    /**
     * Select a tile
     * @param {number} tile - Tile ID
     */
    selectTile(tile) {
        this.selectedTile = tile;
        
        // Update active tile button
        for (const button of this.tilePalette.querySelectorAll('.map-editor-tile-button')) {
            if (parseInt(button.dataset.tile) === tile) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }
    
    /**
     * Handle mouse down event
     * @param {MouseEvent} e - Mouse event
     */
    onMouseDown(e) {
        this.mouseDown = true;
        this.lastMousePos = this.getMousePos(e);
        
        // Apply tool
        this.applyTool(this.lastMousePos);
    }
    
    /**
     * Handle mouse move event
     * @param {MouseEvent} e - Mouse event
     */
    onMouseMove(e) {
        const mousePos = this.getMousePos(e);
        
        if (this.mouseDown) {
            // Apply tool
            this.applyTool(mousePos);
        }
        
        this.lastMousePos = mousePos;
    }
    
    /**
     * Handle mouse up event
     */
    onMouseUp() {
        this.mouseDown = false;
    }
    
    /**
     * Get mouse position relative to canvas
     * @param {MouseEvent} e - Mouse event
     * @returns {object} Mouse position {x, y}
     */
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    /**
     * Apply the selected tool at the given position
     * @param {object} pos - Position {x, y}
     */
    applyTool(pos) {
        if (!this.currentMap) {
            return;
        }
        
        // Convert to tile coordinates
        const tileX = Math.floor(pos.x / this.currentMap.tileSize);
        const tileY = Math.floor(pos.y / this.currentMap.tileSize);
        
        // Check if within bounds
        if (tileX < 0 || tileX >= this.currentMap.width || tileY < 0 || tileY >= this.currentMap.height) {
            return;
        }
        
        // Apply tool
        switch (this.selectedTool) {
            case 'paint':
                this.paintTile(tileX, tileY);
                break;
            case 'fill':
                this.fillArea(tileX, tileY);
                break;
            case 'erase':
                this.eraseTile(tileX, tileY);
                break;
            case 'spawn':
                this.placeSpawnPoint(tileX, tileY);
                break;
            case 'objective':
                this.placeObjective(tileX, tileY);
                break;
        }
        
        // Render map
        this.render();
    }
    
    /**
     * Paint a tile
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     */
    paintTile(x, y) {
        const index = y * this.currentMap.width + x;
        this.currentMap.tiles[index] = this.selectedTile;
    }
    
    /**
     * Fill an area with the selected tile
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     */
    fillArea(x, y) {
        const index = y * this.currentMap.width + x;
        const targetTile = this.currentMap.tiles[index];
        
        if (targetTile === this.selectedTile) {
            return;
        }
        
        // Flood fill algorithm
        const stack = [{x, y}];
        const visited = new Set();
        
        while (stack.length > 0) {
            const {x: cx, y: cy} = stack.pop();
            const cIndex = cy * this.currentMap.width + cx;
            const key = `${cx},${cy}`;
            
            if (visited.has(key) || 
                cx < 0 || cx >= this.currentMap.width || 
                cy < 0 || cy >= this.currentMap.height ||
                this.currentMap.tiles[cIndex] !== targetTile) {
                continue;
            }
            
            visited.add(key);
            this.currentMap.tiles[cIndex] = this.selectedTile;
            
            // Add neighbors to stack
            stack.push({x: cx + 1, y: cy});
            stack.push({x: cx - 1, y: cy});
            stack.push({x: cx, y: cy + 1});
            stack.push({x: cx, y: cy - 1});
        }
    }
    
    /**
     * Erase a tile
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     */
    eraseTile(x, y) {
        const index = y * this.currentMap.width + x;
        this.currentMap.tiles[index] = 0;
    }
    
    /**
     * Place a spawn point
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     */
    placeSpawnPoint(x, y) {
        // Remove existing spawn points at this position
        this.currentMap.spawnPoints = this.currentMap.spawnPoints.filter(sp => 
            !(sp.x === x && sp.y === y)
        );
        
        // Add new spawn point
        this.currentMap.spawnPoints.push({x, y});
    }
    
    /**
     * Place an objective
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     */
    placeObjective(x, y) {
        // Remove existing objectives at this position
        this.currentMap.objectives = this.currentMap.objectives.filter(obj => 
            !(obj.x === x && obj.y === y)
        );
        
        // Add new objective
        this.currentMap.objectives.push({x, y, type: 'capture'});
    }
    
    /**
     * Render the map
     */
    render() {
        if (!this.currentMap || !this.ctx) {
            return;
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw tiles
        for (let y = 0; y < this.currentMap.height; y++) {
            for (let x = 0; x < this.currentMap.width; x++) {
                const index = y * this.currentMap.width + x;
                const tileId = this.currentMap.tiles[index];
                const tileType = this.tileTypes[tileId];
                
                if (tileType) {
                    this.ctx.fillStyle = tileType.color;
                    this.ctx.fillRect(
                        x * this.currentMap.tileSize,
                        y * this.currentMap.tileSize,
                        this.currentMap.tileSize,
                        this.currentMap.tileSize
                    );
                    
                    // Draw tile border
                    this.ctx.strokeStyle = '#333333';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        x * this.currentMap.tileSize,
                        y * this.currentMap.tileSize,
                        this.currentMap.tileSize,
                        this.currentMap.tileSize
                    );
                }
            }
        }
        
        // Draw spawn points
        this.ctx.fillStyle = '#00ff00';
        for (const spawn of this.currentMap.spawnPoints) {
            this.ctx.fillRect(
                spawn.x * this.currentMap.tileSize + 5,
                spawn.y * this.currentMap.tileSize + 5,
                this.currentMap.tileSize - 10,
                this.currentMap.tileSize - 10
            );
        }
        
        // Draw objectives
        this.ctx.fillStyle = '#ff0000';
        for (const objective of this.currentMap.objectives) {
            this.ctx.beginPath();
            this.ctx.arc(
                objective.x * this.currentMap.tileSize + this.currentMap.tileSize / 2,
                objective.y * this.currentMap.tileSize + this.currentMap.tileSize / 2,
                this.currentMap.tileSize / 3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.currentMap.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.currentMap.tileSize, 0);
            this.ctx.lineTo(x * this.currentMap.tileSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.currentMap.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.currentMap.tileSize);
            this.ctx.lineTo(this.canvas.width, y * this.currentMap.tileSize);
            this.ctx.stroke();
        }
    }
    
    /**
     * Get the current map data
     * @returns {object} Map data
     */
    getMapData() {
        if (!this.currentMap) {
            return null;
        }
        
        // Update map properties
        this.updateMapProperties();
        
        // Return a copy of the map data
        return {
            ...this.currentMap,
            tiles: [...this.currentMap.tiles],
            spawnPoints: [...this.currentMap.spawnPoints],
            objectives: [...this.currentMap.objectives]
        };
    }
    
    /**
     * Check if there are unsaved changes
     * @returns {boolean} Whether there are unsaved changes
     */
    hasUnsavedChanges() {
        if (!this.currentMap) {
            return false;
        }
        
        // In a real implementation, this would compare the current map state
        // with the last saved state
        return true;
    }
    
    /**
     * Show a message to the user
     * @param {string} message - Message text
     * @param {string} type - Message type (info, success, warning, error)
     */
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `map-editor-message map-editor-message-${type}`;
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
     * Update the map editor
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the map editor
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
    module.exports = MapEditor;
}