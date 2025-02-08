import { create } from 'zustand';
import { mockUsers } from './mockData';

// User interface defining the structure of a user object
interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  is_artist: boolean;
  is_admin?: boolean;
  created_at: string;
}

// Authentication state interface
interface AuthState {
  user: User | null;           // Current authenticated user
  isLoading: boolean;          // Loading state for auth operations
  signIn: (email: string, password: string) => Promise<void>;  // Sign in function
  signUp: (email: string, password: string, fullName: string) => Promise<void>;  // Sign up function
  signOut: () => Promise<void>;  // Sign out function
  setUser: (user: User | null) => void;  // Set user function
  updateUser: (user: User) => Promise<void>;  // Update user function
}

// Create auth store using Zustand
export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  // Sign in implementation
  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would verify the password here
      // For demo purposes, any password works
      
      set({ user });
      localStorage.setItem('userId', user.id);
    } finally {
      set({ isLoading: false });
    }
  },

  // Sign up implementation
  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`, // Fixed string template syntax
        email,
        full_name: fullName,
        avatar_url: `https://source.unsplash.com/random/100x100?face&sig=${Date.now()}`,
        is_artist: false,
        created_at: new Date().toISOString(),
      };
      
      // In a real app, we would save the user to the database
      set({ user: newUser });
      localStorage.setItem('userId', newUser.id);
    } finally {
      set({ isLoading: false });
    }
  },

  // Sign out implementation
  signOut: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('userId');
    set({ user: null });
  },

  // Set user function
  setUser: (user) => set({ user, isLoading: false }),

  // Update user implementation
  updateUser: async (user) => {
    set({ isLoading: true });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user in state
      set({ user });
      
      // In a real app, we would also update the user in the database
    } finally {
      set({ isLoading: false });
    }
  },
}));