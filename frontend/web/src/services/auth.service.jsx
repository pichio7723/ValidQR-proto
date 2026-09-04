import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/usuarios/login', {
      email,
      password,
    });
    
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    
    const userResponse = await api.get('/usuarios/me');
    localStorage.setItem('user', JSON.stringify(userResponse.data));
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('access_token');
  },
};