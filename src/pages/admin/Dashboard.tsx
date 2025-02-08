import React, { useEffect, useState, useRef } from 'react';
import { BarChart3, DollarSign, Music2, Users, CheckCircle, XCircle, BadgeCheck, Trash2, LineChart, AlertTriangle, Ban, ChevronDown } from 'lucide-react';
import { useAdmin } from '../../lib/admin';
import { logger } from '../../lib/logger';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'reports'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const {
    pendingSongs,
    artists,
    purchases,
    analytics,
    systemHealth,
    isLoading,
    error,
    fetchPendingSongs,
    fetchArtists,
    fetchAnalytics,
    fetchPurchases,
    fetchSystemHealth,
    approveSong,
    rejectSong,
    deleteSong,
    verifyArtist,
    banUser,
    generateReport,
  } = useAdmin();

  useEffect(() => {
    fetchPendingSongs();
    fetchArtists();
    fetchAnalytics();
    fetchPurchases();
    fetchSystemHealth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await deleteSong(songId);
      setShowDeleteConfirm(null);
      logger.info('Song deleted successfully', { songId });
    } catch (err) {
      logger.error('Failed to delete song', err as Error);
    }
  };

  const handleGenerateReport = async (type: string) => {
    try {
      const report = await generateReport(type);
      logger.info('Report generated successfully', { type, data: report });
    } catch (err) {
      logger.error('Failed to generate report', err as Error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        
        {/* Mobile Menu */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => handleTabChange('overview')}
                className={`w-full text-left px-4 py-2 ${
                  activeTab === 'overview'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabChange('content')}
                className={`w-full text-left px-4 py-2 ${
                  activeTab === 'content'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => handleTabChange('users')}
                className={`w-full text-left px-4 py-2 ${
                  activeTab === 'users'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => handleTabChange('reports')}
                className={`w-full text-left px-4 py-2 ${
                  activeTab === 'reports'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Reports
              </button>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'overview'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'content'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'users'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'reports'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Sales</p>
                  <p className="text-2xl font-bold">{analytics.totalSales}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Artists</p>
                  <p className="text-2xl font-bold">{analytics.totalArtists}</p>
                </div>
                <Music2 className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* System Health */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Server Status</h3>
                  <div className={`h-3 w-3 rounded-full ${
                    systemHealth.serverStatus === 'healthy'
                      ? 'bg-green-500'
                      : systemHealth.serverStatus === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`} />
                </div>
                <p className="text-gray-400">CPU: {systemHealth.cpuUsage}%</p>
                <p className="text-gray-400">Memory: {systemHealth.memoryUsage}%</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-medium mb-4">Storage Usage</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                        {systemHealth.storageUsage}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div
                      style={{ width: `${systemHealth.storageUsage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-medium mb-4">API Performance</h3>
                <p className="text-gray-400">Response Time: {systemHealth.apiResponseTime}ms</p>
                <p className="text-gray-400">Error Rate: {systemHealth.apiErrorRate}%</p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'content' && (
        <>
          {/* Pending Songs */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Pending Songs</h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Artist</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Genre</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {pendingSongs.map((song) => (
                    <tr key={song.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={song.cover_url}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          {song.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">{(song as any).artist?.artist_name}</td>
                      <td className="px-6 py-4">{song.genre}</td>
                      <td className="px-6 py-4">${song.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveSong(song.id)}
                            className="text-green-500 hover:text-green-400"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => rejectSong(song.id)}
                            className="text-red-500 hover:text-red-400"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(song.id)}
                            className="text-gray-400 hover:text-gray-300"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Artist Management */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Artist Management</h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Artist</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Songs</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Total Sales</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {artists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {artist.artist_name}
                          {artist.verified && (
                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{(artist as any).user?.email}</td>
                      <td className="px-6 py-4">{(artist as any).songs?.count || 0}</td>
                      <td className="px-6 py-4">${artist.total_sales.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {!artist.verified && (
                          <button
                            onClick={() => verifyArtist(artist.id)}
                            className="text-blue-500 hover:text-blue-400"
                            title="Verify Artist"
                          >
                            <BadgeCheck className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeTab === 'users' && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {analytics.users?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || `https://source.unsplash.com/random/32x32?face&sig=${user.id}`}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                        {user.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_admin
                          ? 'bg-purple-500/20 text-purple-500'
                          : user.is_artist
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {user.is_admin ? 'Admin' : user.is_artist ? 'Artist' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => banUser(user.id)}
                        className="text-red-500 hover:text-red-400"
                        title={user.status === 'active' ? 'Ban User' : 'Unban User'}
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'reports' && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
          
          {/* Revenue Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Revenue Overview</h3>
              <button
                onClick={() => handleGenerateReport('revenue')}
                className="text-sm text-purple-500 hover:text-purple-400"
              >
                Export Report
              </button>
            </div>
            <div className="h-64 flex items-center justify-center">
              <LineChart className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-400">Chart visualization would go here</span>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">User Activity</h3>
              <button
                onClick={() => handleGenerateReport('users')}
                className="text-sm text-purple-500 hover:text-purple-400"
              >
                Export Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">New Users (24h)</p>
                <p className="text-2xl font-bold">+{analytics.newUsers24h}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">Active Users</p>
                <p className="text-2xl font-bold">{analytics.activeUsers}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">User Growth</p>
                <p className="text-2xl font-bold">+{analytics.userGrowth}%</p>
              </div>
            </div>
          </div>

          {/* Content Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Content Statistics</h3>
              <button
                onClick={() => handleGenerateReport('content')}
                className="text-sm text-purple-500 hover:text-purple-400"
              >
                Export Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">Total Songs</p>
                <p className="text-2xl font-bold">{analytics.totalSongs}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">New Songs (24h)</p>
                <p className="text-2xl font-bold">+{analytics.newSongs24h}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">Total Plays</p>
                <p className="text-2xl font-bold">{analytics.totalPlays}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 mb-1">Avg. Rating</p>
                <p className="text-2xl font-bold">{analytics.averageRating}/5</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium">Confirm Delete</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this song? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSong(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;