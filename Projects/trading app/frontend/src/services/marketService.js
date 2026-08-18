import api from './api';

export const marketService = {
  getOverview: async () => {
    const response = await api.get('/market/overview');
    return response.data.data;
  },

  search: async (query) => {
    const response = await api.get(`/market/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  getQuote: async (symbol) => {
    const response = await api.get(`/market/quote/${symbol}`);
    return response.data.data;
  },

  getProfile: async (symbol) => {
    const response = await api.get(`/market/profile/${symbol}`);
    return response.data.data;
  },

  getHistory: async (symbol, range = '1M') => {
    const response = await api.get(`/market/history/${symbol}?range=${range}`);
    return response.data.data;
  },
};
