import api from './api';

export const orderService = {
  buyStock: async (symbol, quantity) => {
    const response = await api.post('/orders/buy', { symbol, quantity });
    return response.data;
  },

  sellStock: async (symbol, quantity) => {
    const response = await api.post('/orders/sell', { symbol, quantity });
    return response.data;
  },

  getOrders: async (page = 1, limit = 20, symbol = '', side = '') => {
    let url = `/orders?page=${page}&limit=${limit}`;
    if (symbol) url += `&symbol=${symbol}`;
    if (side) url += `&side=${side}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getTransactions: async (page = 1, limit = 20, type = '') => {
    let url = `/transactions?page=${page}&limit=${limit}`;
    if (type) url += `&type=${type}`;
    const response = await api.get(url);
    return response.data.data;
  },
};
