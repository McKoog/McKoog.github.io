/* ========================================
   GALACTIC NEXUS — Utility Functions
   ======================================== */

const Utils = {
    // DOM helpers
    $(id) { return document.getElementById(id); },
    $$(selector) { return document.querySelectorAll(selector); },

    // Format number with commas
    formatNumber(n) {
        if (n === undefined || n === null) return '0';
        return Math.floor(n).toLocaleString();
    },

    // Format rate with +/- sign
    formatRate(n) {
        if (n === undefined) return '+0';
        const val = Math.floor(n);
        return val >= 0 ? `+${val}` : `${val}`;
    },

    // Clamp value between min and max
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    // Random integer between min and max (inclusive)
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Random float
    randFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Random from array
    randFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // Deep clone
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Show toast notification
    toast(message, type = 'info') {
        const container = this.$('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // Show / hide element
    show(el) {
        if (typeof el === 'string') el = this.$(el);
        if (el) el.classList.remove('hidden');
    },

    hide(el) {
        if (typeof el === 'string') el = this.$(el);
        if (el) el.classList.add('hidden');
    },

    // Spawn floating particle at element
    spawnParticle(el, text, color) {
        const rect = el.getBoundingClientRect();
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = text;
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top}px`;
        particle.style.color = color || '#22d3ee';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    },

    // Calculate cost for building at given level
    calcBuildingCost(buildingDef, currentLevel) {
        const cost = {};
        const mult = Math.pow(buildingDef.costMultiplier, currentLevel);
        for (const [res, amount] of Object.entries(buildingDef.baseCost)) {
            cost[res] = Math.floor(amount * mult);
        }
        return cost;
    },

    // Check if player can afford cost
    canAfford(resources, cost) {
        for (const [res, amount] of Object.entries(cost)) {
            if ((resources[res] || 0) < amount) return false;
        }
        return true;
    },

    // Apply cost (subtract resources)
    applyCost(resources, cost) {
        for (const [res, amount] of Object.entries(cost)) {
            resources[res] = (resources[res] || 0) - amount;
        }
    },

    // Create element helper
    createElement(tag, className, innerHTML) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    },

    // Animate element
    animateElement(el, animClass) {
        el.classList.remove(animClass);
        void el.offsetWidth; // trigger reflow
        el.classList.add(animClass);
    },

    // Lerp
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    // Get season for turn
    getSeason(turn) {
        return GAME_DATA.seasons[(turn - 1) % 4];
    },

    // Get colony level from total buildings count + techs
    calcColonyLevel(totalBuildings, totalTechs) {
        const score = totalBuildings + totalTechs * 2;
        const thresholds = GAME_DATA.colonyLevelThresholds;
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (score >= thresholds[i]) return i + 1;
        }
        return 1;
    }
};
