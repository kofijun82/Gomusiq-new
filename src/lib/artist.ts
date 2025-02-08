import { create } from 'zustand';
import { supabase } from './supabase';
import { logger } from './logger';

interface ArtistStats {
  totalRevenue: number;
  totalSales: number;
  totalPlays: number;
  followers: number;
  revenueGrowth: number;
  playsGrowth: number;
  salesGrowth: number;
}

interface ArtistState {
  stats: ArtistStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  scheduleRelease: (songId: string, releaseDate: string) => Promise<void>;
  getPromotionalTools: () => Promise<any[]>;
  getRoyaltyReport: (timeRange: string) => Promise<any>;
  getFanEngagementMetrics: () => Promise<any>;
}

export const useArtist = create<ArtistState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('get_artist_stats');

      if (error) throw error;
      set({ stats: data });
      logger.info('Artist stats fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch artist stats', error as Error);
      set({ error: 'Failed to fetch artist stats' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      const { error } = await supabase
        .from('artists')
        .update(updates)
        .eq('user_id', supabase.auth.user()?.id);

      if (error) throw error;
      logger.info('Artist profile updated successfully');
    } catch (error) {
      logger.error('Failed to update artist profile', error as Error);
      throw new Error('Failed to update artist profile');
    }
  },

  scheduleRelease: async (songId, releaseDate) => {
    try {
      const { error } = await supabase
        .from('scheduled_releases')
        .insert([
          {
            song_id: songId,
            release_date: releaseDate
          }
        ]);

      if (error) throw error;
      logger.info('Release scheduled successfully');
    } catch (error) {
      logger.error('Failed to schedule release', error as Error);
      throw new Error('Failed to schedule release');
    }
  },

  getPromotionalTools: async () => {
    try {
      const { data, error } = await supabase
        .from('promotional_tools')
        .select('*')
        .eq('artist_id', supabase.auth.user()?.id);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get promotional tools', error as Error);
      throw new Error('Failed to get promotional tools');
    }
  },

  getRoyaltyReport: async (timeRange) => {
    try {
      const { data, error } = await supabase.rpc('get_royalty_report', {
        time_range: timeRange
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get royalty report', error as Error);
      throw new Error('Failed to get royalty report');
    }
  },

  getFanEngagementMetrics: async () => {
    try {
      const { data, error } = await supabase.rpc('get_fan_engagement_metrics');

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get fan engagement metrics', error as Error);
      throw new Error('Failed to get fan engagement metrics');
    }
  },
}));