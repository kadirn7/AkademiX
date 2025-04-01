import api from './api';

export interface Publication {
  id: number;
  title: string;
  summary: string;
  content: string;
  keywords: string[];
  author: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface CreatePublicationData {
  title: string;
  summary: string;
  content: string;
  keywords: string[];
}

interface UpdatePublicationData extends Partial<CreatePublicationData> {}

export const PublicationService = {
  async createPublication(data: CreatePublicationData): Promise<Publication> {
    const response = await api.post('/publications', data);
    return response.data;
  },

  async getPublicationById(id: number): Promise<Publication> {
    const response = await api.get(`/publications/${id}`);
    return response.data;
  },

  async getAllPublications(): Promise<Publication[]> {
    const response = await api.get('/publications');
    return response.data;
  },

  async getPublicationsByAuthor(authorId: number): Promise<Publication[]> {
    const response = await api.get(`/publications/author/${authorId}`);
    return response.data;
  },

  async updatePublication(id: number, data: UpdatePublicationData): Promise<Publication> {
    const response = await api.put(`/publications/${id}`, data);
    return response.data;
  },

  async deletePublication(id: number): Promise<void> {
    await api.delete(`/publications/${id}`);
  },

  async likePublication(id: number): Promise<void> {
    await api.post(`/publications/${id}/like`);
  },

  async unlikePublication(id: number): Promise<void> {
    await api.delete(`/publications/${id}/like`);
  },

  async searchPublications(query: string): Promise<Publication[]> {
    const response = await api.get('/publications/search', {
      params: { query }
    });
    return response.data;
  },
}; 