import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000/api';

export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  title?: string;
  institution?: string;
  bio?: string;
  profileImage?: string;
  createdAt?: string;
  // Profil ekranı için gereken istatistik alanları
  publications?: number;
  followers?: number;
  following?: number;
};

export type Publication = {
  id: number;
  title?: string;
  content?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  likes: number;
  liked?: boolean;
  comments: Comment[];
};

export type Comment = {
  id: number;
  content?: string;
  publicationId?: number;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API for development without backend
export const mockApi = {
  // User related mock functions
  async login(email: string, password: string) {
    const users = await this.getUsers();
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      // Generate a mock token
      const token = `mock-token-${Date.now()}`;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      return { data: { token, user: { ...user, password: undefined } } };
    }
    
    throw new Error('Invalid credentials');
  },
  
  async register(userData: Omit<User, 'id'>) {
    const users = await this.getUsers();
    
    // Check if user already exists
    if (users.some((u: User) => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    
    return { data: { user: { ...newUser, password: undefined } } };
  },
  
  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('currentUser');
    return { data: { success: true } };
  },
  
  async getCurrentUser() {
    const userStr = await AsyncStorage.getItem('currentUser');
    if (!userStr) throw new Error('Not authenticated');
    return { data: JSON.parse(userStr) };
  },
  
  // Publication related mock functions
  async getPublications() {
    const publications = await this.getPublicationData();
    return { data: publications };
  },
  
  async getPublicationById(id: number) {
    const publications = await this.getPublicationData();
    const publication = publications.find((p: Publication) => p.id === Number(id));
    
    if (!publication) {
      throw new Error('Publication not found');
    }
    
    return { data: publication };
  },
  
  async createPublication(data: Partial<Publication>) {
    const publications = await this.getPublicationData();
    const currentUser = JSON.parse(await AsyncStorage.getItem('currentUser') || '{}');
    
    const newPublication = {
      id: publications.length + 1,
      ...data,
      author: {
        id: currentUser.id,
        name: currentUser.name || currentUser.fullName
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: []
    };
    
    publications.push(newPublication);
    await AsyncStorage.setItem('publications', JSON.stringify(publications));
    
    return { data: newPublication };
  },
  
  // Helper functions
  async getUsers(): Promise<User[]> {
    const users = await AsyncStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },
  
  async getPublicationData(): Promise<Publication[]> {
    const publications = await AsyncStorage.getItem('publications');
    return publications ? JSON.parse(publications) : [];
  },
  
  // Initialize mock data
  async initMockData() {
    // Set some initial users if none exist
    const users = await this.getUsers();
    if (users.length === 0) {
      await AsyncStorage.setItem('users', JSON.stringify([
        {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'password',
          title: 'Professor',
          institution: 'Demo University',
          bio: 'This is a demo user for testing',
          profileImage: 'https://via.placeholder.com/100',
          publications: 1, // En az bir yayın olsun
          followers: 42,
          following: 15
        }
      ]));
    }
    
    // Set some initial publications if none exist
    const publications = await this.getPublicationData();
    if (publications.length === 0) {
      await AsyncStorage.setItem('publications', JSON.stringify([
        {
          id: 1,
          title: 'Introduction to Academic Research',
          content: 'This is a sample publication about academic research methods and best practices...',
          author: {
            id: 1,
            name: 'Demo User'
          },
          createdAt: new Date().toISOString(),
          likes: 5,
          liked: false,
          comments: [
            {
              id: 1,
              content: 'Great article!',
              author: {
                id: 1,
                name: 'Demo User'
              },
              createdAt: new Date().toISOString()
            }
          ]
        }
      ]));
    }
  },

  // New mock functions
  async getUserProfile(userId: number) {
    const users = await this.getUsers();
    const user = users.find((u: User) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Kullanıcının yayın, takipçi ve takip sayıları
    const publications = await this.getPublicationData();
    const userPubs = publications.filter((pub: Publication) => pub.author.id === userId);

    return { 
      data: {
        ...user,
        publications: userPubs.length,
        followers: Math.floor(Math.random() * 100), // Demo için rastgele değer
        following: Math.floor(Math.random() * 50)   // Demo için rastgele değer
      }
    };
  },

  async getUserPublications(userId: number) {
    const publications = await this.getPublicationData();
    const userPubs = publications.filter((pub: Publication) => pub.author.id === userId);
    return { data: userPubs };
  },

  async getCommentsByPublicationId(publicationId: number) {
    const publications = await this.getPublicationData();
    const publication = publications.find((p: Publication) => p.id === publicationId);
    if (!publication) {
      throw new Error('Publication not found');
    }
    return { data: publication.comments };
  },

  async createComment(commentData: Partial<Comment>) {
    const publications = await this.getPublicationData();
    const publication = publications.find((p: Publication) => p.id === commentData.publicationId);
    if (!publication) {
      throw new Error('Publication not found');
    }
    const newComment = {
      id: publication.comments.length + 1,
      ...commentData,
      author: {
        id: publication.author.id,
        name: publication.author.name
      },
      createdAt: new Date().toISOString()
    };
    publication.comments.push(newComment);
    await AsyncStorage.setItem('publications', JSON.stringify(publications));
    return { data: newComment };
  },

  async likePublication(publicationId: number) {
    const publications = await this.getPublicationData();
    const publication = publications.find((p: Publication) => p.id === publicationId);
    if (!publication) {
      throw new Error('Publication not found');
    }
    publication.likes += 1;
    await AsyncStorage.setItem('publications', JSON.stringify(publications));
    return { data: { success: true, publication: publication } };
  },

  async unlikePublication(publicationId: number) {
    const publications = await this.getPublicationData();
    const publication = publications.find((p: Publication) => p.id === publicationId);
    if (!publication || publication.likes === 0) {
      throw new Error('Publication not found or already unliked');
    }
    publication.likes -= 1;
    await AsyncStorage.setItem('publications', JSON.stringify(publications));
    return { data: { success: true, publication: publication } };
  }
};

// Initialize mock data when app starts
mockApi.initMockData();

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await AsyncStorage.removeItem('token');
      // We can't use window.location in React Native
      // Instead, we'll need a navigation solution from the app context
      // This will be handled by the screens that receive the 401 error
    }
    return Promise.reject(error);
  }
);

export default api; 