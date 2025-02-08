import React, { useEffect, useState } from 'react';
import { BarChart3, DollarSign, Music2, PlayCircle, TrendingUp, Users, Download, Share2, MoreVertical } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Song } from '../../types';

// Mock data
const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist_id: 'artist1',
    cover_url: 'https://source.unsplash.com/random/400x400?summer+music',
    song_url: 'https://example.com/song1.mp3',
    price: 0.99,
    genre: 'pop',
    duration: 180,
    plays: 1200,
    status: 'approved',
    created_at: '2024-02-01T00:00:00Z',
    artist: { artist_name: 'DJ Awesome' }
  },
  {
    id: '2',
    title: 'Night Drive',
    artist_id: 'artist1',
    cover_url: 'https://source.unsplash.com/random/400x400?night+music',
    song_url: 'https://example.com/song2.mp3',
    price: 1.99,
    genre: 'electronic',
    duration: 240,
    plays: 800,
    status: 'pending',
    created_at: '2024-02-02T00:00:00Z',
    artist: { artist_name: 'DJ Awesome' }
  },
  {
    id: '3',
    title: 'Midnight Blues',
    artist_id: 'artist1',
    cover_url: 'https://source.unsplash.com/random/400x400?blues+music',
    song_url: 'https://example.com/song3.mp3',
    price: 1.49,
    genre: 'blues',
    duration: 195,
    plays: 600,
    status: 'approved',
    created_at: '2024-02-03T00:00:00Z',
    artist: { artist_name: 'DJ Awesome' }
  }
];

const ArtistDashboard = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('7days');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [stats, setStats] = useState({
    totalRevenue: 12458.99,
    totalSales: 1234,
    monthlyPlays: 45678,
    followers: 789,
    revenueGrowth: 15.4,
    playsGrowth: 23.7,
    salesGrowth: 8.9
  });
  
  const user = useAuth((state) => state.user);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setSongs(mockSongs);
    }, 500);
  }, []);

  const filteredSongs = songs.filter(song => 
    selectedGenre === 'all' || song.genre === selectedGenre
  );

  const genres = ['all', ...new Set(songs.map(song => song.genre))];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Artist Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.full_name}</p>
        </div>
        <button
          onClick={() => window.location.href = '/upload'}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Music2 className="w-5 h-5" />
          Upload New Track
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className={`text-sm ${stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}% from last month
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold">{stats.totalSales}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
          <div className={`text-sm ${stats.salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.salesGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.salesGrowth)}% from last month
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-400">Monthly Plays</p>
              <p className="text-2xl font-bold">{stats.monthlyPlays.toLocaleString()}</p>
            </div>
            <PlayCircle className="h-8 w-8 text-purple-500" />
          </div>
          <div className={`text-sm ${stats.playsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.playsGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.playsGrowth)}% from last month
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-400">Followers</p>
              <p className="text-2xl font-bold">{stats.followers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="text-sm text-green-500">
            ↑ 12% from last month
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Performance Overview</h2>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="bg-gray-700 rounded-lg px-4 py-2"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <button className="text-purple-500 hover:text-purple-400">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-gray-400" />
          <span className="ml-2 text-gray-400">Chart visualization would go here</span>
        </div>
      </div>

      {/* Recent Tracks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Tracks</h2>
          <div className="flex gap-4">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-700 rounded-lg px-4 py-2"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Track</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Genre</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Plays</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Sales</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSongs.map((song) => (
                <tr key={song.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(song.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{song.genre}</td>
                  <td className="px-6 py-4">{song.plays.toLocaleString()}</td>
                  <td className="px-6 py-4">123</td>
                  <td className="px-6 py-4">${(song.price * 123 * 0.7).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      song.status === 'approved'
                        ? 'bg-green-500/20 text-green-500'
                        : song.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSongs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No tracks found. Upload your first track to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;