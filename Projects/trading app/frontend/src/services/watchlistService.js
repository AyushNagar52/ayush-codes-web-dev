import api from './api';

export const watchlistService = {
  getWatchlist: async () => {
    const response = await api.get('/watchlist');
    return response.data.data;
  },

  add: async (symbol) => {
    const response = await api.post('/watchlist', { symbol });
    return response.data.data;
  },

  remove: async (symbol) => {
    const response = await api.delete(`/watchlist/${symbol}`);
    return response.data;
  },
};
