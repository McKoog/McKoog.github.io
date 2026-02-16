/* ========================================
   GALACTIC NEXUS — Main Game Engine
   ======================================== */

const Game = {
    state: null,

    // Create a new game state
    createNewState(colonyName, planetType) {
        const planet = GAME_DATA.planetBonuses[planetType] || GAME_DATA.planetBonuses.temperate;

        return {
            colonyName: colonyName || 'New Haven',
            planetType: planetType || 'temperate',
            turn: 1,
            resources: {
                energy: planet.startEnergy || 100,
                minerals: planet.startMinerals || 80,
                food: planet.startFood || 120,
                credits: 200,
                research: 0
            },
            rates: { energy: 0, minerals: 0, food: 0, credits: 0, research: 0 },
            population: {
                current: 10,
                maxPop: 20,
                morale: 75,
                moraleModifier: 0,
                growthProgress: 0
            },
            buildings: {},
            techsResearched: [],
            currentResearch: null,
            researchProgress: 0,
            stats: {
                colonyLevel: 1,
                totalBuildings: 0,
                techsResearched: 0,
                missionsCompleted: 0,
                tradesCompleted: 0,
                defense: 0
            },
            market: null,
            tradeHistory: [],
            activeMissions: [],
            availableMissions: [],
            completedMissions: [],
            recentEvents: [],
            resourceHistory: [],
            settings: {
                sound: true,
                music: true,
                particles: true,
                autosave: true
            }
        };
    },

    // Initialize the game
    async init() {
        // Stars background
        GameUI.initStars();

        // Loading sequence
        const loadingSteps = [
            'Scanning star systems...',
            'Calibrating sensors...',
            'Loading colony data...',
            'Initializing subsystems...',
            'Establishing communications...',
            'Systems online!'
        ];

        const loadBar = Utils.$('loading-bar');
        const loadText = Utils.$('loading-text');

        for (let i = 0; i < loadingSteps.length; i++) {
            loadText.textContent = loadingSteps[i];
            loadBar.style.width = `${((i + 1) / loadingSteps.length) * 100}%`;
            await this.delay(400);
        }

        await this.delay(300);
        Utils.hide('loading-screen');

        // Check for saved game
        const saved = this.loadGame();
        if (saved) {
            Utils.$('btn-continue').style.display = '';
            Utils.$('btn-continue').addEventListener('click', () => {
                this.state = saved;
                this.startGame();
            });
        }

        // Main menu
        Utils.show('main-menu');

        // New game button
        Utils.$('btn-new-game').addEventListener('click', () => {
            Utils.hide('main-menu');
            Utils.show('colony-modal');
        });

        // Colony setup
        this.setupColonyModal();

        // Settings menu button
        Utils.$('btn-settings-menu').addEventListener('click', () => {
            Utils.show('settings-modal');
        });
    },

    // Setup colony creation modal
    setupColonyModal() {
        // Planet selection
        const planetOptions = document.querySelectorAll('.planet-option');
        planetOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                planetOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });

        // Cancel
        Utils.$('btn-cancel-colony').addEventListener('click', () => {
            Utils.hide('colony-modal');
            Utils.show('main-menu');
        });

        // Start colony
        Utils.$('btn-start-colony').addEventListener('click', () => {
            const name = Utils.$('colony-name-input').value.trim() || 'New Haven';
            const selectedPlanet = document.querySelector('.planet-option.selected');
            const planetType = selectedPlanet ? selectedPlanet.dataset.planet : 'temperate';

            this.state = this.createNewState(name, planetType);
            Utils.hide('colony-modal');
            this.startGame();
        });
    },

    // Start the game
    startGame() {
        Utils.hide('main-menu');
        Utils.show('game-ui');

        // Initialize subsystems
        TradeManager.initMarket(this.state);
        MissionManager.initMissions(this.state);
        ResourceManager.calculateRates(this.state);
        ResourceManager.recordHistory(this.state);

        // Initialize UI
        GameUI.init(this.state);
        ResourceManager.updateDisplay(this.state);
        PopulationManager.updatePopulationUI(this.state);
        GameUI.updateOverview(this.state);
        GameUI.renderActivePanel(this.state);
        ResearchManager.updateResearchBar(this.state);

        // Auto-save interval
        if (this.state.settings.autosave) {
            setInterval(() => this.saveGame(), 30000);
        }
    },

    // Process a turn
    nextTurn() {
        if (!this.state) return;

        const state = this.state;
        state.turn++;

        // 1. Apply resource production
        ResourceManager.applyProduction(state);

        // 2. Process research
        ResearchManager.processResearch(state);

        // 3. Process population growth and morale
        PopulationManager.processGrowth(state);
        PopulationManager.calculateMorale(state);

        // 4. Update market prices
        TradeManager.updatePrices(state);

        // 5. Unlock new missions
        MissionManager.unlockMissions(state);

        // 6. Check mission completion
        MissionManager.checkMissions(state);

        // 7. Update stats
        state.stats.totalBuildings = BuildingManager.countTotalBuildings(state);
        state.stats.defense = BuildingManager.getTotalDefense(state);
        state.stats.colonyLevel = Utils.calcColonyLevel(state.stats.totalBuildings, state.stats.techsResearched);

        // 8. Record history
        ResourceManager.recordHistory(state);

        // 9. Check for random events
        EventManager.checkEvents(state);

        // 10. Update all UI
        ResourceManager.calculateRates(state);
        ResourceManager.updateDisplay(state);
        PopulationManager.updatePopulationUI(state);
        GameUI.updateOverview(state);
        GameUI.renderActivePanel(state);
        ResearchManager.updateResearchBar(state);

        // Play turn sound
        GameUI.playSound('turn');

        // Season notification on change
        const prevSeason = Utils.getSeason(state.turn - 1);
        const currSeason = Utils.getSeason(state.turn);
        if (prevSeason !== currSeason) {
            Utils.toast(`${GAME_DATA.seasonEmojis[currSeason]} Season changed to ${currSeason}!`, 'info');
            GameUI.addLogEntry(`Season changed to ${GAME_DATA.seasonEmojis[currSeason]} ${currSeason}`, 'info', state.turn);
        }

        // Auto-save
        if (state.settings.autosave && state.turn % 5 === 0) {
            this.saveGame();
        }

        // Log
        GameUI.addLogEntry(`Turn ${state.turn} processed`, 'info', state.turn);
    },

    // Save game to localStorage
    saveGame() {
        try {
            const saveData = JSON.stringify(this.state);
            localStorage.setItem('galactic_nexus_save', saveData);
        } catch (e) {
            console.error('Failed to save:', e);
        }
    },

    // Load game from localStorage
    loadGame() {
        try {
            const data = localStorage.getItem('galactic_nexus_save');
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Failed to load:', e);
        }
        return null;
    },

    // Utility delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Start the game when page loads
window.addEventListener('DOMContentLoaded', () => Game.init());
