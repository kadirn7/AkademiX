import api from './api';

interface User {
  id: number;
  fullName: string;
  email: string;
  title: string;
  institution: string;
  bio: string;
  profileImage: string;
  followers: number;
  following: number;
}

interface UpdateUserData {
  fullName?: string;
  title?: string;
  institution?: string;
  bio?: string;
  profileImage?: string;
}

export const UserService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  async followUser(userId: number): Promise<void> {
    await api.post(`/users/${userId}/follow`);
  },

  async unfollowUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}/follow`);
  },

  async getFollowers(userId: number): Promise<User[]> {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  async getFollowing(userId: number): Promise<User[]> {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },
}; 