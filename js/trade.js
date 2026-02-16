/* ========================================
   GALACTIC NEXUS — Trade System
   ======================================== */

const TradeManager = {
    // Initialize market prices
    initMarket(state) {
        if (!state.market) {
            state.market = {};
            for (const [res, basePrice] of Object.entries(GAME_DATA.marketBasePrices)) {
                state.market[res] = {
                    price: basePrice,
                    trend: 0,
                    history: [basePrice]
                };
            }
        }
        if (!state.tradeHistory) state.tradeHistory = [];
    },

    // Fluctuate prices each turn
    updatePrices(state) {
        for (const [res, market] of Object.entries(state.market)) {
            const basePrice = GAME_DATA.marketBasePrices[res];
            const fluctuation = Utils.randFloat(-0.15, 0.15);
            const supplyDemand = (state.rates[res] || 0) > 10 ? -0.05 : 0.05;

            let newPrice = market.price * (1 + fluctuation + supplyDemand);
            newPrice = Utils.clamp(newPrice, basePrice * 0.5, basePrice * 2.5);
            newPrice = Math.round(newPrice * 10) / 10;

            market.trend = newPrice > market.price ? 1 : (newPrice < market.price ? -1 : 0);
            market.price = newPrice;
            market.history.push(newPrice);
            if (market.history.length > 10) market.history.shift();
        }
    },

    // Render trade UI
    renderTradeUI(state) {
        this.initMarket(state);

        // Market table
        const marketTable = Utils.$('market-table');
        if (marketTable) {
            marketTable.innerHTML = '';
            const tradeable = ['energy', 'minerals', 'food'];

            tradeable.forEach(res => {
                const resData = GAME_DATA.resources[res];
                const market = state.market[res];
                const trendClass = market.trend > 0 ? 'up' : (market.trend < 0 ? 'down' : 'stable');
                const trendIcon = market.trend > 0 ? '↑' : (market.trend < 0 ? '↓' : '→');

                const row = document.createElement('div');
                row.className = 'market-row';
                row.innerHTML = `
                    <div class="market-resource">
                        <span>${resData.icon}</span>
                        <span>${resData.name}</span>
                    </div>
                    <span class="market-price">💰 ${market.price.toFixed(1)} cr</span>
                    <span class="market-trend ${trendClass}">${trendIcon}</span>
                `;
                marketTable.appendChild(row);
            });
        }

        // Trade form
        const tradeForm = Utils.$('trade-form');
        if (tradeForm) {
            tradeForm.innerHTML = `
                <div class="trade-row">
                    <div class="trade-field">
                        <label>Action</label>
                        <select id="trade-action">
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                        </select>
                    </div>
                    <div class="trade-field">
                        <label>Resource</label>
                        <select id="trade-resource">
                            <option value="energy">⚡ Energy</option>
                            <option value="minerals">💎 Minerals</option>
                            <option value="food">🌾 Food</option>
                        </select>
                    </div>
                    <div class="trade-field">
                        <label>Amount</label>
                        <input type="number" id="trade-amount" min="1" max="100" value="10">
                    </div>
                </div>
                <div class="trade-summary" id="trade-summary">
                    Select a trade to see details
                </div>
                <button class="btn btn-primary" id="btn-execute-trade" style="width:100%">Execute Trade</button>
            `;

            // Update summary on input change
            const updateSummary = () => {
                const action = Utils.$('trade-action').value;
                const res = Utils.$('trade-resource').value;
                const amount = parseInt(Utils.$('trade-amount').value) || 0;
                const market = state.market[res];
                if (!market) return;

                let price = market.price * amount;
                // Tech bonuses
                if (state.techsResearched.includes('trade_networks')) price *= (action === 'buy' ? 0.85 : 1.15);
                if (state.techsResearched.includes('galactic_embassy')) price *= (action === 'buy' ? 0.75 : 1.25);

                // Spaceport bonus
                for (const [id, bState] of Object.entries(state.buildings)) {
                    const def = GAME_DATA.buildings[id];
                    if (def && def.tradeBonus && bState.level > 0) {
                        price *= (action === 'buy' ? (1 - def.tradeBonus * bState.level) : (1 + def.tradeBonus * bState.level));
                    }
                }

                price = Math.round(price * 10) / 10;
                const resData = GAME_DATA.resources[res];

                if (action === 'buy') {
                    Utils.$('trade-summary').innerHTML = `Buy ${amount} ${resData.icon} ${resData.name} for <strong>💰 ${price.toFixed(1)} credits</strong>`;
                } else {
                    Utils.$('trade-summary').innerHTML = `Sell ${amount} ${resData.icon} ${resData.name} for <strong>💰 ${price.toFixed(1)} credits</strong>`;
                }
            };

            Utils.$('trade-action').addEventListener('change', updateSummary);
            Utils.$('trade-resource').addEventListener('change', updateSummary);
            Utils.$('trade-amount').addEventListener('input', updateSummary);
            updateSummary();

            // Execute trade
            Utils.$('btn-execute-trade').addEventListener('click', () => {
                this.executeTrade(state);
            });
        }

        // Trade history
        this.renderTradeHistory(state);

        // Trade routes
        this.renderTradeRoutes(state);
    },

    // Execute a trade
    executeTrade(state) {
        const action = Utils.$('trade-action').value;
        const res = Utils.$('trade-resource').value;
        const amount = parseInt(Utils.$('trade-amount').value) || 0;

        if (amount <= 0) {
            Utils.toast('❌ Invalid amount!', 'error');
            return;
        }

        const market = state.market[res];
        if (!market) return;

        let totalPrice = market.price * amount;

        // Apply trade bonuses
        if (state.techsResearched.includes('trade_networks')) totalPrice *= (action === 'buy' ? 0.85 : 1.15);
        if (state.techsResearched.includes('galactic_embassy')) totalPrice *= (action === 'buy' ? 0.75 : 1.25);

        for (const [id, bState] of Object.entries(state.buildings)) {
            const def = GAME_DATA.buildings[id];
            if (def && def.tradeBonus && bState.level > 0) {
                totalPrice *= (action === 'buy' ? (1 - def.tradeBonus * bState.level) : (1 + def.tradeBonus * bState.level));
            }
        }

        totalPrice = Math.round(totalPrice * 10) / 10;

        if (action === 'buy') {
            if (state.resources.credits < totalPrice) {
                Utils.toast('❌ Not enough credits!', 'error');
                return;
            }
            state.resources.credits -= totalPrice;
            state.resources[res] += amount;
            Utils.toast(`✅ Bought ${amount} ${GAME_DATA.resources[res].icon}!`, 'success');
        } else {
            if (state.resources[res] < amount) {
                Utils.toast(`❌ Not enough ${GAME_DATA.resources[res].name}!`, 'error');
                return;
            }
            state.resources[res] -= amount;
            state.resources.credits += totalPrice;
            Utils.toast(`✅ Sold ${amount} ${GAME_DATA.resources[res].icon} for ${totalPrice.toFixed(1)} credits!`, 'success');
        }

        // Record trade
        state.tradeHistory.push({
            turn: state.turn,
            action,
            resource: res,
            amount,
            price: totalPrice
        });
        if (state.tradeHistory.length > 20) state.tradeHistory.shift();

        state.stats.tradesCompleted = (state.stats.tradesCompleted || 0) + 1;

        // Affect market price
        if (action === 'buy') {
            market.price *= 1.02; // buying increases price
        } else {
            market.price *= 0.98; // selling decreases price
        }

        ResourceManager.updateDisplay(state);
        this.renderTradeUI(state);
        MissionManager.checkMissions(state);
        GameUI.addLogEntry(`${action === 'buy' ? 'Bought' : 'Sold'} ${amount} ${GAME_DATA.resources[res].icon} ${GAME_DATA.resources[res].name}`, 'info', state.turn);
    },

    // Render trade history
    renderTradeHistory(state) {
        const container = Utils.$('trade-history');
        if (!container) return;

        if (state.tradeHistory.length === 0) {
            container.innerHTML = '<p class="empty-msg">No trades yet</p>';
            return;
        }

        container.innerHTML = state.tradeHistory.slice().reverse().map(t => {
            const resData = GAME_DATA.resources[t.resource];
            return `<div class="trade-history-item">
                <span class="log-turn">T${t.turn}</span>
                ${t.action === 'buy' ? '📥' : '📤'} ${t.action === 'buy' ? 'Bought' : 'Sold'} ${t.amount} ${resData.icon} for 💰 ${t.price.toFixed(1)}
            </div>`;
        }).join('');
    },

    // Render trade routes
    renderTradeRoutes(state) {
        const container = Utils.$('trade-routes');
        if (!container) return;

        const hasSpaceport = state.buildings.spaceport && state.buildings.spaceport.level > 0;

        if (!hasSpaceport) {
            container.innerHTML = '<p class="empty-msg">Build a Spaceport to unlock trade routes</p>';
            return;
        }

        const routes = [
            { name: 'Sol System Route', resource: 'energy', bonus: '+10% energy prices', icon: '☀️' },
            { name: 'Kepler Mining Lane', resource: 'minerals', bonus: '+15% mineral prices', icon: '⛏️' },
            { name: 'Agri-World Express', resource: 'food', bonus: '+12% food prices', icon: '🌾' }
        ];

        container.innerHTML = routes.map(r => `
            <div class="trade-route-item">
                <div class="trade-route-info">
                    <strong>${r.icon} ${r.name}</strong>
                    <small style="display:block;color:var(--text-muted)">${r.bonus}</small>
                </div>
                <span style="color:var(--accent-emerald);font-size:0.8rem">Active ✓</span>
            </div>
        `).join('');
    }
};
