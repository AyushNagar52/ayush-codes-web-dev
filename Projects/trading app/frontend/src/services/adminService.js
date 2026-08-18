import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getUsers: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data.data;
  },
};
