import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, PlayCircle, Plus, Trash2, Music2, ChevronDown } from 'lucide-react';
import { usePlayer } from '../lib/player';
import { useStore } from '../lib/store';
import { usePlaylists } from '../lib/playlists';
import { Song } from '../types';
import { mockSongs } from '../lib/mockData';
import SongActions from '../components/SongActions';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'purchased' | 'playlists' | 'liked' | 'recent'>('purchased');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [songToAdd, setSongToAdd] = useState<Song | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const { recentlyPlayed, likedSongs, setCurrentSong, setQueue, setIsPlaying, isLiked, toggleLike } = usePlayer();
  const { purchasedSongs } = useStore();
  const { playlists, createPlaylist, deletePlaylist, getPlaylist } = usePlaylists();

  const handlePlay = (songs: Song[], index: number) => {
    setCurrentSong(songs[index]);
    setQueue(songs);
    setIsPlaying(true);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  const currentPlaylist = selectedPlaylist ? getPlaylist(selectedPlaylist) : null;
  const purchasedSongsList = Array.from(purchasedSongs).map(id => 
    mockSongs.find(song => song.id === id)
  ).filter((song): song is Song => song !== undefined);

  const renderSongList = (songs: Song[]) => (
    <div className="space-y-2">
      {/* Table Headers - Hidden on Mobile */}
      <div className="hidden md:grid md:grid-cols-12 text-gray-400 text-sm py-2 px-4">
        <div className="col-span-6">TITLE</div>
        <div className="col-span-3">ARTIST</div>
        <div className="col-span-2">DATE ADDED</div>
        <div className="col-span-1 flex justify-end"><Clock className="h-4 w-4" /></div>
      </div>

      {/* Songs */}
      {songs.map((song, i) => (
        <div key={song.id} className="flex flex-col md:grid md:grid-cols-12 items-center hover:bg-gray-800 rounded-lg p-4 gap-4 md:gap-0">
          {/* Mobile Song Info */}
          <div className="w-full md:col-span-6 flex items-center gap-4">
            <div className="relative group/play">
              <img
                src={song.cover_url}
                alt={song.title}
                className="w-16 h-16 md:w-10 md:h-10 rounded"
              />
              <button
                onClick={() => handlePlay(songs, i)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover/play:bg-opacity-50 transition-all"
              >
                <PlayCircle className="w-8 h-8 md:w-6 md:h-6 text-white opacity-0 group-hover/play:opacity-100 transition-all" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{song.title}</h3>
              <Link
                to={`/artist/${song.artist_id}`}
                className="text-gray-400 hover:text-purple-500 transition md:hidden"
              >
                {(song as any).artist?.artist_name}
              </Link>
            </div>
          </div>

          {/* Desktop Only Info */}
          <div className="hidden md:block md:col-span-3">
            <Link
              to={`/artist/${song.artist_id}`}
              className="text-gray-400 hover:text-purple-500 transition"
            >
              {(song as any).artist?.artist_name}
            </Link>
          </div>
          <div className="hidden md:block md:col-span-2 text-sm text-gray-400">
            {new Date(song.created_at).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="w-full md:w-auto md:col-span-1 flex justify-between md:justify-end items-center gap-4">
            <button
              onClick={() => toggleLike(song.id)}
              className={`${
                isLiked(song.id) ? 'text-purple-500' : 'text-gray-400'
              } hover:text-purple-500 transition`}
            >
              <Heart className="h-5 w-5 md:h-4 md:w-4" fill={isLiked(song.id) ? 'currentColor' : 'none'} />
            </button>
            <SongActions song={song} showPrice={false} />
            <span className="text-gray-400">
              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      ))}

      {songs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No songs found in this section.
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Your Library</h1>
        
        {/* Mobile Dropdown */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 rounded-lg"
          >
            <span className="capitalize">{activeTab}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showMobileMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
              {['purchased', 'playlists', 'liked', 'recent'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as typeof activeTab)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 capitalize"
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-4 border-b border-gray-800">
          <button 
            onClick={() => handleTabChange('purchased')}
            className={`px-4 py-2 ${
              activeTab === 'purchased' 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Purchased
          </button>
          <button 
            onClick={() => handleTabChange('playlists')}
            className={`px-4 py-2 ${
              activeTab === 'playlists' 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Playlists
          </button>
          <button 
            onClick={() => handleTabChange('liked')}
            className={`px-4 py-2 ${
              activeTab === 'liked' 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Liked
          </button>
          <button 
            onClick={() => handleTabChange('recent')}
            className={`px-4 py-2 ${
              activeTab === 'recent' 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recently Played
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'playlists' && !selectedPlaylist ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="aspect-square bg-gray-800 rounded-lg flex flex-col items-center justify-center gap-4 hover:bg-gray-700 transition"
          >
            <Plus className="w-12 h-12 text-purple-500" />
            <span className="font-medium">Create Playlist</span>
          </button>

          {playlists.map(playlist => (
            <div key={playlist.id} className="group relative">
              <div 
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedPlaylist(playlist.id)}
              >
                {playlist.songs.length > 0 ? (
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="font-medium truncate">{playlist.title}</h3>
                <p className="text-sm text-gray-400">{playlist.songs.length} songs</p>
              </div>
              <button
                onClick={() => deletePlaylist(playlist.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        renderSongList(
          activeTab === 'purchased' ? purchasedSongsList :
          activeTab === 'liked' ? mockSongs.filter(song => likedSongs.has(song.id)) :
          activeTab === 'playlists' && currentPlaylist ? currentPlaylist.songs :
          recentlyPlayed
        )
      )}

      {/* Modals */}
      {showCreatePlaylist && (
        <CreatePlaylistModal
          onClose={() => setShowCreatePlaylist(false)}
          onSubmit={createPlaylist}
        />
      )}

      {songToAdd && (
        <AddToPlaylistModal
          song={songToAdd}
          onClose={() => setSongToAdd(null)}
        />
      )}
    </div>
  );
};

export default Library;