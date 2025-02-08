import { create } from 'zustand';
import { mockSongs } from './mockData';
import { Song } from '../types';

interface RecommendationsState {
  recommendedSongs: Song[];
  trendingSongs: Song[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
  fetchTrending: () => Promise<void>;
}

export const useRecommendations = create<RecommendationsState>((set) => ({
  recommendedSongs: [],
  trendingSongs: [],
  isLoading: false,
  error: null,

  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get 6 random songs for recommendations
      const shuffled = [...mockSongs].sort(() => 0.5 - Math.random());
      set({ recommendedSongs: shuffled.slice(0, 6) });
    } catch (error) {
      set({ error: 'Failed to fetch recommendations' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrending: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sort by plays and get top 6
      const trending = [...mockSongs]
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 6);
      
      set({ trendingSongs: trending });
    } catch (error) {
      set({ error: 'Failed to fetch trending songs' });
    } finally {
      set({ isLoading: false });
    }
  },
}));