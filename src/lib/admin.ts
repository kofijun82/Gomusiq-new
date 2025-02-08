import { create } from 'zustand';
import { mockSongs, mockArtists, mockPurchases } from './mockData';
import { Song, Artist, Purchase } from '../types';
import { logger } from './logger';

interface Analytics {
  totalRevenue: number;
  totalSales: number;
  totalArtists: number;
  totalUsers: number;
  totalSongs: number;
  newSongs24h: number;
  totalPlays: number;
  averageRating: number;
  newUsers24h: number;
  activeUsers: number;
  userGrowth: number;
  users: Array<{
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    is_admin: boolean;
    is_artist: boolean;
    status: 'active' | 'banned';
  }>;
}

interface SystemHealth {
  serverStatus: 'healthy' | 'warning' | 'error';
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  apiResponseTime: number;
  apiErrorRate: number;
}

interface AdminState {
  pendingSongs: Song[];
  artists: Artist[];
  purchases: Purchase[];
  analytics: Analytics;
  systemHealth: SystemHealth;
  isLoading: boolean;
  error: string | null;
  fetchPendingSongs: () => Promise<void>;
  approveSong: (songId: string) => Promise<void>;
  rejectSong: (songId: string) => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  fetchArtists: () => Promise<void>;
  verifyArtist: (artistId: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  generateReport: (type: string) => Promise<any>;
}

export const useAdmin = create<AdminState>((set, get) => ({
  pendingSongs: [],
  artists: [],
  purchases: [],
  analytics: {
    totalRevenue: 0,
    totalSales: 0,
    totalArtists: 0,
    totalUsers: 0,
    totalSongs: 0,
    newSongs24h: 0,
    totalPlays: 0,
    averageRating: 0,
    newUsers24h: 0,
    activeUsers: 0,
    userGrowth: 0,
    users: [],
  },
  systemHealth: {
    serverStatus: 'healthy',
    cpuUsage: 0,
    memoryUsage: 0,
    storageUsage: 0,
    apiResponseTime: 0,
    apiErrorRate: 0,
  },
  isLoading: false,
  error: null,

  fetchPendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock songs for pending status
      const pendingSongs = mockSongs.filter(song => song.status === 'pending');
      set({ pendingSongs });
      
      logger.info('Pending songs fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch pending songs', error as Error);
      set({ error: 'Failed to fetch pending songs' });
    } finally {
      set({ isLoading: false });
    }
  },

  approveSong: async (songId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      set(state => ({
        pendingSongs: state.pendingSongs.filter(song => song.id !== songId),
      }));
      
      logger.info('Song approved successfully', { songId });
    } catch (error) {
      logger.error('Failed to approve song', error as Error);
      set({ error: 'Failed to approve song' });
    }
  },

  rejectSong: async (songId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      set(state => ({
        pendingSongs: state.pendingSongs.filter(song => song.id !== songId),
      }));
      
      logger.info('Song rejected successfully', { songId });
    } catch (error) {
      logger.error('Failed to reject song', error as Error);
      set({ error: 'Failed to reject song' });
    }
  },

  deleteSong: async (songId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      set(state => ({
        pendingSongs: state.pendingSongs.filter(song => song.id !== songId),
      }));
      
      logger.info('Song deleted successfully', { songId });
    } catch (error) {
      logger.error('Failed to delete song', error as Error);
      set({ error: 'Failed to delete song' });
    }
  },

  fetchArtists: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ artists: mockArtists });
      
      logger.info('Artists fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch artists', error as Error);
      set({ error: 'Failed to fetch artists' });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyArtist: async (artistId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      set(state => ({
        artists: state.artists.map(artist =>
          artist.id === artistId ? { ...artist, verified: true } : artist
        ),
      }));
      
      logger.info('Artist verified successfully', { artistId });
    } catch (error) {
      logger.error('Failed to verify artist', error as Error);
      set({ error: 'Failed to verify artist' });
    }
  },

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock analytics data
      const analytics: Analytics = {
        totalRevenue: 15789.99,
        totalSales: 1234,
        totalArtists: 89,
        totalUsers: 5678,
        totalSongs: 3456,
        newSongs24h: 45,
        totalPlays: 98765,
        averageRating: 4.7,
        newUsers24h: 123,
        activeUsers: 2345,
        userGrowth: 15,
        users: [
          {
            id: '1',
            full_name: 'John Doe',
            email: 'john@example.com',
            avatar_url: 'https://source.unsplash.com/random/32x32?face&sig=1',
            is_admin: false,
            is_artist: true,
            status: 'active',
          },
          {
            id: '2',
            full_name: 'Jane Smith',
            email: 'jane@example.com',
            avatar_url: 'https://source.unsplash.com/random/32x32?face&sig=2',
            is_admin: false,
            is_artist: false,
            status: 'active',
          },
        ],
      };
      
      set({ analytics });
      logger.info('Analytics fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch analytics', error as Error);
      set({ error: 'Failed to fetch analytics' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPurchases: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ purchases: mockPurchases });
      
      logger.info('Purchases fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch purchases', error as Error);
      set({ error: 'Failed to fetch purchases' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSystemHealth: async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock system health data
      const systemHealth: SystemHealth = {
        serverStatus: 'healthy',
        cpuUsage: 45,
        memoryUsage: 62,
        storageUsage: 78,
        apiResponseTime: 234,
        apiErrorRate: 0.5,
      };
      
      set({ systemHealth });
      
      logger.info('System health fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch system health', error as Error);
      set({ error: 'Failed to fetch system health' });
    }
  },

  banUser: async (userId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      set(state => ({
        analytics: {
          ...state.analytics,
          users: state.analytics.users.map(user =>
            user.id === userId
              ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
              : user
          ),
        },
      }));
      
      logger.info('User ban status updated successfully', { userId });
    } catch (error) {
      logger.error('Failed to update user ban status', error as Error);
      set({ error: 'Failed to update user ban status' });
    }
  },

  generateReport: async (type: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock report data based on type
      const report = {
        timestamp: new Date().toISOString(),
        type,
        data: {
          // Mock data would go here based on report type
        },
      };
      
      logger.info('Report generated successfully', { type });
      return report;
    } catch (error) {
      logger.error('Failed to generate report', error as Error);
      throw new Error('Failed to generate report');
    }
  },
}));