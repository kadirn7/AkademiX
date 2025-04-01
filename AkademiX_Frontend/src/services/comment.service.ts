import api from './api';
import { Publication } from './publication.service';

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
  publication: Publication;
  createdAt: string;
  updatedAt: string;
}

interface CreateCommentData {
  content: string;
  publicationId: number;
}

interface UpdateCommentData {
  content: string;
}

export const CommentService = {
  async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await api.post('/comments', data);
    return response.data;
  },

  async getCommentById(id: number): Promise<Comment> {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  async getCommentsByPublication(publicationId: number): Promise<Comment[]> {
    const response = await api.get(`/comments/publication/${publicationId}`);
    return response.data;
  },

  async updateComment(id: number, data: UpdateCommentData): Promise<Comment> {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  async deleteComment(id: number): Promise<void> {
    await api.delete(`/comments/${id}`);
  },
}; 