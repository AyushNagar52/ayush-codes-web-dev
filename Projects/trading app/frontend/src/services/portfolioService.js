import api from './api';

export const portfolioService = {
  getSummary: async () => {
    const response = await api.get('/portfolio');
    return response.data.data;
  },

  getHoldings: async () => {
    const response = await api.get('/portfolio/holdings');
    return response.data.data;
  },

  getPerformance: async (range = '1M') => {
    const response = await api.get(`/portfolio/performance?range=${range}`);
    return response.data.data;
  },
};
