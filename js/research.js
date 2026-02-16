/* ========================================
   GALACTIC NEXUS — Research / Tech Tree
   ======================================== */

const ResearchManager = {
    // Render the tech tree
    renderTechTree(state) {
        const container = Utils.$('tech-tree');
        if (!container) return;
        container.innerHTML = '';

        const eras = { 1: 'Era I — Foundation', 2: 'Era II — Expansion', 3: 'Era III — Mastery' };

        for (const [era, label] of Object.entries(eras)) {
            const eraDiv = document.createElement('div');
            eraDiv.className = 'tech-era';

            const eraLabel = document.createElement('div');
            eraLabel.className = 'tech-era-label';
            eraLabel.textContent = label;
            eraDiv.appendChild(eraLabel);

            const grid = document.createElement('div');
            grid.className = 'tech-era-grid';

            const techs = Object.values(GAME_DATA.technologies).filter(t => t.era === parseInt(era));

            techs.forEach(tech => {
                const isResearched = state.techsResearched.includes(tech.id);
                const isActive = state.currentResearch === tech.id;
                const prereqsMet = tech.prerequisites.every(p => state.techsResearched.includes(p));
                const isLocked = !prereqsMet && !isResearched;

                const card = document.createElement('div');
                card.className = 'tech-card';
                if (isResearched) card.classList.add('researched');
                if (isActive) card.classList.add('researching');
                if (isLocked) card.classList.add('locked');

                let statusBadge = '';
                if (isResearched) statusBadge = '<span class="tech-status-badge done">✓ Done</span>';
                else if (isActive) statusBadge = '<span class="tech-status-badge active">⏳ Active</span>';

                let progressHTML = '';
                if (isActive) {
                    const pct = Math.min(100, Math.floor((state.researchProgress / tech.cost) * 100));
                    progressHTML = `
                        <div class="progress-bar" style="margin-top:8px">
                            <div class="progress-fill" style="width:${pct}%"></div>
                        </div>
                        <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-amber)">${pct}%</span>
                    `;
                }

                let prereqHTML = '';
                if (tech.prerequisites.length > 0 && !isResearched) {
                    const prereqNames = tech.prerequisites.map(p => {
                        const t = GAME_DATA.technologies[p];
                        const done = state.techsResearched.includes(p);
                        return `<span style="color:${done ? 'var(--accent-emerald)' : 'var(--accent-red)'}">${t ? t.name : p}</span>`;
                    }).join(', ');
                    prereqHTML = `<div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Requires: ${prereqNames}</div>`;
                }

                card.innerHTML = `
                    <div class="tech-card-header">
                        <span class="tech-icon">${tech.icon}</span>
                        <span class="tech-name">${tech.name}</span>
                        ${statusBadge}
                    </div>
                    <p class="tech-desc">${tech.desc}</p>
                    <div style="font-size:0.75rem;color:var(--accent-cyan);margin-bottom:4px">✧ ${tech.effects}</div>
                    ${!isResearched ? `<div class="tech-cost">🔬 Cost: ${tech.cost} RP</div>` : ''}
                    ${prereqHTML}
                    ${progressHTML}
                `;

                if (!isResearched && !isLocked && !isActive) {
                    card.addEventListener('click', () => this.startResearch(tech.id, state));
                    card.style.cursor = 'pointer';
                }

                grid.appendChild(card);
            });

            eraDiv.appendChild(grid);
            container.appendChild(eraDiv);
        }
    },

    // Start researching a technology
    startResearch(techId, state) {
        if (state.currentResearch) {
            Utils.toast('⚠️ Already researching! Complete current project first.', 'warning');
            return;
        }

        const tech = GAME_DATA.technologies[techId];
        if (!tech) return;

        // Check prerequisites
        if (!tech.prerequisites.every(p => state.techsResearched.includes(p))) {
            Utils.toast('❌ Prerequisites not met!', 'error');
            return;
        }

        state.currentResearch = techId;
        state.researchProgress = 0;

        Utils.toast(`🔬 Started researching: ${tech.name}`, 'info');
        GameUI.addLogEntry(`Began research: ${tech.icon} ${tech.name}`, 'info', state.turn);

        this.updateResearchBar(state);
        this.renderTechTree(state);
    },

    // Process research each turn
    processResearch(state) {
        if (!state.currentResearch) return;

        const tech = GAME_DATA.technologies[state.currentResearch];
        if (!tech) { state.currentResearch = null; return; }

        const researchRate = state.rates.research || 0;
        state.researchProgress += researchRate;

        if (state.researchProgress >= tech.cost) {
            // Research complete!
            state.techsResearched.push(state.currentResearch);
            state.stats.techsResearched = state.techsResearched.length;
            state.stats.colonyLevel = Utils.calcColonyLevel(state.stats.totalBuildings, state.stats.techsResearched);

            Utils.toast(`🎉 Research complete: ${tech.name}!`, 'success');
            GameUI.addLogEntry(`Completed research: ${tech.icon} ${tech.name}!`, 'success', state.turn);
            GameUI.playSound('research');

            state.currentResearch = null;
            state.researchProgress = 0;

            MissionManager.checkMissions(state);
        }

        this.updateResearchBar(state);
    },

    // Update the research progress bar in header
    updateResearchBar(state) {
        const nameEl = Utils.$('current-research-name');
        const fillEl = Utils.$('research-progress-fill');
        const textEl = Utils.$('research-progress-text');

        if (state.currentResearch) {
            const tech = GAME_DATA.technologies[state.currentResearch];
            const pct = Math.min(100, Math.floor((state.researchProgress / tech.cost) * 100));
            nameEl.textContent = tech.name;
            fillEl.style.width = pct + '%';
            textEl.textContent = pct + '%';
        } else {
            nameEl.textContent = 'No active research';
            fillEl.style.width = '0%';
            textEl.textContent = '';
        }
    }
};
