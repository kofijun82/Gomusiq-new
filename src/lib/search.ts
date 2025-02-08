import { create } from 'zustand';
import { supabase } from './supabase';
import { Song } from '../types';
import { logger } from './logger';

interface SearchFilters {
  genre?: string;
  priceRange?: 'all' | 'under1' | 'under5' | 'over5';
  sortBy?: 'newest' | 'popular' | 'price';
}

interface SearchState {
  results: Song[];
  isLoading: boolean;
  error: string | null;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  searchArtists: (query: string) => Promise<any[]>;
  getRecommendations: (songId: string) => Promise<Song[]>;
  getTrendingInGenre: (genre: string) => Promise<Song[]>;
}

export const useSearch = create<SearchState>((set) => ({
  results: [],
  isLoading: false,
  error: null,

  search: async (query, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let searchQuery = supabase
        .from('songs')
        .select(`
          *,
          artist:artists (
            artist_name,
            verified
          )
        `)
        .eq('status', 'approved')
        .or(`title.ilike.%${query}%,artist.artist_name.ilike.%${query}%`);

      // Apply filters
      if (filters.genre) {
        searchQuery = searchQuery.eq('genre', filters.genre);
      }

      if (filters.priceRange) {
        switch (filters.priceRange) {
          case 'under1':
            searchQuery = searchQuery.lt('price', 1);
            break;
          case 'under5':
            searchQuery = searchQuery.lt('price', 5);
            break;
          case 'over5':
            searchQuery = searchQuery.gte('price', 5);
            break;
        }
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            searchQuery = searchQuery.order('created_at', { ascending: false });
            break;
          case 'popular':
            searchQuery = searchQuery.order('plays', { ascending: false });
            break;
          case 'price':
            searchQuery = searchQuery.order('price', { ascending: true });
            break;
        }
      }

      const { data, error } = await searchQuery;

      if (error) throw error;
      set({ results: data });
      logger.info('Search completed successfully');
    } catch (error) {
      logger.error('Search failed', error as Error);
      set({ error: 'Search failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  searchArtists: async (query) => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          user:users (
            full_name,
            avatar_url
          ),
          songs:songs (count)
        `)
        .or(`artist_name.ilike.%${query}%,user.full_name.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Artist search failed', error as Error);
      throw new Error('Artist search failed');
    }
  },

  getRecommendations: async (songId) => {
    try {
      const { data, error } = await supabase.rpc('get_song_recommendations', {
        p_song_id: songId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get recommendations', error as Error);
      throw new Error('Failed to get recommendations');
    }
  },

  getTrendingInGenre: async (genre) => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('genre', genre)
        .eq('status', 'approved')
        .order('plays', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get trending songs', error as Error);
      throw new Error('Failed to get trending songs');
    }
  },
}));