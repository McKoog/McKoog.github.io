/* ========================================
   GALACTIC NEXUS — Population Management
   ======================================== */

const PopulationManager = {
    // Calculate population growth
    processGrowth(state) {
        const morale = state.population.morale;
        const food = state.resources.food;
        const maxPop = BuildingManager.getTotalHousing(state);
        const current = state.population.current;

        // Growth rate based on morale and food
        let growthRate = 0;
        if (food > current * 2 && current < maxPop) {
            growthRate = 0.05; // base 5% growth
            if (morale >= 80) growthRate += 0.03;
            if (morale >= 60) growthRate += 0.02;

            // Medical bay bonus
            for (const [id, bState] of Object.entries(state.buildings)) {
                const def = GAME_DATA.buildings[id];
                if (def && def.growthBonus && bState.level > 0) {
                    growthRate += def.growthBonus * bState.level;
                }
            }

            // Genetic engineering bonus
            if (state.techsResearched.includes('genetic_engineering')) {
                growthRate *= 1.3;
            }
        } else if (food <= 0) {
            growthRate = -0.05; // starvation
        }

        // Apply growth
        if (growthRate > 0) {
            state.population.growthProgress += growthRate * current;
            if (state.population.growthProgress >= 1 && current < maxPop) {
                const newPop = Math.min(Math.floor(state.population.growthProgress), maxPop - current);
                state.population.current += newPop;
                state.population.growthProgress -= newPop;
                if (newPop > 0) {
                    GameUI.addLogEntry(`+${newPop} new colonist${newPop > 1 ? 's' : ''} arrived!`, 'success', state.turn);
                }
            }
        } else if (growthRate < 0) {
            state.population.current = Math.max(1, current + Math.ceil(growthRate * current));
        }

        state.population.maxPop = maxPop;
    },

    // Calculate morale
    calculateMorale(state) {
        let morale = 50; // base morale

        // Building morale
        morale += BuildingManager.getBuildingMorale(state);

        // Season effect
        const season = Utils.getSeason(state.turn);
        morale += GAME_DATA.seasonEffects[season].morale || 0;

        // Food surplus/deficit
        const foodRate = state.rates.food || 0;
        if (foodRate > 5) morale += 5;
        else if (foodRate > 0) morale += 2;
        else if (foodRate < 0) morale -= 10;

        // Overcrowding
        const maxPop = BuildingManager.getTotalHousing(state);
        if (state.population.current > maxPop * 0.9) {
            morale -= 10;
        }

        // Low energy
        if (state.resources.energy < 20) morale -= 5;

        // AI governance bonus
        if (state.techsResearched.includes('ai_governance')) morale += 10;

        // Apply morale modifiers from events
        morale += (state.population.moraleModifier || 0);

        // Clamp
        state.population.morale = Utils.clamp(Math.round(morale), 0, 100);

        // Decay morale modifier back to 0
        if (state.population.moraleModifier > 0) {
            state.population.moraleModifier = Math.max(0, state.population.moraleModifier - 1);
        } else if (state.population.moraleModifier < 0) {
            state.population.moraleModifier = Math.min(0, state.population.moraleModifier + 1);
        }
    },

    // Get free (unassigned) workers
    getFreeWorkers(state) {
        const total = state.population.current;
        const assigned = BuildingManager.getTotalAssignedWorkers(state);
        return Math.max(0, total - assigned);
    },

    // Auto-assign workers to buildings
    autoAssign(state) {
        // First, reset all workers
        for (const bState of Object.values(state.buildings)) {
            bState.workers = 0;
        }

        let available = state.population.current;

        // Priority: production buildings first, then others
        const priorityOrder = ['production', 'science', 'special', 'military', 'housing'];

        for (const cat of priorityOrder) {
            for (const [id, bState] of Object.entries(state.buildings)) {
                if (bState.level <= 0 || available <= 0) continue;
                const def = GAME_DATA.buildings[id];
                if (!def || def.category !== cat || def.workers <= 0) continue;

                const needed = def.workers * bState.level;
                const assign = Math.min(needed, available);
                bState.workers = assign;
                available -= assign;
            }
        }

        Utils.toast('🤖 Workers auto-assigned!', 'success');
        ResourceManager.calculateRates(state);
        ResourceManager.updateDisplay(state);
        this.updatePopulationUI(state);
        BuildingManager.renderBuildings(state);
    },

    // Update population UI
    updatePopulationUI(state) {
        // Top bar
        const popCurrent = Utils.$('pop-current');
        const popMax = Utils.$('pop-max');
        const moraleVal = Utils.$('morale-value');
        const moraleIcon = document.querySelector('.morale-icon');

        const maxPop = BuildingManager.getTotalHousing(state);
        if (popCurrent) popCurrent.textContent = state.population.current;
        if (popMax) popMax.textContent = maxPop;
        if (moraleVal) moraleVal.textContent = state.population.morale;

        // Morale emoji
        if (moraleIcon) {
            if (state.population.morale >= 80) moraleIcon.textContent = '😊';
            else if (state.population.morale >= 60) moraleIcon.textContent = '🙂';
            else if (state.population.morale >= 40) moraleIcon.textContent = '😐';
            else if (state.population.morale >= 20) moraleIcon.textContent = '😟';
            else moraleIcon.textContent = '😢';
        }

        // Population panel stats
        const popStats = Utils.$('pop-stats');
        if (popStats) {
            const freeWorkers = this.getFreeWorkers(state);
            const assignedWorkers = BuildingManager.getTotalAssignedWorkers(state);
            popStats.innerHTML = `
                <div class="pop-stat-item">
                    <span class="pop-stat-label">Total Population</span>
                    <span class="pop-stat-value">${state.population.current}</span>
                </div>
                <div class="pop-stat-item">
                    <span class="pop-stat-label">Housing Capacity</span>
                    <span class="pop-stat-value">${maxPop}</span>
                </div>
                <div class="pop-stat-item">
                    <span class="pop-stat-label">Assigned Workers</span>
                    <span class="pop-stat-value">${assignedWorkers}</span>
                </div>
                <div class="pop-stat-item">
                    <span class="pop-stat-label">Free Workers</span>
                    <span class="pop-stat-value" style="color:${freeWorkers > 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}">${freeWorkers}</span>
                </div>
            `;
        }

        // Workforce slots
        const slotsContainer = Utils.$('workforce-slots');
        if (slotsContainer) {
            slotsContainer.innerHTML = '';
            for (const [id, bState] of Object.entries(state.buildings)) {
                if (bState.level <= 0) continue;
                const def = GAME_DATA.buildings[id];
                if (!def || def.workers <= 0) continue;

                const needed = def.workers * bState.level;
                const slot = document.createElement('div');
                slot.className = 'workforce-slot';
                slot.innerHTML = `
                    <div class="workforce-slot-info">
                        <span class="workforce-slot-icon">${def.icon}</span>
                        <span class="workforce-slot-name">${def.name} (Lv.${bState.level})</span>
                    </div>
                    <div class="workforce-slot-controls">
                        <button class="worker-minus" data-building="${id}">−</button>
                        <span class="workforce-count" style="color:${bState.workers >= needed ? 'var(--accent-emerald)' : 'var(--accent-amber)'}">${bState.workers}/${needed}</span>
                        <button class="worker-plus" data-building="${id}">+</button>
                    </div>
                `;
                slotsContainer.appendChild(slot);
            }

            // Event listeners
            slotsContainer.querySelectorAll('.worker-minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.building;
                    if (state.buildings[id].workers > 0) {
                        state.buildings[id].workers--;
                        ResourceManager.calculateRates(state);
                        ResourceManager.updateDisplay(state);
                        this.updatePopulationUI(state);
                    }
                });
            });

            slotsContainer.querySelectorAll('.worker-plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.building;
                    const def = GAME_DATA.buildings[id];
                    const needed = def.workers * state.buildings[id].level;
                    if (state.buildings[id].workers < needed && this.getFreeWorkers(state) > 0) {
                        state.buildings[id].workers++;
                        ResourceManager.calculateRates(state);
                        ResourceManager.updateDisplay(state);
                        this.updatePopulationUI(state);
                    }
                });
            });
        }

        // Morale factors
        const moraleFactors = Utils.$('morale-factors');
        if (moraleFactors) {
            const factors = this.getMoraleFactors(state);
            moraleFactors.innerHTML = factors.map(f => `
                <div class="morale-factor">
                    <span class="morale-factor-name">${f.name}</span>
                    <span class="morale-factor-value ${f.value >= 0 ? 'positive' : 'negative'}">${f.value >= 0 ? '+' : ''}${f.value}</span>
                </div>
            `).join('');
        }

        // Growth forecast
        const growthForecast = Utils.$('growth-forecast');
        if (growthForecast) {
            const food = state.resources.food;
            const foodRate = state.rates.food || 0;
            const housingPct = Math.round((state.population.current / maxPop) * 100);

            let growthStatus = 'Stable';
            let growthColor = 'var(--text-secondary)';
            if (foodRate > 5 && state.population.current < maxPop && state.population.morale >= 40) {
                growthStatus = 'Growing';
                growthColor = 'var(--accent-emerald)';
            } else if (food <= 0) {
                growthStatus = 'Declining (Starvation!)';
                growthColor = 'var(--accent-red)';
            } else if (state.population.current >= maxPop) {
                growthStatus = 'At capacity — need more housing';
                growthColor = 'var(--accent-amber)';
            }

            growthForecast.innerHTML = `
                <p>Status: <strong style="color:${growthColor}">${growthStatus}</strong></p>
                <p>Food supply: ${Math.floor(food)} (${Utils.formatRate(foodRate)}/turn)</p>
                <p>Housing: ${housingPct}% occupied</p>
                <div class="growth-bar">
                    <div class="growth-fill" style="width:${housingPct}%;background:${housingPct > 90 ? 'var(--accent-red)' : 'var(--gradient-nature)'}"></div>
                </div>
            `;
        }
    },

    // Get morale factors breakdown
    getMoraleFactors(state) {
        const factors = [{ name: 'Base Morale', value: 50 }];

        const buildingMorale = BuildingManager.getBuildingMorale(state);
        if (buildingMorale !== 0) factors.push({ name: 'Buildings', value: buildingMorale });

        const season = Utils.getSeason(state.turn);
        const seasonMorale = GAME_DATA.seasonEffects[season].morale || 0;
        if (seasonMorale !== 0) factors.push({ name: `Season (${season})`, value: seasonMorale });

        const foodRate = state.rates.food || 0;
        if (foodRate > 5) factors.push({ name: 'Food surplus', value: 5 });
        else if (foodRate > 0) factors.push({ name: 'Adequate food', value: 2 });
        else if (foodRate < 0) factors.push({ name: 'Food shortage', value: -10 });

        const maxPop = BuildingManager.getTotalHousing(state);
        if (state.population.current > maxPop * 0.9) factors.push({ name: 'Overcrowding', value: -10 });

        if (state.resources.energy < 20) factors.push({ name: 'Low energy', value: -5 });

        if (state.techsResearched.includes('ai_governance')) factors.push({ name: 'AI Governance', value: 10 });

        const mod = state.population.moraleModifier || 0;
        if (mod !== 0) factors.push({ name: 'Event effects', value: mod });

        return factors;
    }
};
