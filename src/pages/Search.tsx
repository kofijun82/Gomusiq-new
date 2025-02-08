import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, PlayCircle } from 'lucide-react';
import { useSearch } from '../lib/search';
import { usePlayer } from '../lib/player';
import { Song } from '../types';
import SongActions from '../components/SongActions';
import BackButton from '../components/BackButton';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [priceRange, setPriceRange] = useState<'all' | 'under1' | 'under5' | 'over5'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price'>('newest');
  
  const { results, isLoading, error, search } = useSearch();
  const { setCurrentSong, setQueue, setIsPlaying } = usePlayer();

  useEffect(() => {
    if (searchQuery.trim()) {
      const filters = {
        genre: selectedGenre || undefined,
        priceRange,
        sortBy,
      };
      search(searchQuery, filters);
    }
  }, [searchQuery, selectedGenre, priceRange, sortBy]);

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    setQueue([song]);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-4xl font-bold">Search</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : searchQuery && results.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((song) => (
            <div key={song.id} className="bg-gray-800 rounded-lg p-4 flex gap-4 hover:bg-gray-700 transition group">
              <div className="relative">
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  onClick={() => handlePlay(song)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all"
                >
                  <PlayCircle className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-gray-400">{(song as any).artist?.artist_name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {song.genre.charAt(0).toUpperCase() + song.genre.slice(1)} • {song.plays.toLocaleString()} plays
                </p>
                <SongActions song={song} className="mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;