/*
 * Business Tycoon Simulator
 *
 * This script handles the core logic of the simulation. The player starts with
 * some money and can invest in businesses, real estate and stocks. Each
 * investment generates revenue over time. Stock prices fluctuate randomly
 * every second. The player must make strategic decisions on when to buy or
 * upgrade businesses and properties and when to trade stocks to maximize
 * wealth.
 */

// Player state
let money = 1000; // starting capital

// Business definitions
const businesses = [
  {
    id: 'retail',
    name: 'Retail Shop',
    baseCost: 200,
    baseRevenue: 5,
    level: 0
  },
  {
    id: 'tech',
    name: 'Tech Startup',
    baseCost: 600,
    baseRevenue: 20,
    level: 0
  },
  {
    id: 'service',
    name: 'Consulting Firm',
    baseCost: 400,
    baseRevenue: 12,
    level: 0
  }
];

// Real estate definitions
const properties = [
  {
    id: 'apartment',
    name: 'Rental Apartment',
    baseCost: 300,
    baseRevenue: 6,
    level: 0
  },
  {
    id: 'office',
    name: 'Office Building',
    baseCost: 800,
    baseRevenue: 25,
    level: 0
  },
  {
    id: 'hotel',
    name: 'Hotel',
    baseCost: 1500,
    baseRevenue: 50,
    level: 0
  }
];

// Stock definitions (price will fluctuate)
const stocks = [
  {
    id: 'techStock',
    name: 'TechCorp',
    price: 50,
    shares: 0
  },
  {
    id: 'retailStock',
    name: 'RetailCo',
    price: 30,
    shares: 0
  },
  {
    id: 'energyStock',
    name: 'EnergyInc',
    price: 20,
    shares: 0
  },
  {
    id: 'crypto',
    name: 'CryptoCoin',
    price: 10,
    shares: 0
  }
];

// Utility functions to calculate upgrade cost and revenue per level
function getUpgradeCost(item) {
  // cost increases by 50% per level (so first purchase cost is baseCost)
  return Math.round(item.baseCost * Math.pow(1.5, item.level));
}

function getRevenuePerSecond(item) {
  // revenue increases by 60% per additional level after first purchase
  if (item.level === 0) return 0;
  return Math.round(item.baseRevenue * Math.pow(1.6, item.level - 1));
}

// Render functions
function render() {
  // update money display
  document.getElementById('money').textContent = money.toFixed(2);
  renderBusinesses();
  renderProperties();
  renderStocks();
}

function renderBusinesses() {
  const container = document.getElementById('businesses-container');
  container.innerHTML = '';
  businesses.forEach((biz, index) => {
    const item = document.createElement('div');
    item.className = 'item';

    const info = document.createElement('div');
    info.className = 'item-info';
    const nameEl = document.createElement('span');
    nameEl.textContent = `${biz.name} (Lvl ${biz.level})`;
    const revenueEl = document.createElement('span');
    const rev = getRevenuePerSecond(biz);
    revenueEl.textContent = `Revenue: $${rev}/sec`;
    const costEl = document.createElement('span');
    const cost = getUpgradeCost(biz);
    costEl.textContent = biz.level === 0 ? `Purchase: $${cost}` : `Upgrade: $${cost}`;
    info.appendChild(nameEl);
    info.appendChild(revenueEl);
    info.appendChild(costEl);

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const btn = document.createElement('button');
    btn.textContent = biz.level === 0 ? 'Purchase' : 'Upgrade';
    btn.disabled = money < cost;
    btn.addEventListener('click', () => {
      if (money >= cost) {
        money -= cost;
        biz.level += 1;
        render();
      }
    });
    actions.appendChild(btn);

    item.appendChild(info);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

function renderProperties() {
  const container = document.getElementById('properties-container');
  container.innerHTML = '';
  properties.forEach((prop, index) => {
    const item = document.createElement('div');
    item.className = 'item';
    const info = document.createElement('div');
    info.className = 'item-info';
    const nameEl = document.createElement('span');
    nameEl.textContent = `${prop.name} (Lvl ${prop.level})`;
    const revenueEl = document.createElement('span');
    const rev = getRevenuePerSecond(prop);
    revenueEl.textContent = `Rent: $${rev}/sec`;
    const costEl = document.createElement('span');
    const cost = getUpgradeCost(prop);
    costEl.textContent = prop.level === 0 ? `Purchase: $${cost}` : `Upgrade: $${cost}`;
    info.appendChild(nameEl);
    info.appendChild(revenueEl);
    info.appendChild(costEl);
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const btn = document.createElement('button');
    btn.textContent = prop.level === 0 ? 'Purchase' : 'Upgrade';
    btn.disabled = money < cost;
    btn.addEventListener('click', () => {
      if (money >= cost) {
        money -= cost;
        prop.level += 1;
        render();
      }
    });
    actions.appendChild(btn);
    item.appendChild(info);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

function renderStocks() {
  const container = document.getElementById('stocks-container');
  container.innerHTML = '';
  stocks.forEach((stk, index) => {
    const item = document.createElement('div');
    item.className = 'item';
    const info = document.createElement('div');
    info.className = 'item-info';
    const nameEl = document.createElement('span');
    nameEl.textContent = `${stk.name}`;
    const priceEl = document.createElement('span');
    priceEl.textContent = `Price: $${stk.price.toFixed(2)}`;
    const sharesEl = document.createElement('span');
    sharesEl.textContent = `Shares: ${stk.shares}`;
    info.appendChild(nameEl);
    info.appendChild(priceEl);
    info.appendChild(sharesEl);
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Buy';
    buyBtn.disabled = money < stk.price;
    buyBtn.addEventListener('click', () => {
      if (money >= stk.price) {
        money -= stk.price;
        stk.shares += 1;
        render();
      }
    });
    const sellBtn = document.createElement('button');
    sellBtn.textContent = 'Sell';
    sellBtn.disabled = stk.shares <= 0;
    sellBtn.addEventListener('click', () => {
      if (stk.shares > 0) {
        stk.shares -= 1;
        money += stk.price;
        render();
      }
    });
    actions.appendChild(buyBtn);
    actions.appendChild(sellBtn);
    item.appendChild(info);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

// Game update loop
function updateGame() {
  // accumulate revenue from businesses and properties
  let revenue = 0;
  businesses.forEach(biz => {
    revenue += getRevenuePerSecond(biz);
  });
  properties.forEach(prop => {
    revenue += getRevenuePerSecond(prop);
  });
  money += revenue;

  // update stock prices randomly
  stocks.forEach(stk => {
    // random change between -4% and +4%
    const change = (Math.random() * 0.08) - 0.04;
    stk.price = Math.max(1, stk.price * (1 + change));
  });

  render();
}

// Initialise page after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  render();
  // run game loop every second
  setInterval(updateGame, 1000);
});
