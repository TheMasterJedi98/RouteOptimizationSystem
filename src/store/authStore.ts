/**
 * Authentication Store
 * 
 * This Zustand store manages user authentication state and operations.
 * It handles login, registration, logout, and maintains user session data.
 * 
 * Note: This is a mock implementation for demonstration purposes.
 * In a production app, this would connect to a real backend API.
 */
import { create } from 'zustand';
import { User } from '../types';

/**
 * Authentication State Interface
 * 
 * Defines the shape of the authentication store state and actions.
 */
interface AuthState {
  // State properties
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Action methods
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Authentication Store Implementation
 * 
 * Creates a Zustand store with authentication functionality.
 * Includes mock API calls with simulated delays and validation.
 */
const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  /**
   * Login Method
   * 
   * Authenticates a user with username and password.
   * Mock implementation with hardcoded credentials for demo.
   * 
   * @param username - User's username
   * @param password - User's password
   */
  login: async (username: string, password: string) => {
    // Set loading state
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login with hardcoded credentials
      if (username === 'admin' && password === 'password') {
        const user: User = { 
          id: '1', 
          username, 
          email: 'admin@example.com', 
          role: 'admin' 
        };
        // Update state with authenticated user
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // Handle invalid credentials
        set({ error: 'Invalid credentials', isLoading: false });
      }
    } catch (error) {
      // Handle unexpected errors
      set({ error: 'Failed to login', isLoading: false });
    }
  },
  
  /**
   * Register Method
   * 
   * Creates a new user account with provided information.
   * Mock implementation that always succeeds for demo purposes.
   * 
   * @param username - Desired username
   * @param email - User's email address
   * @param password - User's password
   */
  register: async (username: string, email: string, password: string) => {
    // Set loading state
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration - create new user
      const user: User = { 
        id: Math.random().toString(36).substring(2, 9), 
        username, 
        email, 
        role: 'user' 
      };
      
      // Update state with new authenticated user
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Handle registration errors
      set({ error: 'Failed to register', isLoading: false });
    }
  },
  
  /**
   * Logout Method
   * 
   * Clears user session and resets authentication state.
   */
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;