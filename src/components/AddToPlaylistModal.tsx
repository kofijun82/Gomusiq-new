import React from 'react';
import { X, Plus } from 'lucide-react';
import { usePlaylists } from '../lib/playlists';
import { Song } from '../types';

interface AddToPlaylistModalProps {
  song: Song;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ song, onClose }) => {
  const { playlists, addSongToPlaylist } = usePlaylists();

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {playlists.map(playlist => (
            <button
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-700 rounded-lg transition group"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{playlist.title}</h3>
                <p className="text-sm text-gray-400">
                  {playlist.songs.length} songs
                </p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}

          {playlists.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No playlists found. Create a playlist first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;