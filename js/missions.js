/* ========================================
   GALACTIC NEXUS — Mission System
   ======================================== */

const MissionManager = {
    // Initialize missions
    initMissions(state) {
        if (!state.activeMissions) state.activeMissions = [];
        if (!state.completedMissions) state.completedMissions = [];
        if (!state.availableMissions) {
            state.availableMissions = [];
            // Add auto-start missions
            GAME_DATA.missions.forEach(m => {
                if (m.autoStart) {
                    state.activeMissions.push(m.id);
                }
            });
        }
    },

    // Unlock new available missions based on progress
    unlockMissions(state) {
        GAME_DATA.missions.forEach(mission => {
            if (state.activeMissions.includes(mission.id)) return;
            if (state.completedMissions.includes(mission.id)) return;
            if (state.availableMissions.includes(mission.id)) return;
            if (mission.autoStart) return;

            // Simple unlock condition: after certain turns
            let shouldUnlock = false;
            if (mission.type === 'population' && state.turn >= 5) shouldUnlock = true;
            if (mission.type === 'research' && state.turn >= 3) shouldUnlock = true;
            if (mission.type === 'resource' && state.turn >= 8) shouldUnlock = true;
            if (mission.type === 'defense' && state.turn >= 10) shouldUnlock = true;
            if (mission.type === 'trade' && state.stats.tradesCompleted >= 1) shouldUnlock = true;
            if (mission.type === 'morale' && state.turn >= 8) shouldUnlock = true;
            if (mission.type === 'endgame' && state.stats.techsResearched >= 5) shouldUnlock = true;
            if (mission.type === 'build' && mission.target === 5 && state.stats.totalBuildings >= 3) shouldUnlock = true;

            if (shouldUnlock) {
                state.availableMissions.push(mission.id);
                Utils.toast(`🎯 New mission available: ${mission.title}`, 'info');
            }
        });
    },

    // Check mission completion
    checkMissions(state) {
        const gameState = this.getGameStateForCheck(state);
        const completed = [];

        state.activeMissions.forEach(missionId => {
            const mission = GAME_DATA.missions.find(m => m.id === missionId);
            if (!mission) return;

            if (mission.check(gameState)) {
                completed.push(missionId);
            }
        });

        completed.forEach(missionId => {
            const mission = GAME_DATA.missions.find(m => m.id === missionId);
            if (!mission) return;

            // Remove from active
            state.activeMissions = state.activeMissions.filter(id => id !== missionId);
            state.completedMissions.push(missionId);
            state.stats.missionsCompleted = state.completedMissions.length;

            // Apply rewards
            for (const [key, val] of Object.entries(mission.reward)) {
                if (key === 'morale') {
                    state.population.moraleModifier = (state.population.moraleModifier || 0) + val;
                } else if (state.resources[key] !== undefined) {
                    state.resources[key] += val;
                }
            }

            Utils.toast(`🎉 Mission complete: ${mission.title}!`, 'success');
            GameUI.addLogEntry(`Mission completed: ${mission.icon} ${mission.title}! Rewards claimed.`, 'success', state.turn);
            GameUI.playSound('mission');
        });

        if (completed.length > 0) {
            ResourceManager.updateDisplay(state);
        }
    },

    // Build game state object for mission checks
    getGameStateForCheck(state) {
        return {
            resources: state.resources,
            rates: state.rates || {},
            population: state.population,
            buildings: state.buildings,
            stats: {
                ...state.stats,
                defense: BuildingManager.getTotalDefense(state),
                colonyLevel: state.stats.colonyLevel || 1,
                techsResearched: state.stats.techsResearched || 0,
                totalBuildings: state.stats.totalBuildings || 0,
                tradesCompleted: state.stats.tradesCompleted || 0,
                missionsCompleted: state.completedMissions.length || 0
            }
        };
    },

    // Render missions UI
    renderMissions(state) {
        this.initMissions(state);
        const gameState = this.getGameStateForCheck(state);

        // Active missions
        const activeCont = Utils.$('active-missions');
        if (activeCont) {
            if (state.activeMissions.length === 0) {
                activeCont.innerHTML = '<p class="empty-msg">No active missions. Accept missions from the available list!</p>';
            } else {
                activeCont.innerHTML = state.activeMissions.map(mId => {
                    const mission = GAME_DATA.missions.find(m => m.id === mId);
                    if (!mission) return '';

                    let progressVal = 0;
                    let progressMax = mission.target;
                    if (mission.progress) {
                        progressVal = Math.min(progressMax, mission.progress(gameState));
                    }
                    const pct = Math.min(100, Math.floor((progressVal / progressMax) * 100));

                    const rewardText = Object.entries(mission.reward)
                        .map(([k, v]) => `${GAME_DATA.resources[k] ? GAME_DATA.resources[k].icon : '😊'} ${v}`)
                        .join(' ');

                    return `
                        <div class="mission-card active-mission">
                            <div class="mission-header">
                                <span class="mission-icon">${mission.icon}</span>
                                <span class="mission-title">${mission.title}</span>
                                <span class="mission-reward">${rewardText}</span>
                            </div>
                            <p class="mission-desc">${mission.description}</p>
                            <div class="mission-progress">
                                <div class="mission-progress-text">${progressVal}/${progressMax} (${pct}%)</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${pct}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Available missions
        const availCont = Utils.$('available-missions');
        if (availCont) {
            if (state.availableMissions.length === 0) {
                availCont.innerHTML = '<p class="empty-msg">New missions will unlock as you progress!</p>';
            } else {
                availCont.innerHTML = state.availableMissions.map(mId => {
                    const mission = GAME_DATA.missions.find(m => m.id === mId);
                    if (!mission) return '';

                    const rewardText = Object.entries(mission.reward)
                        .map(([k, v]) => `${GAME_DATA.resources[k] ? GAME_DATA.resources[k].icon : '😊'} ${v}`)
                        .join(' ');

                    return `
                        <div class="mission-card">
                            <div class="mission-header">
                                <span class="mission-icon">${mission.icon}</span>
                                <span class="mission-title">${mission.title}</span>
                                <span class="mission-reward">${rewardText}</span>
                            </div>
                            <p class="mission-desc">${mission.description}</p>
                            <button class="mission-accept-btn" data-mission="${mission.id}">Accept Mission</button>
                        </div>
                    `;
                }).join('');

                // Accept buttons
                availCont.querySelectorAll('.mission-accept-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.mission;
                        state.activeMissions.push(id);
                        state.availableMissions = state.availableMissions.filter(m => m !== id);
                        Utils.toast(`🎯 Mission accepted!`, 'info');
                        this.renderMissions(state);
                        this.checkMissions(state);
                    });
                });
            }
        }

        // Completed missions
        const completedCont = Utils.$('completed-missions');
        if (completedCont) {
            if (state.completedMissions.length === 0) {
                completedCont.innerHTML = '<p class="empty-msg">No completed missions yet</p>';
            } else {
                completedCont.innerHTML = state.completedMissions.map(mId => {
                    const mission = GAME_DATA.missions.find(m => m.id === mId);
                    if (!mission) return '';
                    return `
                        <div class="mission-card completed-mission">
                            <div class="mission-header">
                                <span class="mission-icon">${mission.icon}</span>
                                <span class="mission-title">${mission.title}</span>
                                <span style="color:var(--accent-emerald);font-size:0.8rem">✓ Done</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }
};
