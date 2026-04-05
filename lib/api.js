// API helper - all database calls go through here
const api = {
  // Auth
  async signup(username, email, password) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },

  // Strategies
  async getStrategies() {
    const res = await fetch('/api/strategies');
    return res.json();
  },
  async createStrategy(data) {
    const res = await fetch('/api/strategies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateStrategy(data) {
    const res = await fetch('/api/strategies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteStrategy(id) {
    const res = await fetch(`/api/strategies?id=${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Trades
  async getTrades(userId) {
    const res = await fetch(`/api/trades?userId=${userId}`);
    return res.json();
  },
  async createTrade(data) {
    const res = await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateTrade(data) {
    const res = await fetch('/api/trades', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteTrade(id) {
    const res = await fetch(`/api/trades?id=${id}`, { method: 'DELETE' });
    return res.json();
  },
};

export default api;
