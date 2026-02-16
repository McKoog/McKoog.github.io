/* ========================================
   GALACTIC NEXUS — UI Manager
   ======================================== */

const GameUI = {
    currentTab: 'overview',

    // Initialize UI event listeners
    init(state) {
        // Nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab, state);
            });
        });

        // Building filter
        const buildingFilter = Utils.$('building-filter');
        if (buildingFilter) {
            buildingFilter.addEventListener('change', () => {
                BuildingManager.renderBuildings(state);
            });
        }

        // Quick actions
        Utils.$('btn-next-turn').addEventListener('click', () => Game.nextTurn());
        Utils.$('floating-next-turn').addEventListener('click', () => Game.nextTurn());
        Utils.$('btn-auto-assign').addEventListener('click', () => PopulationManager.autoAssign(state));
        Utils.$('btn-quick-save').addEventListener('click', () => {
            Game.saveGame();
            Utils.toast('💾 Game saved!', 'success');
        });

        // Settings
        Utils.$('btn-settings').addEventListener('click', () => Utils.show('settings-modal'));
        Utils.$('btn-close-settings').addEventListener('click', () => Utils.hide('settings-modal'));
        Utils.$('btn-reset-game').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
                localStorage.removeItem('galactic_nexus_save');
                location.reload();
            }
        });
        Utils.$('btn-export-save').addEventListener('click', () => this.exportSave(state));
        Utils.$('btn-import-save').addEventListener('click', () => this.importSave());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                Game.nextTurn();
            }
            if (e.key === '1') this.switchTab('overview', state);
            if (e.key === '2') this.switchTab('buildings', state);
            if (e.key === '3') this.switchTab('research', state);
            if (e.key === '4') this.switchTab('population', state);
            if (e.key === '5') this.switchTab('trade', state);
            if (e.key === '6') this.switchTab('missions', state);
        });
    },

    // Switch panel tabs
    switchTab(tabName, state) {
        this.currentTab = tabName;

        // Update nav
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Show/hide panels
        document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
        const panel = Utils.$(`panel-${tabName}`);
        if (panel) panel.classList.remove('hidden');

        // Render panel content
        this.renderActivePanel(state);
    },

    // Render the currently active panel
    renderActivePanel(state) {
        switch (this.currentTab) {
            case 'overview':
                this.updateOverview(state);
                ResourceManager.drawChart(state);
                break;
            case 'buildings':
                BuildingManager.renderBuildings(state);
                break;
            case 'research':
                ResearchManager.renderTechTree(state);
                break;
            case 'population':
                PopulationManager.updatePopulationUI(state);
                break;
            case 'trade':
                TradeManager.renderTradeUI(state);
                break;
            case 'missions':
                MissionManager.renderMissions(state);
                break;
        }
    },

    // Update the overview panel
    updateOverview(state) {
        // Colony stats
        Utils.$('stat-level').textContent = state.stats.colonyLevel || 1;
        Utils.$('stat-buildings').textContent = state.stats.totalBuildings || 0;
        Utils.$('stat-techs').textContent = state.stats.techsResearched || 0;
        Utils.$('stat-missions').textContent = state.completedMissions ? state.completedMissions.length : 0;

        // Turn & season display
        Utils.$('turn-display').textContent = `Turn ${state.turn}`;
        const season = Utils.getSeason(state.turn);
        Utils.$('season-display').textContent = `${GAME_DATA.seasonEmojis[season]} ${season}`;
        Utils.$('colony-name-display').textContent = state.colonyName;

        // Advisors
        this.updateAdvisors(state);
    },

    // Update advisor messages
    updateAdvisors(state) {
        const container = Utils.$('advisors-list');
        if (!container) return;

        const advisors = GAME_DATA.advisorMessages;
        const msgs = [];

        // Scientist
        const scientist = advisors.scientist;
        let sciMsg = scientist.messages.default;
        if (!state.buildings.research_lab || state.buildings.research_lab.level <= 0) {
            sciMsg = scientist.messages.noLab;
        } else if (!state.currentResearch) {
            sciMsg = scientist.messages.noResearch;
        } else if ((state.rates.research || 0) < 5) {
            sciMsg = scientist.messages.lowResearch;
        } else if ((state.rates.research || 0) >= 10) {
            sciMsg = scientist.messages.highResearch;
        }
        msgs.push({ ...scientist, msg: sciMsg });

        // Engineer
        const engineer = advisors.engineer;
        let engMsg = engineer.messages.default;
        if (state.stats.totalBuildings === 0) {
            engMsg = engineer.messages.noBuildings;
        } else if (state.resources.energy < 30) {
            engMsg = engineer.messages.lowEnergy;
        } else if (state.resources.minerals < 20) {
            engMsg = engineer.messages.lowMinerals;
        }
        msgs.push({ ...engineer, msg: engMsg });

        // Diplomat
        const diplomat = advisors.diplomat;
        let dipMsg = diplomat.messages.default;
        if (!state.buildings.spaceport || state.buildings.spaceport.level <= 0) {
            dipMsg = diplomat.messages.noTrade;
        } else if (state.resources.credits < 50) {
            dipMsg = diplomat.messages.lowCredits;
        } else if (state.resources.credits > 500) {
            dipMsg = diplomat.messages.highCredits;
        }
        msgs.push({ ...diplomat, msg: dipMsg });

        container.innerHTML = msgs.map(a => `
            <div class="advisor-item">
                <span class="advisor-avatar">${a.avatar}</span>
                <div class="advisor-text">
                    <span class="advisor-name">${a.name}</span>
                    <p class="advisor-msg">${a.msg}</p>
                </div>
            </div>
        `).join('');
    },

    // Add entry to the colony log
    addLogEntry(text, type, turn) {
        const log = Utils.$('event-log');
        if (!log) return;

        const entry = document.createElement('div');
        entry.className = `log-entry log-${type || 'info'} animate-slide-up`;
        entry.innerHTML = `<span class="log-turn">T${turn || '?'}</span> ${text}`;
        log.insertBefore(entry, log.firstChild);

        // Keep max 50 entries
        while (log.children.length > 50) {
            log.removeChild(log.lastChild);
        }
    },

    // Export save as JSON
    exportSave(state) {
        const data = JSON.stringify(state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `galactic_nexus_save_T${state.turn}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.toast('📤 Save exported!', 'success');
    },

    // Import save from JSON
    importSave() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    localStorage.setItem('galactic_nexus_save', JSON.stringify(data));
                    Utils.toast('📥 Save imported! Reloading...', 'success');
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    Utils.toast('❌ Invalid save file!', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // Play sound effect
    playSound(type) {
        // Simple sound system using Web Audio API
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            switch (type) {
                case 'build':
                    osc.frequency.value = 440;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.3);
                    break;
                case 'research':
                    osc.frequency.value = 660;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.5);
                    break;
                case 'event':
                    osc.frequency.value = 330;
                    osc.type = 'triangle';
                    gain.gain.setValueAtTime(0.15, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.4);
                    break;
                case 'turn':
                    osc.frequency.value = 520;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.05, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                    break;
                case 'mission':
                    osc.frequency.value = 880;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.4);
                    // Second tone
                    setTimeout(() => {
                        const osc2 = ctx.createOscillator();
                        const g2 = ctx.createGain();
                        osc2.connect(g2); g2.connect(ctx.destination);
                        osc2.frequency.value = 1100;
                        osc2.type = 'sine';
                        g2.gain.setValueAtTime(0.08, ctx.currentTime);
                        g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                        osc2.start(); osc2.stop(ctx.currentTime + 0.3);
                    }, 200);
                    break;
            }
        } catch (e) {
            // Sound not supported, ignore
        }
    },

    // Initialize stars background
    initStars() {
        const canvas = Utils.$('stars-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let w, h;
        const stars = [];
        const numStars = 200;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function initStarField() {
            stars.length = 0;
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 2 + 0.5,
                    speed: Math.random() * 0.3 + 0.05,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }
        }

        function draw(time) {
            ctx.clearRect(0, 0, w, h);

            stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase);
                const alpha = star.opacity * twinkle;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
                ctx.fill();

                // Glow
                if (star.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(100, 150, 255, ${alpha * 0.15})`;
                    ctx.fill();
                }

                // Slow drift
                star.y += star.speed;
                if (star.y > h + 5) {
                    star.y = -5;
                    star.x = Math.random() * w;
                }
            });

            requestAnimationFrame(draw);
        }

        resize();
        initStarField();
        window.addEventListener('resize', () => {
            resize();
            initStarField();
        });
        requestAnimationFrame(draw);
    }
};
