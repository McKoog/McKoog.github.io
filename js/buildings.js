/* ========================================
   GALACTIC NEXUS — Building System
   ======================================== */

const BuildingManager = {
    // Render all building cards
    renderBuildings(state) {
        const grid = Utils.$('buildings-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const filter = Utils.$('building-filter').value;

        Object.values(GAME_DATA.buildings).forEach((def, idx) => {
            if (filter !== 'all' && def.category !== filter) return;

            const bState = state.buildings[def.id] || { level: 0, workers: 0 };
            const isOwned = bState.level > 0;
            const isMaxLevel = bState.level >= def.maxLevel;
            const isLocked = def.unlockTech && !state.techsResearched.includes(def.unlockTech);

            const cost = Utils.calcBuildingCost(def, bState.level);
            const affordable = Utils.canAfford(state.resources, cost);

            const card = document.createElement('div');
            card.className = `building-card animate-card-appear stagger-${(idx % 8) + 1}`;
            if (isOwned) card.classList.add('owned');
            if (isLocked) card.classList.add('locked');

            // Build cost HTML
            let costHTML = '';
            for (const [res, amount] of Object.entries(cost)) {
                const resData = GAME_DATA.resources[res];
                const hasEnough = (state.resources[res] || 0) >= amount;
                costHTML += `<span class="cost-item ${hasEnough ? 'affordable' : 'expensive'}">${resData ? resData.icon : ''} ${Utils.formatNumber(amount)}</span>`;
            }

            // Build stats HTML
            let statsHTML = '';
            if (def.production) {
                for (const [res, val] of Object.entries(def.production)) {
                    const perLevel = (def.productionPerLevel && def.productionPerLevel[res]) || 0;
                    const totalProd = val + perLevel * Math.max(0, bState.level - 1);
                    const resData = GAME_DATA.resources[res];
                    statsHTML += `<span class="building-stat">${resData ? resData.icon : ''} +${totalProd}/turn</span>`;
                }
            }
            if (def.housingCapacity) {
                const totalHousing = def.housingCapacity + (def.housingPerLevel || 0) * Math.max(0, bState.level - 1);
                statsHTML += `<span class="building-stat">🏠 +${totalHousing} housing</span>`;
            }
            if (def.morale) {
                const totalMorale = def.morale + (def.moralePerLevel || 0) * Math.max(0, bState.level - 1);
                statsHTML += `<span class="building-stat">😊 +${totalMorale} morale</span>`;
            }
            if (def.defense) {
                const totalDef = def.defense + (def.defensePerLevel || 0) * Math.max(0, bState.level - 1);
                statsHTML += `<span class="building-stat">🛡️ +${totalDef} defense</span>`;
            }
            if (def.workers > 0) {
                const neededWorkers = def.workers * Math.max(1, bState.level);
                statsHTML += `<span class="building-stat">👷 ${isOwned ? `${bState.workers}/${neededWorkers}` : neededWorkers} workers</span>`;
            }

            card.innerHTML = `
                <div class="building-header">
                    <span class="building-icon">${def.icon}</span>
                    <div>
                        <span class="building-name">${def.name}</span>
                        ${isLocked ? '<small style="color: var(--accent-red); font-size:0.7rem">🔒 Locked</small>' : ''}
                    </div>
                    ${isOwned ? `<span class="building-level">Lv.${bState.level}</span>` : ''}
                </div>
                <p class="building-desc">${def.desc}</p>
                <div class="building-stats">${statsHTML}</div>
                <div class="building-cost">${isMaxLevel ? '<span style="color:var(--accent-emerald)">✓ Max Level</span>' : costHTML}</div>
                <div class="building-actions">
                    ${!isMaxLevel && !isLocked ? `<button class="btn btn-primary build-btn" data-building="${def.id}" ${!affordable ? 'disabled style="opacity:0.5"' : ''}>${isOwned ? '⬆ Upgrade' : '🔨 Build'}</button>` : ''}
                    ${isOwned && def.workers > 0 ? `<button class="btn btn-secondary assign-btn" data-building="${def.id}">👷 Workers</button>` : ''}
                </div>
            `;

            grid.appendChild(card);
        });

        // Event listeners
        grid.querySelectorAll('.build-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.building;
                this.buildOrUpgrade(id, state);
            });
        });

        grid.querySelectorAll('.assign-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.building;
                this.toggleWorkerAssignment(id, state);
            });
        });
    },

    // Build or upgrade a building
    buildOrUpgrade(buildingId, state) {
        const def = GAME_DATA.buildings[buildingId];
        if (!def) return;

        if (!state.buildings[buildingId]) {
            state.buildings[buildingId] = { level: 0, workers: 0 };
        }

        const bState = state.buildings[buildingId];
        if (bState.level >= def.maxLevel) return;

        const cost = Utils.calcBuildingCost(def, bState.level);
        if (!Utils.canAfford(state.resources, cost)) {
            Utils.toast('❌ Not enough resources!', 'error');
            return;
        }

        Utils.applyCost(state.resources, cost);
        bState.level++;

        // Auto-assign free workers
        if (def.workers > 0) {
            const freeWorkers = PopulationManager.getFreeWorkers(state);
            const needed = def.workers;
            const toAssign = Math.min(freeWorkers, needed);
            bState.workers = (bState.workers || 0) + toAssign;
        }

        state.stats.totalBuildings = this.countTotalBuildings(state);
        state.stats.colonyLevel = Utils.calcColonyLevel(state.stats.totalBuildings, state.stats.techsResearched);

        const action = bState.level === 1 ? 'Built' : 'Upgraded to Lv.' + bState.level;
        Utils.toast(`🏗️ ${action} ${def.name}!`, 'success');
        GameUI.addLogEntry(`${action} ${def.icon} ${def.name}`, 'success', state.turn);

        // Sound effect
        GameUI.playSound('build');

        // Refresh everything
        ResourceManager.calculateRates(state);
        ResourceManager.updateDisplay(state);
        this.renderBuildings(state);
        PopulationManager.updatePopulationUI(state);
        GameUI.updateOverview(state);
        MissionManager.checkMissions(state);
    },

    // Toggle worker assignment (simple +1 worker)
    toggleWorkerAssignment(buildingId, state) {
        const def = GAME_DATA.buildings[buildingId];
        const bState = state.buildings[buildingId];
        if (!def || !bState || bState.level <= 0) return;

        const freeWorkers = PopulationManager.getFreeWorkers(state);
        const maxWorkers = def.workers * bState.level;

        if (bState.workers < maxWorkers && freeWorkers > 0) {
            bState.workers++;
        } else if (bState.workers >= maxWorkers) {
            // Reset to 0 if at max
            bState.workers = 0;
        } else {
            Utils.toast('⚠️ No free workers available!', 'warning');
            return;
        }

        ResourceManager.calculateRates(state);
        ResourceManager.updateDisplay(state);
        this.renderBuildings(state);
        PopulationManager.updatePopulationUI(state);
    },

    // Count total building levels
    countTotalBuildings(state) {
        let count = 0;
        for (const bState of Object.values(state.buildings)) {
            count += bState.level || 0;
        }
        return count;
    },

    // Calculate total housing capacity
    getTotalHousing(state) {
        let housing = 20; // base housing
        for (const [id, bState] of Object.entries(state.buildings)) {
            if (bState.level <= 0) continue;
            const def = GAME_DATA.buildings[id];
            if (def && def.housingCapacity) {
                housing += def.housingCapacity + (def.housingPerLevel || 0) * (bState.level - 1);
            }
        }
        return housing;
    },

    // Calculate total defense
    getTotalDefense(state) {
        let defense = 0;
        for (const [id, bState] of Object.entries(state.buildings)) {
            if (bState.level <= 0) continue;
            const def = GAME_DATA.buildings[id];
            if (def && def.defense) {
                defense += def.defense + (def.defensePerLevel || 0) * (bState.level - 1);
            }
        }
        return defense;
    },

    // Calculate total morale from buildings
    getBuildingMorale(state) {
        let morale = 0;
        for (const [id, bState] of Object.entries(state.buildings)) {
            if (bState.level <= 0) continue;
            const def = GAME_DATA.buildings[id];
            if (def && def.morale) {
                morale += def.morale + (def.moralePerLevel || 0) * (bState.level - 1);
            }
        }
        return morale;
    },

    // Get total workers needed across all buildings
    getTotalWorkersNeeded(state) {
        let total = 0;
        for (const [id, bState] of Object.entries(state.buildings)) {
            if (bState.level <= 0) continue;
            const def = GAME_DATA.buildings[id];
            if (def && def.workers) {
                total += def.workers * bState.level;
            }
        }
        return total;
    },

    // Get total assigned workers
    getTotalAssignedWorkers(state) {
        let total = 0;
        for (const bState of Object.values(state.buildings)) {
            total += bState.workers || 0;
        }
        return total;
    }
};
