/* ========================================
   GALACTIC NEXUS — Resource Management
   ======================================== */

const ResourceManager = {
    // Calculate all production rates
    calculateRates(state) {
        const rates = { energy: 0, minerals: 0, food: 0, credits: 0, research: 0 };
        const season = Utils.getSeason(state.turn);
        const seasonEffect = GAME_DATA.seasonEffects[season];
        const planetBonus = GAME_DATA.planetBonuses[state.planetType];

        // Base production from buildings
        for (const [buildingId, buildingState] of Object.entries(state.buildings)) {
            if (buildingState.level <= 0) continue;
            const def = GAME_DATA.buildings[buildingId];
            if (!def || !def.production) continue;

            for (const [res, base] of Object.entries(def.production)) {
                const perLevel = (def.productionPerLevel && def.productionPerLevel[res]) || 0;
                let prod = base + perLevel * (buildingState.level - 1);

                // Apply worker efficiency
                const neededWorkers = def.workers * buildingState.level;
                const assignedWorkers = buildingState.workers || 0;
                if (neededWorkers > 0) {
                    const efficiency = Math.min(1, assignedWorkers / neededWorkers);
                    prod *= efficiency;
                }

                rates[res] += prod;
            }
        }

        // Apply season modifiers
        rates.energy *= (seasonEffect.energy || 1);
        rates.minerals *= (seasonEffect.minerals || 1);
        rates.food *= (seasonEffect.food || 1);

        // Apply planet bonuses
        rates.energy *= (planetBonus.energy || 1);
        rates.minerals *= (planetBonus.minerals || 1);
        rates.food *= (planetBonus.food || 1);
        rates.research *= (planetBonus.research || 1);

        // Apply tech bonuses
        if (state.techsResearched.includes('agriculture')) {
            rates.food *= 1.2;
        }
        if (state.techsResearched.includes('fusion_power')) {
            rates.energy *= 1.5;
        }
        if (state.techsResearched.includes('genetic_engineering')) {
            rates.food *= 1.25;
        }
        if (state.techsResearched.includes('ai_governance')) {
            rates.energy *= 1.15;
            rates.minerals *= 1.15;
            rates.food *= 1.15;
            rates.credits *= 1.15;
            rates.research *= 1.15;
        }

        // Population food consumption
        rates.food -= state.population.current * 0.5;

        // Round rates
        for (const key in rates) {
            rates[key] = Math.round(rates[key] * 10) / 10;
        }

        state.rates = rates;
        return rates;
    },

    // Apply production to resources (called each turn)
    applyProduction(state) {
        const rates = this.calculateRates(state);

        for (const [res, rate] of Object.entries(rates)) {
            state.resources[res] = Math.max(0, (state.resources[res] || 0) + rate);
        }

        // Check food shortage
        if (state.resources.food <= 0) {
            state.resources.food = 0;
            state.population.morale -= 10;
            Utils.toast('⚠️ Food shortage! Morale dropping!', 'warning');
        }

        // Check energy shortage
        if (state.resources.energy <= 0) {
            state.resources.energy = 0;
            Utils.toast('⚠️ Energy depleted! Systems failing!', 'warning');
        }

        return rates;
    },

    // Update UI display
    updateDisplay(state) {
        const rates = state.rates || {};

        // Update resource values
        for (const res of Object.keys(GAME_DATA.resources)) {
            const valEl = Utils.$(`res-${res}`);
            const rateEl = Utils.$(`rate-${res}`);
            if (valEl) {
                const oldVal = parseInt(valEl.textContent.replace(/,/g, '')) || 0;
                const newVal = Math.floor(state.resources[res] || 0);
                valEl.textContent = Utils.formatNumber(newVal);
                if (newVal !== oldVal) {
                    Utils.animateElement(valEl, 'animate-resource-flash');
                }
            }
            if (rateEl) {
                const rate = rates[res] || 0;
                rateEl.textContent = Utils.formatRate(rate);
                rateEl.className = `res-rate ${rate >= 0 ? 'positive' : 'negative'}`;
            }
        }
    },

    // Record resource history for chart
    recordHistory(state) {
        if (!state.resourceHistory) state.resourceHistory = [];
        state.resourceHistory.push({
            turn: state.turn,
            energy: Math.floor(state.resources.energy),
            minerals: Math.floor(state.resources.minerals),
            food: Math.floor(state.resources.food),
            credits: Math.floor(state.resources.credits)
        });
        // Keep last 20 turns
        if (state.resourceHistory.length > 20) {
            state.resourceHistory.shift();
        }
    },

    // Draw resource trend chart
    drawChart(state) {
        const canvas = Utils.$('resource-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = 200;
        ctx.clearRect(0, 0, w, h);

        const history = state.resourceHistory || [];
        if (history.length < 2) {
            ctx.fillStyle = '#64748b';
            ctx.font = '14px Rajdhani';
            ctx.textAlign = 'center';
            ctx.fillText('Collecting data...', w / 2, h / 2);
            return;
        }

        const resources = ['energy', 'minerals', 'food', 'credits'];
        const colors = ['#f59e0b', '#a855f7', '#10b981', '#f97316'];
        const padding = 30;
        const chartW = w - padding * 2;
        const chartH = h - padding * 2;

        // Find max value
        let maxVal = 10;
        for (const entry of history) {
            for (const res of resources) {
                if (entry[res] > maxVal) maxVal = entry[res];
            }
        }
        maxVal *= 1.1;

        // Draw grid
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(w - padding, y);
            ctx.stroke();
        }

        // Draw lines
        resources.forEach((res, ri) => {
            ctx.strokeStyle = colors[ri];
            ctx.lineWidth = 2;
            ctx.beginPath();
            history.forEach((entry, i) => {
                const x = padding + (chartW / (history.length - 1)) * i;
                const y = padding + chartH - (entry[res] / maxVal) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Glow effect
            ctx.strokeStyle = colors[ri] + '40';
            ctx.lineWidth = 6;
            ctx.beginPath();
            history.forEach((entry, i) => {
                const x = padding + (chartW / (history.length - 1)) * i;
                const y = padding + chartH - (entry[res] / maxVal) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });

        // Draw legend
        ctx.font = '11px Share Tech Mono';
        resources.forEach((res, ri) => {
            const x = padding + ri * 80;
            ctx.fillStyle = colors[ri];
            ctx.fillRect(x, h - 15, 12, 3);
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'left';
            ctx.fillText(res.charAt(0).toUpperCase() + res.slice(1), x + 16, h - 10);
        });
    }
};
