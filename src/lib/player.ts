// Player state management using Zustand with persistence
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song } from '../types';

// Define the player state interface
interface PlayerState {
  currentSong: Song | null;        // Currently playing song
  isPlaying: boolean;              // Playback state
  volume: number;                  // Player volume (0-1)
  queue: Song[];                   // Playlist queue
  playbackProgress: number;        // Current playback position
  isExpanded: boolean;             // Player UI state
  recentlyPlayed: Song[];         // History of played songs
  likedSongs: Set<string>;        // Set of liked song IDs
  
  // Player control methods
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setQueue: (queue: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  setPlaybackProgress: (progress: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  shuffleQueue: () => void;
  setIsExpanded: (isExpanded: boolean) => void;
  addToRecentlyPlayed: (song: Song) => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
}

// Create the player store with persistence
const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSong: null,
      isPlaying: false,
      volume: 1,
      queue: [],
      playbackProgress: 0,
      isExpanded: false,
      recentlyPlayed: [],
      likedSongs: new Set(),
      
      // Set current song and update recently played
      setCurrentSong: (song) => {
        set({ currentSong: song });
        if (song) {
          get().addToRecentlyPlayed(song);
        }
      },

      // Basic playback controls
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setQueue: (queue) => set({ queue }),
      
      // Queue management
      addToQueue: (song) => set((state) => ({ 
        queue: [...state.queue, song] 
      })),
      removeFromQueue: (songId) => set((state) => ({
        queue: state.queue.filter((song) => song.id !== songId)
      })),
      
      // Progress tracking
      setPlaybackProgress: (progress) => set({ playbackProgress: progress }),
      setIsExpanded: (isExpanded) => set({ isExpanded }),
      
      // Play next song in queue
      playNext: () => {
        const { currentSong, queue } = get();
        if (!currentSong || queue.length === 0) return;
        
        const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
        if (currentIndex === -1 || currentIndex === queue.length - 1) {
          set({ currentSong: queue[0] }); // Loop to start
        } else {
          set({ currentSong: queue[currentIndex + 1] });
        }
      },
      
      // Play previous song in queue
      playPrevious: () => {
        const { currentSong, queue } = get();
        if (!currentSong || queue.length === 0) return;
        
        const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
        if (currentIndex === -1 || currentIndex === 0) {
          set({ currentSong: queue[queue.length - 1] }); // Loop to end
        } else {
          set({ currentSong: queue[currentIndex - 1] });
        }
      },

      // Shuffle the queue while keeping current song first
      shuffleQueue: () => {
        const { queue, currentSong } = get();
        if (!currentSong || queue.length <= 1) return;

        const remainingQueue = queue.filter(song => song.id !== currentSong.id);
        
        // Fisher-Yates shuffle algorithm
        for (let i = remainingQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingQueue[i], remainingQueue[j]] = [remainingQueue[j], remainingQueue[i]];
        }

        set({ queue: [currentSong, ...remainingQueue] });
      },

      // Add song to recently played, keeping only last 20
      addToRecentlyPlayed: (song) => set((state) => {
        const newRecentlyPlayed = [
          song,
          ...state.recentlyPlayed.filter(s => s.id !== song.id)
        ].slice(0, 20);
        return { recentlyPlayed: newRecentlyPlayed };
      }),

      // Like/unlike song
      toggleLike: (songId) => set((state) => {
        const newLikedSongs = new Set(state.likedSongs);
        if (newLikedSongs.has(songId)) {
          newLikedSongs.delete(songId);
        } else {
          newLikedSongs.add(songId);
        }
        return { likedSongs: newLikedSongs };
      }),

      // Check if song is liked
      isLiked: (songId) => get().likedSongs.has(songId),
    }),
    {
      // Persistence configuration
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        likedSongs: Array.from(state.likedSongs),
        recentlyPlayed: state.recentlyPlayed,
      }),
      onRehydrateStorage: () => (state) => {
        // Convert liked songs array back to Set after rehydration
        if (state && Array.isArray(state.likedSongs)) {
          state.likedSongs = new Set(state.likedSongs);
        }
      },
    }
  )
);

export { usePlayer };