import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song } from '../types';
import { logger } from './logger';

interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  songs: Song[];
  createdAt: string;
}

interface PlaylistsState {
  playlists: Playlist[];
  createPlaylist: (title: string, description?: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  getPlaylist: (playlistId: string) => Playlist | undefined;
}

export const usePlaylists = create<PlaylistsState>()(
  persist(
    (set, get) => ({
      playlists: [],

      createPlaylist: (title: string, description?: string) => {
        const newPlaylist: Playlist = {
          id: `playlist-${Date.now()}`,
          title,
          description,
          coverUrl: 'https://source.unsplash.com/random/400x400?abstract',
          songs: [],
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          playlists: [newPlaylist, ...state.playlists]
        }));

        logger.info('Playlist created successfully', { title });
      },

      addSongToPlaylist: (playlistId: string, song: Song) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: [...playlist.songs, song],
                  // Update cover with the latest song's cover
                  coverUrl: playlist.songs.length === 0 ? song.cover_url : playlist.coverUrl
                }
              : playlist
          )
        }));

        logger.info('Song added to playlist', { playlistId, songId: song.id });
      },

      removeSongFromPlaylist: (playlistId: string, songId: string) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: playlist.songs.filter(song => song.id !== songId)
                }
              : playlist
          )
        }));

        logger.info('Song removed from playlist', { playlistId, songId });
      },

      deletePlaylist: (playlistId: string) => {
        set(state => ({
          playlists: state.playlists.filter(playlist => playlist.id !== playlistId)
        }));

        logger.info('Playlist deleted', { playlistId });
      },

      getPlaylist: (playlistId: string) => {
        return get().playlists.find(playlist => playlist.id === playlistId);
      },
    }),
    {
      name: 'playlists-storage',
    }
  )
);