import api from './api';

export const authService = {
  login: async (email, password, userType = 'user') => {
    const endpoint = userType === 'organization' ? '/organizations/login' : '/users/login';
    const response = await api.post(endpoint, { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      const userData = userType === 'organization' ? response.org : response.user;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response;
  },

  signupUser: async (userData) => {
    const response = await api.post('/users/', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  signupOrganization: async (orgData) => {
    const response = await api.post('/organizations/', orgData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.org));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};