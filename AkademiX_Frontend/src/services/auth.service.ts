import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  fullName: string;
  title: string;
  institution: string;
}

export const AuthService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
}; 