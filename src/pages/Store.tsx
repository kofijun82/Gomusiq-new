import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Filter, Heart } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../lib/player';
import { useStore } from '../lib/store';
import { useAuth } from '../lib/auth';
import { mockSongs } from '../lib/mockData';
import { formatPrice } from '../lib/currency';
import SongActions from '../components/SongActions';
import BackButton from '../components/BackButton';

const Store: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [priceRange, setPriceRange] = useState<'all' | 'under1' | 'under5' | 'over5'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { setCurrentSong, setQueue, setIsPlaying, toggleLike, isLiked } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    loadSongs();
  }, [selectedGenre, priceRange, sortBy]);

  const loadSongs = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredSongs = [...mockSongs];

      // Apply genre filter
      if (selectedGenre) {
        filteredSongs = filteredSongs.filter(song => song.genre === selectedGenre);
      }

      // Apply price filter
      switch (priceRange) {
        case 'under1':
          filteredSongs = filteredSongs.filter(song => song.price < 1);
          break;
        case 'under5':
          filteredSongs = filteredSongs.filter(song => song.price < 5);
          break;
        case 'over5':
          filteredSongs = filteredSongs.filter(song => song.price >= 5);
          break;
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filteredSongs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'popular':
          filteredSongs.sort((a, b) => b.plays - a.plays);
          break;
        case 'price':
          filteredSongs.sort((a, b) => a.price - b.price);
          break;
      }

      setSongs(filteredSongs);
    } catch (err) {
      setError('Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    setQueue([song]);
    setIsPlaying(true);
  };

  const genres = Array.from(new Set(mockSongs.map(song => song.genre)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-4xl font-bold">Music Store</h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Genre</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedGenre === ''
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm capitalize ${
                    selectedGenre === genre
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Prices' },
                { value: 'under1', label: `Under ${formatPrice(1)}` },
                { value: 'under5', label: `Under ${formatPrice(5)}` },
                { value: 'over5', label: `${formatPrice(5)} and up` },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setPriceRange(range.value as typeof priceRange)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    priceRange === range.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {songs.map((song) => (
          <div key={song.id} className="bg-gray-800 rounded-lg overflow-hidden group">
            <div className="relative aspect-square">
              <img
                src={song.cover_url}
                alt={song.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => handlePlay(song)}
                  className="bg-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-all duration-200 hover:bg-gray-100"
                >
                  <Play className="w-6 h-6 text-black" />
                </button>
              </div>
              <button
                onClick={() => toggleLike(song.id)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isLiked(song.id)
                    ? 'bg-purple-500 text-white'
                    : 'bg-black/50 text-white hover:bg-black/70'
                } opacity-0 group-hover:opacity-100 transition-all duration-200`}
              >
                <Heart className="w-4 h-4" fill={isLiked(song.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium truncate">{song.title}</h3>
              <Link 
                to={`/artist/${song.artist_id}`}
                className="text-gray-400 text-sm hover:text-purple-500 transition truncate block"
              >
                {(song as any).artist?.artist_name}
              </Link>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="font-medium">{formatPrice(song.price)}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {song.plays.toLocaleString()} plays
                  </span>
                </div>
                <SongActions song={song} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;