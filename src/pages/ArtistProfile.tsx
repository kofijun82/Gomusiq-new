import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Music2, PlayCircle, Share2, Users, Heart, Instagram, Twitter, Globe, BarChart3, MoreVertical } from 'lucide-react';
import { usePlayer } from '../lib/player';
import { mockArtists, mockSongs } from '../lib/mockData';
import { formatDistanceToNow } from '../lib/utils';
import BackButton from '../components/BackButton';

const ArtistProfile: React.FC = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'popular' | 'albums' | 'about'>('popular');
  const [showActions, setShowActions] = useState(false);
  
  const { setCurrentSong, setQueue, setIsPlaying, toggleLike, isLiked } = usePlayer();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundArtist = mockArtists.find(a => a.id === id);
      const artistSongs = mockSongs.filter(s => s.artist_id === id);
      setArtist(foundArtist);
      setSongs(artistSongs);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handlePlay = (songs: any[], index: number) => {
    setCurrentSong(songs[index]);
    setQueue(songs);
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Artist not found</h2>
        <p className="text-gray-400">The artist you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Group songs by album
  const albums = songs.reduce((acc: any, song) => {
    const albumId = song.album_id || 'singles';
    if (!acc[albumId]) {
      acc[albumId] = {
        id: albumId,
        title: albumId === 'singles' ? 'Singles' : song.album_title || 'Unknown Album',
        cover_url: song.cover_url,
        release_date: song.created_at,
        songs: []
      };
    }
    acc[albumId].songs.push(song);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <BackButton />
        <h1 className="text-4xl font-bold">{artist.artist_name}</h1>
      </div>

      {/* Artist Header */}
      <div className="relative">
        <div className="h-48 md:h-64 w-full overflow-hidden">
          <img
            src={`https://source.unsplash.com/random/1200x400?concert&sig=${artist.id}`}
            alt={artist.artist_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
          <img
            src={`https://source.unsplash.com/random/200x200?artist&sig=${artist.id}`}
            alt={artist.artist_name}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-900"
          />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{artist.artist_name}</h1>
              {artist.verified && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Verified Artist
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300">
              <span className="flex items-center gap-2">
                <Music2 className="w-4 h-4" />
                {songs.length} Songs
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {artist.followers || 0} Followers
              </span>
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {songs.reduce((total: number, song: any) => total + song.plays, 0).toLocaleString()} Total Plays
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => handlePlay(songs, 0)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          <PlayCircle className="w-5 h-5" />
          Play All
        </button>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full flex items-center gap-2 md:hidden"
          >
            <MoreVertical className="w-5 h-5" />
            More
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full items-center gap-2 hidden md:flex"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          {showActions && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20 md:hidden">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Follow
              </button>
            </div>
          )}
        </div>
        <div className="flex-1"></div>
        <div className="hidden md:flex gap-4">
          {artist.social?.instagram && (
            <a
              href={artist.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {artist.social?.twitter && (
            <a
              href={artist.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {artist.social?.website && (
            <a
              href={artist.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'popular'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'albums'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Albums
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'popular' && (
        <div className="space-y-2">
          {songs
            .sort((a, b) => b.plays - a.plays)
            .slice(0, 10)
            .map((song, i) => (
              <div
                key={song.id}
                className="grid grid-cols-12 items-center hover:bg-gray-800 rounded-lg py-2 px-4 group"
              >
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <span className="text-gray-400 w-4 text-right">{i + 1}</span>
                  <div className="relative group/play">
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      className="w-10 h-10 rounded"
                    />
                    <button
                      onClick={() => handlePlay(songs, i)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover/play:bg-opacity-50 transition-all"
                    >
                      <PlayCircle className="w-6 h-6 text-white opacity-0 group-hover/play:opacity-100 transition-all" />
                    </button>
                  </div>
                  <span className="truncate">{song.title}</span>
                </div>
                <div className="hidden md:block md:col-span-3">{formatDistanceToNow(new Date(song.created_at))}</div>
                <div className="hidden md:block md:col-span-2">{song.plays.toLocaleString()} plays</div>
                <div className="col-span-12 md:col-span-1 flex justify-end items-center gap-4 mt-2 md:mt-0">
                  <button
                    onClick={() => toggleLike(song.id)}
                    className={`${
                      isLiked(song.id) ? 'text-purple-500' : 'text-gray-400'
                    } hover:text-purple-500 transition opacity-100 md:opacity-0 group-hover:opacity-100`}
                  >
                    <Heart className="h-4 w-4" fill={isLiked(song.id) ? 'currentColor' : 'none'} />
                  </button>
                  <span className="text-gray-400">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Object.values(albums).map((album: any) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="group"
            >
              <div className="relative aspect-square mb-4">
                <img
                  src={album.cover_url}
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>
              </div>
              <h3 className="font-medium truncate">{album.title}</h3>
              <p className="text-sm text-gray-400">
                {new Date(album.release_date).getFullYear()} • {album.songs.length} songs
              </p>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="max-w-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Biography</h2>
            <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 mb-2">Monthly Listeners</h3>
                <p className="text-3xl font-bold">
                  {(artist.monthly_listeners || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 mb-2">Total Plays</h3>
                <p className="text-3xl font-bold">
                  {songs.reduce((total, song) => total + song.plays, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 mb-2">Joined</h3>
                <p className="text-3xl font-bold">
                  {formatDistanceToNow(new Date(artist.created_at))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistProfile;