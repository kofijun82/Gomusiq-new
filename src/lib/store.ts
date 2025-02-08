import { create } from 'zustand';
import { Song } from '../types';
import { logger } from './logger';
import { processPayment } from './paystack';
import { useAuth } from './auth';
import { mockSongs } from './mockData';

// Store state interface
interface StoreState {
  isProcessing: boolean;          // Payment processing state
  purchasedSongs: Set<string>;    // Set of purchased song IDs
  purchaseSong: (song: Song) => Promise<void>;  // Purchase song function
  getPurchases: () => Promise<any[]>;           // Get purchase history
  downloadSong: (songUrl: string, title: string) => Promise<void>;  // Download song
  hasPurchased: (songId: string) => boolean;    // Check if song is purchased
}

// Create store with Zustand
export const useStore = create<StoreState>((set, get) => ({
  isProcessing: false,
  purchasedSongs: new Set(),

  // Handle song purchase with Paystack integration
  purchaseSong: async (song: Song) => {
    set({ isProcessing: true });

    try {
      const user = useAuth.getState().user;
      if (!user) throw new Error('User not authenticated');

      // Process payment using Paystack
      await processPayment({
        email: user.email,
        amount: song.price,
        callback: async (response) => {
          if (response.status === 'success') {
            // Update local state after successful purchase
            set(state => ({
              purchasedSongs: new Set([...state.purchasedSongs, song.id])
            }));

            logger.info('Purchase recorded successfully', { songId: song.id });
          }
        },
        onClose: () => {
          set({ isProcessing: false });
        }
      });
    } catch (error) {
      logger.error('Purchase failed', error as Error);
      set({ isProcessing: false });
      throw new Error('Purchase failed. Please try again.');
    }
  },

  // Get purchase history (mock implementation)
  getPurchases: async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const purchasedSongIds = Array.from(get().purchasedSongs);

      // Get purchased songs from mock data
      const purchasedSongs = mockSongs
        .filter(song => purchasedSongIds.includes(song.id))
        .map(song => ({
          id: `purchase-${song.id}`,
          song_id: song.id,
          amount: song.price,
          payment_status: 'completed',
          payment_ref: `mock_ref_${song.id}`,
          created_at: new Date().toISOString(),
          song
        }));

      return purchasedSongs;
    } catch (error) {
      logger.error('Failed to fetch purchases', error as Error);
      throw new Error('Failed to fetch purchases');
    }
  },

  // Download song (mock implementation)
  downloadSong: async (songUrl: string, title: string) => {
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('Song downloaded successfully', { title });
    } catch (error) {
      logger.error('Download failed', error as Error);
      throw new Error('Failed to download song');
    }
  },

  // Check if song is purchased
  hasPurchased: (songId: string) => {
    return get().purchasedSongs.has(songId);
  },
}));