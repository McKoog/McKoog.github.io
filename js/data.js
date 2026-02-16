/* ========================================
   GALACTIC NEXUS — Game Data Definitions
   ======================================== */

const GAME_DATA = {
    // Season definitions
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
    seasonEmojis: { Spring: '🌱', Summer: '☀️', Autumn: '🍂', Winter: '❄️' },
    seasonEffects: {
        Spring: { food: 1.2, energy: 1.0, minerals: 1.0, morale: 5 },
        Summer: { food: 1.0, energy: 1.3, minerals: 1.0, morale: 3 },
        Autumn: { food: 0.8, energy: 1.0, minerals: 1.2, morale: 0 },
        Winter: { food: 0.6, energy: 0.8, minerals: 1.0, morale: -5 }
    },

    // Planet type bonuses
    planetBonuses: {
        temperate: { food: 1.15, energy: 1.0, minerals: 1.0, research: 1.0, startFood: 150, startEnergy: 100, startMinerals: 80 },
        arid: { food: 0.8, energy: 1.1, minerals: 1.3, research: 1.0, startFood: 80, startEnergy: 120, startMinerals: 150 },
        frozen: { food: 0.7, energy: 1.35, minerals: 1.0, research: 1.15, startFood: 60, startEnergy: 180, startMinerals: 100 }
    },

    // Resource definitions
    resources: {
        energy: { name: 'Energy', icon: '⚡', color: '#f59e0b' },
        minerals: { name: 'Minerals', icon: '💎', color: '#a855f7' },
        food: { name: 'Food', icon: '🌾', color: '#10b981' },
        credits: { name: 'Credits', icon: '💰', color: '#f59e0b' },
        research: { name: 'Research', icon: '🔬', color: '#3b82f6' }
    },

    // Building definitions
    buildings: {
        // --- Production ---
        solar_array: {
            id: 'solar_array', name: 'Solar Array', icon: '☀️', category: 'production',
            desc: 'Captures stellar energy to power your colony.',
            maxLevel: 5,
            baseCost: { credits: 50, minerals: 30 },
            costMultiplier: 1.5,
            production: { energy: 8 },
            productionPerLevel: { energy: 4 },
            workers: 1,
            unlockTech: null
        },
        mining_facility: {
            id: 'mining_facility', name: 'Mining Facility', icon: '⛏️', category: 'production',
            desc: 'Extracts valuable minerals from the planet\'s crust.',
            maxLevel: 5,
            baseCost: { credits: 60, energy: 20 },
            costMultiplier: 1.5,
            production: { minerals: 6 },
            productionPerLevel: { minerals: 3 },
            workers: 2,
            unlockTech: null
        },
        hydro_farm: {
            id: 'hydro_farm', name: 'Hydroponic Farm', icon: '🌿', category: 'production',
            desc: 'Advanced agricultural facility growing food in nutrient solutions.',
            maxLevel: 5,
            baseCost: { credits: 40, energy: 15, minerals: 20 },
            costMultiplier: 1.4,
            production: { food: 10 },
            productionPerLevel: { food: 5 },
            workers: 2,
            unlockTech: null
        },
        credit_mint: {
            id: 'credit_mint', name: 'Credit Mint', icon: '🏦', category: 'production',
            desc: 'Financial hub generating credits through trade processing.',
            maxLevel: 3,
            baseCost: { minerals: 80, energy: 40 },
            costMultiplier: 1.8,
            production: { credits: 5 },
            productionPerLevel: { credits: 3 },
            workers: 1,
            unlockTech: null
        },
        geothermal_plant: {
            id: 'geothermal_plant', name: 'Geothermal Plant', icon: '🌋', category: 'production',
            desc: 'Taps into the planet core for massive energy output.',
            maxLevel: 3,
            baseCost: { credits: 200, minerals: 150 },
            costMultiplier: 2.0,
            production: { energy: 20 },
            productionPerLevel: { energy: 10 },
            workers: 3,
            unlockTech: 'geothermal_tech'
        },
        deep_mine: {
            id: 'deep_mine', name: 'Deep Core Mine', icon: '🕳️', category: 'production',
            desc: 'Reaches deep mineral veins for exceptional output.',
            maxLevel: 3,
            baseCost: { credits: 180, energy: 60 },
            costMultiplier: 2.0,
            production: { minerals: 15 },
            productionPerLevel: { minerals: 8 },
            workers: 4,
            unlockTech: 'deep_drilling'
        },

        // --- Housing ---
        habitat_dome: {
            id: 'habitat_dome', name: 'Habitat Dome', icon: '🏠', category: 'housing',
            desc: 'Spacious living quarters for colonists under a protective dome.',
            maxLevel: 5,
            baseCost: { credits: 60, minerals: 40 },
            costMultiplier: 1.4,
            production: {},
            housingCapacity: 10,
            housingPerLevel: 5,
            workers: 0,
            morale: 3,
            unlockTech: null
        },
        rec_center: {
            id: 'rec_center', name: 'Recreation Center', icon: '🎮', category: 'housing',
            desc: 'Entertainment and relaxation facility boosting colonist morale.',
            maxLevel: 3,
            baseCost: { credits: 80, minerals: 30, energy: 20 },
            costMultiplier: 1.6,
            production: {},
            workers: 1,
            morale: 10,
            moralePerLevel: 5,
            unlockTech: null
        },
        medical_bay: {
            id: 'medical_bay', name: 'Medical Bay', icon: '🏥', category: 'housing',
            desc: 'Ensures colonist health and enables population growth.',
            maxLevel: 3,
            baseCost: { credits: 100, minerals: 50, energy: 30 },
            costMultiplier: 1.6,
            production: {},
            workers: 2,
            morale: 5,
            growthBonus: 0.1,
            unlockTech: null
        },
        luxury_quarters: {
            id: 'luxury_quarters', name: 'Luxury Quarters', icon: '🏰', category: 'housing',
            desc: 'High-end housing for distinguished colonists.',
            maxLevel: 2,
            baseCost: { credits: 300, minerals: 100, energy: 50 },
            costMultiplier: 2.0,
            production: {},
            housingCapacity: 5,
            housingPerLevel: 3,
            workers: 0,
            morale: 20,
            moralePerLevel: 8,
            unlockTech: 'advanced_housing'
        },

        // --- Science ---
        research_lab: {
            id: 'research_lab', name: 'Research Lab', icon: '🔬', category: 'science',
            desc: 'Scientific facility where breakthroughs happen.',
            maxLevel: 5,
            baseCost: { credits: 80, minerals: 40, energy: 30 },
            costMultiplier: 1.5,
            production: { research: 3 },
            productionPerLevel: { research: 2 },
            workers: 2,
            unlockTech: null
        },
        observatory: {
            id: 'observatory', name: 'Observatory', icon: '🔭', category: 'science',
            desc: 'Studies the cosmos, unlocking deep space technologies.',
            maxLevel: 3,
            baseCost: { credits: 150, minerals: 60, energy: 50 },
            costMultiplier: 1.7,
            production: { research: 6 },
            productionPerLevel: { research: 4 },
            workers: 2,
            unlockTech: 'astronomy'
        },
        quantum_computer: {
            id: 'quantum_computer', name: 'Quantum Computer', icon: '💻', category: 'science',
            desc: 'Massively accelerates research computation.',
            maxLevel: 2,
            baseCost: { credits: 400, minerals: 200, energy: 100 },
            costMultiplier: 2.5,
            production: { research: 15 },
            productionPerLevel: { research: 10 },
            workers: 3,
            unlockTech: 'quantum_computing'
        },

        // --- Military ---
        defense_grid: {
            id: 'defense_grid', name: 'Defense Grid', icon: '🛡️', category: 'military',
            desc: 'Planetary defense system protecting from threats.',
            maxLevel: 3,
            baseCost: { credits: 120, minerals: 80, energy: 40 },
            costMultiplier: 1.7,
            production: {},
            defense: 10,
            defensePerLevel: 5,
            workers: 2,
            unlockTech: null
        },
        barracks: {
            id: 'barracks', name: 'Barracks', icon: '⚔️', category: 'military',
            desc: 'Training facility for colony security forces.',
            maxLevel: 3,
            baseCost: { credits: 100, minerals: 60 },
            costMultiplier: 1.6,
            production: {},
            defense: 15,
            defensePerLevel: 8,
            workers: 3,
            morale: -2,
            unlockTech: 'military_training'
        },
        shield_gen: {
            id: 'shield_gen', name: 'Shield Generator', icon: '🔮', category: 'military',
            desc: 'Energy shield protecting the colony from orbital threats.',
            maxLevel: 2,
            baseCost: { credits: 350, minerals: 150, energy: 100 },
            costMultiplier: 2.2,
            production: {},
            defense: 30,
            defensePerLevel: 15,
            workers: 2,
            unlockTech: 'energy_shields'
        },

        // --- Special ---
        spaceport: {
            id: 'spaceport', name: 'Spaceport', icon: '🚀', category: 'special',
            desc: 'Enables galactic trade and interstellar travel.',
            maxLevel: 3,
            baseCost: { credits: 200, minerals: 120, energy: 60 },
            costMultiplier: 2.0,
            production: { credits: 8 },
            productionPerLevel: { credits: 5 },
            workers: 3,
            tradeBonus: 0.1,
            unlockTech: 'space_travel'
        },
        terraformer: {
            id: 'terraformer', name: 'Terraformer', icon: '🌍', category: 'special',
            desc: 'Modifies planetary environment for better habitability.',
            maxLevel: 2,
            baseCost: { credits: 500, minerals: 300, energy: 200 },
            costMultiplier: 3.0,
            production: { food: 10 },
            productionPerLevel: { food: 8 },
            workers: 4,
            morale: 15,
            unlockTech: 'terraforming'
        }
    },

    // Technology definitions
    technologies: {
        // Era 1 — Foundation
        basic_engineering: {
            id: 'basic_engineering', name: 'Basic Engineering', icon: '🔧', era: 1,
            desc: 'Foundational construction techniques.',
            cost: 20, prerequisites: [],
            effects: 'All buildings cost 10% less minerals'
        },
        agriculture: {
            id: 'agriculture', name: 'Advanced Agriculture', icon: '🌾', era: 1,
            desc: 'Improved crop yields and farming methods.',
            cost: 25, prerequisites: [],
            effects: 'Food production +20%'
        },
        astronomy: {
            id: 'astronomy', name: 'Astronomy', icon: '🔭', era: 1,
            desc: 'Study of celestial bodies and phenomena.',
            cost: 30, prerequisites: [],
            effects: 'Unlocks Observatory'
        },
        military_training: {
            id: 'military_training', name: 'Military Training', icon: '⚔️', era: 1,
            desc: 'Organized defense force training.',
            cost: 25, prerequisites: [],
            effects: 'Unlocks Barracks'
        },

        // Era 2 — Expansion
        geothermal_tech: {
            id: 'geothermal_tech', name: 'Geothermal Energy', icon: '🌋', era: 2,
            desc: 'Harness the planet\'s internal heat.',
            cost: 50, prerequisites: ['basic_engineering'],
            effects: 'Unlocks Geothermal Plant'
        },
        deep_drilling: {
            id: 'deep_drilling', name: 'Deep Drilling', icon: '🕳️', era: 2,
            desc: 'Access deep mineral deposits.',
            cost: 55, prerequisites: ['basic_engineering'],
            effects: 'Unlocks Deep Core Mine'
        },
        advanced_housing: {
            id: 'advanced_housing', name: 'Advanced Housing', icon: '🏰', era: 2,
            desc: 'Luxury living solutions for colonists.',
            cost: 45, prerequisites: ['basic_engineering'],
            effects: 'Unlocks Luxury Quarters'
        },
        space_travel: {
            id: 'space_travel', name: 'Space Travel', icon: '🚀', era: 2,
            desc: 'Develop spacecraft for interplanetary journeys.',
            cost: 60, prerequisites: ['astronomy'],
            effects: 'Unlocks Spaceport'
        },
        energy_shields: {
            id: 'energy_shields', name: 'Energy Shields', icon: '🔮', era: 2,
            desc: 'Projected energy barrier technology.',
            cost: 55, prerequisites: ['military_training'],
            effects: 'Unlocks Shield Generator'
        },
        trade_networks: {
            id: 'trade_networks', name: 'Trade Networks', icon: '🌐', era: 2,
            desc: 'Establish trade routes with other colonies.',
            cost: 40, prerequisites: ['space_travel'],
            effects: 'Trade prices improved by 15%'
        },

        // Era 3 — Mastery
        quantum_computing: {
            id: 'quantum_computing', name: 'Quantum Computing', icon: '💻', era: 3,
            desc: 'Computational power beyond classical limits.',
            cost: 100, prerequisites: ['astronomy', 'geothermal_tech'],
            effects: 'Unlocks Quantum Computer'
        },
        terraforming: {
            id: 'terraforming', name: 'Terraforming', icon: '🌍', era: 3,
            desc: 'Reshape entire planets to suit colonist needs.',
            cost: 120, prerequisites: ['deep_drilling', 'agriculture'],
            effects: 'Unlocks Terraformer'
        },
        fusion_power: {
            id: 'fusion_power', name: 'Fusion Power', icon: '⚛️', era: 3,
            desc: 'Limitless clean energy from atomic fusion.',
            cost: 90, prerequisites: ['geothermal_tech'],
            effects: 'Energy production +50%'
        },
        genetic_engineering: {
            id: 'genetic_engineering', name: 'Genetic Engineering', icon: '🧬', era: 3,
            desc: 'Modify organisms for optimal growth.',
            cost: 80, prerequisites: ['agriculture'],
            effects: 'Population growth +30%, Food production +25%'
        },
        ai_governance: {
            id: 'ai_governance', name: 'AI Governance', icon: '🤖', era: 3,
            desc: 'AI-assisted colony management.',
            cost: 110, prerequisites: ['quantum_computing'],
            effects: 'All production +15%, Morale +10'
        },
        galactic_embassy: {
            id: 'galactic_embassy', name: 'Galactic Embassy', icon: '🏛️', era: 3,
            desc: 'Diplomatic center for interstellar relations.',
            cost: 100, prerequisites: ['trade_networks'],
            effects: 'Trade prices improved by 25%, Unlocks special missions'
        }
    },

    // Event definitions
    events: [
        {
            id: 'meteor_shower',
            title: 'Meteor Shower Detected!',
            icon: '☄️',
            description: 'Long-range sensors detect an incoming meteor shower heading toward the colony. What are your orders, Governor?',
            minTurn: 3,
            probability: 0.08,
            choices: [
                {
                    text: 'Activate defense grid',
                    subtext: 'Costs 20 energy but prevents damage',
                    effects: { energy: -20 },
                    condition: (state) => state.resources.energy >= 20,
                    result: 'The defense grid intercepted all incoming meteors. Colony is safe!'
                },
                {
                    text: 'Evacuate to shelters',
                    subtext: 'Minor damage but everyone survives',
                    effects: { minerals: -15, morale: -5 },
                    result: 'The colony sustained minor damage but all colonists are safe.'
                },
                {
                    text: 'Mine the meteors!',
                    subtext: 'Risky but potentially rewarding',
                    effects: { minerals: 40, energy: -10 },
                    riskChance: 0.3,
                    riskEffects: { minerals: -20, morale: -10 },
                    result: 'Teams successfully harvested rare minerals from the meteor fragments!',
                    riskResult: 'The mining operation went wrong. Several structures were damaged.'
                }
            ]
        },
        {
            id: 'alien_signal',
            title: 'Alien Signal Intercepted',
            icon: '📡',
            description: 'The observatory has detected a repeating signal from deep space. It appears to be artificial in origin.',
            minTurn: 8,
            probability: 0.06,
            choices: [
                {
                    text: 'Respond to the signal',
                    subtext: 'Could lead to first contact or danger',
                    effects: { research: 20, credits: 30 },
                    riskChance: 0.2,
                    riskEffects: { morale: -15 },
                    result: 'The aliens turn out to be friendly traders! They share knowledge and credits.',
                    riskResult: 'The response triggered an ominous silence. Colonists are uneasy.'
                },
                {
                    text: 'Study the signal silently',
                    subtext: 'Safe research opportunity',
                    effects: { research: 15 },
                    result: 'Scientists decode parts of the signal, gaining valuable research data.'
                },
                {
                    text: 'Ignore it',
                    subtext: 'Play it safe',
                    effects: {},
                    result: 'The signal fades into static. Perhaps another time.'
                }
            ]
        },
        {
            id: 'plague',
            title: 'Disease Outbreak!',
            icon: '🦠',
            description: 'A mysterious illness is spreading through the colony. Quick action is needed!',
            minTurn: 5,
            probability: 0.07,
            choices: [
                {
                    text: 'Quarantine affected areas',
                    subtext: 'Slows production but contains spread',
                    effects: { morale: -8, food: -10 },
                    result: 'The quarantine was effective. The disease is contained.'
                },
                {
                    text: 'Develop a cure',
                    subtext: 'Expensive but best long-term solution',
                    effects: { credits: -40, research: -10 },
                    condition: (state) => state.resources.credits >= 40,
                    result: 'Scientists developed a cure! Morale has actually improved.',
                    bonusEffects: { morale: 10 }
                },
                {
                    text: 'Let nature take its course',
                    subtext: 'Dangerous but saves resources',
                    effects: {},
                    riskChance: 0.6,
                    riskEffects: { morale: -20, food: -20 },
                    result: 'The disease ran its course with minimal impact.',
                    riskResult: 'The epidemic devastated the colony. Morale and food supplies plummeted.'
                }
            ]
        },
        {
            id: 'trader_caravan',
            title: 'Trade Caravan Arrives',
            icon: '🚢',
            description: 'A merchant fleet from a distant system has arrived offering exclusive deals!',
            minTurn: 6,
            probability: 0.1,
            choices: [
                {
                    text: 'Buy supplies',
                    subtext: 'Spend 50 credits for food and minerals',
                    effects: { credits: -50, food: 30, minerals: 25 },
                    condition: (state) => state.resources.credits >= 50,
                    result: 'Excellent trade! The caravan delivered quality supplies.'
                },
                {
                    text: 'Sell excess resources',
                    subtext: 'Sell 30 food and 20 minerals for credits',
                    effects: { food: -30, minerals: -20, credits: 80 },
                    condition: (state) => state.resources.food >= 30 && state.resources.minerals >= 20,
                    result: 'A profitable exchange! Your coffers are fuller.'
                },
                {
                    text: 'Request tech exchange',
                    subtext: 'Trade 60 credits for research points',
                    effects: { credits: -60, research: 25 },
                    condition: (state) => state.resources.credits >= 60,
                    result: 'The merchants shared some valuable technical data.'
                },
                {
                    text: 'Send them away',
                    subtext: 'No trade today',
                    effects: {},
                    result: 'The caravan departs. Maybe next time.'
                }
            ]
        },
        {
            id: 'solar_storm',
            title: 'Solar Storm Warning!',
            icon: '🌞',
            description: 'A massive solar storm is approaching. It could disrupt energy systems.',
            minTurn: 4,
            probability: 0.08,
            choices: [
                {
                    text: 'Power down non-essentials',
                    subtext: 'Reduce impact but lose production',
                    effects: { energy: -15, morale: -3 },
                    result: 'Systems powered down safely. Minimal damage sustained.'
                },
                {
                    text: 'Boost shield arrays',
                    subtext: 'Costs minerals but protects energy',
                    effects: { minerals: -20 },
                    condition: (state) => state.resources.minerals >= 20,
                    result: 'Shield arrays held against the storm! A spectacular light show for the colony.'
                },
                {
                    text: 'Ride it out',
                    subtext: 'Free but risky',
                    effects: {},
                    riskChance: 0.5,
                    riskEffects: { energy: -30, morale: -5 },
                    result: 'Lucky! The storm passed without major incident.',
                    riskResult: 'The storm overloaded power systems. Significant energy lost.'
                }
            ]
        },
        {
            id: 'refugee_ship',
            title: 'Refugee Ship Detected',
            icon: '🛸',
            description: 'A damaged ship carrying refugees from a destroyed colony requests permission to land.',
            minTurn: 10,
            probability: 0.06,
            choices: [
                {
                    text: 'Welcome them',
                    subtext: 'Gain population but need food/housing',
                    effects: { food: -25, morale: 8 },
                    bonusEffects: { population: 5 },
                    result: 'The refugees are grateful. New skilled workers join the colony!'
                },
                {
                    text: 'Accept selectively',
                    subtext: 'Take skilled workers only',
                    effects: { food: -10, morale: 2 },
                    bonusEffects: { population: 2, research: 10 },
                    result: 'Selected refugees bring specialized technical skills.'
                },
                {
                    text: 'Turn them away',
                    subtext: 'Save resources but hurt morale',
                    effects: { morale: -12 },
                    result: 'The ship limps away. Some colonists question the decision.'
                }
            ]
        },
        {
            id: 'mineral_deposit',
            title: 'Rich Mineral Deposit Found!',
            icon: '💎',
            description: 'Geological surveys have uncovered a rich vein of rare minerals!',
            minTurn: 4,
            probability: 0.09,
            choices: [
                {
                    text: 'Full-scale mining operation',
                    subtext: 'Costs energy but yields big',
                    effects: { energy: -15, minerals: 60 },
                    result: 'The mining operation was a huge success!'
                },
                {
                    text: 'Careful extraction',
                    subtext: 'Slower but safer approach',
                    effects: { minerals: 30 },
                    result: 'Careful mining yielded a solid haul of minerals.'
                }
            ]
        },
        {
            id: 'festival',
            title: 'Colony Anniversary',
            icon: '🎉',
            description: 'It\'s the anniversary of the colony founding! The colonists want to celebrate.',
            minTurn: 12,
            probability: 0.1,
            choices: [
                {
                    text: 'Grand celebration',
                    subtext: 'Costs credits and food but boosts morale',
                    effects: { credits: -30, food: -20, morale: 25 },
                    condition: (state) => state.resources.credits >= 30 && state.resources.food >= 20,
                    result: 'A magnificent celebration! The colony is buzzing with joy.'
                },
                {
                    text: 'Modest gathering',
                    subtext: 'Small cost, small morale boost',
                    effects: { food: -10, morale: 10 },
                    result: 'A nice gathering. Colonists appreciate the recognition.'
                },
                {
                    text: 'Skip it',
                    subtext: 'Save resources, slight morale hit',
                    effects: { morale: -5 },
                    result: 'Work continues as usual. Some colonists are disappointed.'
                }
            ]
        },
        {
            id: 'pirate_raid',
            title: 'Pirate Raiders Approaching!',
            icon: '🏴‍☠️',
            description: 'A pirate fleet has been spotted heading toward the colony!',
            minTurn: 8,
            probability: 0.07,
            choices: [
                {
                    text: 'Fight them off',
                    subtext: 'Uses energy. Better defense = better odds',
                    effects: { energy: -25 },
                    defenseCheck: true,
                    result: 'Colony defenses repelled the pirates!',
                    riskResult: 'The pirates overwhelmed our defenses and stole resources.',
                    riskEffects: { credits: -40, minerals: -20, morale: -10 }
                },
                {
                    text: 'Pay tribute',
                    subtext: 'Give credits to avoid conflict',
                    effects: { credits: -60 },
                    condition: (state) => state.resources.credits >= 60,
                    result: 'The pirates accepted the tribute and left peacefully.'
                },
                {
                    text: 'Hide and wait',
                    subtext: 'Hope they pass by',
                    effects: {},
                    riskChance: 0.4,
                    riskEffects: { credits: -30, food: -15, morale: -8 },
                    result: 'The pirates didn\'t notice the colony. Lucky!',
                    riskResult: 'The pirates found the colony and ransacked outlying facilities.'
                }
            ]
        },
        {
            id: 'scientific_breakthrough',
            title: 'Scientific Breakthrough!',
            icon: '💡',
            description: 'Your research teams report an unexpected discovery!',
            minTurn: 7,
            probability: 0.06,
            choices: [
                {
                    text: 'Invest in developing the discovery',
                    subtext: 'Spend credits for major research boost',
                    effects: { credits: -30, research: 35 },
                    condition: (state) => state.resources.credits >= 30,
                    result: 'The investment paid off! A major leap in scientific understanding.'
                },
                {
                    text: 'Publish findings freely',
                    subtext: 'Gain research and morale',
                    effects: { research: 20, morale: 5 },
                    result: 'The open publication boosted morale and advanced research.'
                }
            ]
        }
    ],

    // Mission definitions
    missions: [
        {
            id: 'first_steps',
            title: 'First Steps',
            icon: '👣',
            description: 'Build your first three buildings to establish the colony.',
            type: 'build',
            target: 3,
            check: (state) => state.stats.totalBuildings >= 3,
            reward: { credits: 100 },
            autoStart: true
        },
        {
            id: 'power_up',
            title: 'Power Up',
            icon: '⚡',
            description: 'Generate at least 20 energy per turn.',
            type: 'production',
            target: 20,
            check: (state) => state.rates.energy >= 20,
            progress: (state) => state.rates.energy,
            reward: { credits: 80, minerals: 40 },
            autoStart: true
        },
        {
            id: 'growing_colony',
            title: 'Growing Colony',
            icon: '👥',
            description: 'Reach a population of 30 colonists.',
            type: 'population',
            target: 30,
            check: (state) => state.population.current >= 30,
            progress: (state) => state.population.current,
            reward: { credits: 120, food: 60 }
        },
        {
            id: 'research_pioneer',
            title: 'Research Pioneer',
            icon: '🔬',
            description: 'Complete your first technology research.',
            type: 'research',
            target: 1,
            check: (state) => state.stats.techsResearched >= 1,
            reward: { research: 20, credits: 50 }
        },
        {
            id: 'mineral_magnate',
            title: 'Mineral Magnate',
            icon: '💎',
            description: 'Accumulate 500 minerals.',
            type: 'resource',
            target: 500,
            check: (state) => state.resources.minerals >= 500,
            progress: (state) => state.resources.minerals,
            reward: { credits: 200 }
        },
        {
            id: 'food_surplus',
            title: 'Food Surplus',
            icon: '🌾',
            description: 'Produce at least 30 food per turn.',
            type: 'production',
            target: 30,
            check: (state) => state.rates.food >= 30,
            progress: (state) => state.rates.food,
            reward: { credits: 100, morale: 10 }
        },
        {
            id: 'fortified',
            title: 'Fortified Colony',
            icon: '🛡️',
            description: 'Reach a defense rating of 30.',
            type: 'defense',
            target: 30,
            check: (state) => state.stats.defense >= 30,
            progress: (state) => state.stats.defense,
            reward: { credits: 150, minerals: 80 }
        },
        {
            id: 'tech_era2',
            title: 'Into the Future',
            icon: '🚀',
            description: 'Research 4 technologies.',
            type: 'research',
            target: 4,
            check: (state) => state.stats.techsResearched >= 4,
            progress: (state) => state.stats.techsResearched,
            reward: { credits: 200, research: 50 }
        },
        {
            id: 'trade_master',
            title: 'Trade Master',
            icon: '📊',
            description: 'Complete 5 trades in the galactic market.',
            type: 'trade',
            target: 5,
            check: (state) => state.stats.tradesCompleted >= 5,
            progress: (state) => state.stats.tradesCompleted,
            reward: { credits: 300 }
        },
        {
            id: 'morale_high',
            title: 'Happy Colony',
            icon: '😊',
            description: 'Reach and maintain 90% morale.',
            type: 'morale',
            target: 90,
            check: (state) => state.population.morale >= 90,
            progress: (state) => state.population.morale,
            reward: { credits: 150, food: 50 }
        },
        {
            id: 'megastructure',
            title: 'Megastructure',
            icon: '🏗️',
            description: 'Upgrade any building to level 5.',
            type: 'build',
            target: 5,
            check: (state) => Object.values(state.buildings).some(b => b.level >= 5),
            reward: { credits: 300, minerals: 150, research: 30 }
        },
        {
            id: 'galactic_power',
            title: 'Galactic Power',
            icon: '✦',
            description: 'Research 10 technologies and reach colony level 5.',
            type: 'endgame',
            target: 10,
            check: (state) => state.stats.techsResearched >= 10 && state.stats.colonyLevel >= 5,
            progress: (state) => state.stats.techsResearched,
            reward: { credits: 1000, morale: 20 }
        }
    ],

    // Advisor messages
    advisorMessages: {
        scientist: {
            avatar: '👩‍🔬',
            name: 'Dr. Nova — Chief Scientist',
            messages: {
                noLab: 'We need a Research Lab to begin scientific work.',
                lowResearch: 'Our research output is low. Consider building more labs.',
                highResearch: 'Excellent research output! We\'re making great strides.',
                noResearch: 'No active research project. We should start one!',
                default: 'Science continues to progress.'
            }
        },
        engineer: {
            avatar: '👨‍🔧',
            name: 'Chief Engineer Rex',
            messages: {
                lowEnergy: 'Energy supplies are dangerously low! Build more power plants.',
                lowMinerals: 'We\'re running low on minerals for construction.',
                highProduction: 'Production is running smoothly across all sectors.',
                noBuildings: 'We should start building infrastructure immediately.',
                default: 'All systems operational, Governor.'
            }
        },
        diplomat: {
            avatar: '👩‍💼',
            name: 'Ambassador Lyra',
            messages: {
                noTrade: 'Building a Spaceport would open up trade possibilities.',
                lowCredits: 'Our credit reserves are concerning. We need more income.',
                highCredits: 'Our financial position is strong and stable.',
                default: 'Diplomatic channels remain open.'
            }
        }
    },

    // Colony level thresholds
    colonyLevelThresholds: [0, 5, 12, 22, 35, 50],

    // Market base prices
    marketBasePrices: {
        energy: 3,
        minerals: 5,
        food: 4,
        research: 8
    }
};
