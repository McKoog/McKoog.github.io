/* ========================================
   GALACTIC NEXUS — Random Events System
   ======================================== */

const EventManager = {
    // Check and trigger events at the end of each turn
    checkEvents(state) {
        const eligibleEvents = GAME_DATA.events.filter(e => {
            if (state.turn < e.minTurn) return false;
            if (state.recentEvents && state.recentEvents.includes(e.id)) return false;
            return Math.random() < e.probability;
        });

        if (eligibleEvents.length > 0) {
            // Pick one random event
            const event = Utils.randFrom(eligibleEvents);
            this.triggerEvent(event, state);
        }
    },

    // Display event modal
    triggerEvent(event, state) {
        const modal = Utils.$('event-modal');
        const icon = Utils.$('event-icon');
        const title = Utils.$('event-title');
        const desc = Utils.$('event-description');
        const choicesContainer = Utils.$('event-choices');

        icon.textContent = event.icon;
        title.textContent = event.title;
        desc.textContent = event.description;

        choicesContainer.innerHTML = '';
        event.choices.forEach((choice, idx) => {
            const btn = document.createElement('button');
            btn.className = 'event-choice-btn';

            // Check if choice has conditions
            let disabled = false;
            if (choice.condition && !choice.condition(state)) {
                disabled = true;
            }

            btn.innerHTML = `
                <strong>${choice.text}</strong>
                <small>${choice.subtext}</small>
            `;

            if (disabled) {
                btn.style.opacity = '0.4';
                btn.style.pointerEvents = 'none';
                btn.innerHTML += '<small style="color:var(--accent-red)">Cannot afford</small>';
            }

            btn.addEventListener('click', () => {
                this.resolveChoice(event, choice, state);
                Utils.hide(modal);
            });

            choicesContainer.appendChild(btn);
        });

        Utils.show(modal);
        GameUI.playSound('event');

        // Track recent events
        if (!state.recentEvents) state.recentEvents = [];
        state.recentEvents.push(event.id);
        if (state.recentEvents.length > 5) state.recentEvents.shift();
    },

    // Resolve a player choice
    resolveChoice(event, choice, state) {
        let isRisk = false;

        // Check for defense-based risk
        if (choice.defenseCheck) {
            const defense = BuildingManager.getTotalDefense(state);
            const riskChance = Math.max(0.1, 0.7 - (defense / 100));
            isRisk = Math.random() < riskChance;
        } else if (choice.riskChance) {
            isRisk = Math.random() < choice.riskChance;
        }

        // Apply base effects
        if (choice.effects) {
            for (const [key, val] of Object.entries(choice.effects)) {
                if (key === 'morale') {
                    state.population.moraleModifier = (state.population.moraleModifier || 0) + val;
                } else if (state.resources[key] !== undefined) {
                    state.resources[key] = Math.max(0, state.resources[key] + val);
                }
            }
        }

        // Apply bonus effects
        if (choice.bonusEffects) {
            for (const [key, val] of Object.entries(choice.bonusEffects)) {
                if (key === 'population') {
                    const maxPop = BuildingManager.getTotalHousing(state);
                    state.population.current = Math.min(maxPop, state.population.current + val);
                } else if (key === 'morale') {
                    state.population.moraleModifier = (state.population.moraleModifier || 0) + val;
                } else if (state.resources[key] !== undefined) {
                    state.resources[key] += val;
                }
            }
        }

        let resultText;
        if (isRisk && choice.riskEffects) {
            // Bad outcome
            for (const [key, val] of Object.entries(choice.riskEffects)) {
                if (key === 'morale') {
                    state.population.moraleModifier = (state.population.moraleModifier || 0) + val;
                } else if (state.resources[key] !== undefined) {
                    state.resources[key] = Math.max(0, state.resources[key] + val);
                }
            }
            resultText = choice.riskResult || 'Things went wrong...';
            Utils.toast(`⚠️ ${resultText}`, 'warning');
            GameUI.addLogEntry(`${event.icon} ${resultText}`, 'warning', state.turn);
        } else {
            resultText = choice.result || 'Done.';
            Utils.toast(`✅ ${resultText}`, 'success');
            GameUI.addLogEntry(`${event.icon} ${resultText}`, 'success', state.turn);
        }

        ResourceManager.updateDisplay(state);
        PopulationManager.updatePopulationUI(state);
    }
};
