import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// This is a mock implementation. In a real app, you'd connect to a backend API
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (username === 'admin' && password === 'password') {
        const user: User = { 
          id: '1', 
          username, 
          email: 'admin@example.com', 
          role: 'admin' 
        };
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid credentials', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to login', isLoading: false });
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const user: User = { 
        id: Math.random().toString(36).substring(2, 9), 
        username, 
        email, 
        role: 'user' 
      };
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to register', isLoading: false });
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;