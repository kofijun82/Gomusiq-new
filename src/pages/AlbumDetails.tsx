import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, Share2, Heart, Clock, Download } from 'lucide-react';
import { usePlayer } from '../lib/player';
import { mockSongs } from '../lib/mockData';
import { formatDistanceToNow } from '../lib/utils';
import BackButton from '../components/BackButton';

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { setCurrentSong, setQueue, setIsPlaying, toggleLike, isLiked } = usePlayer();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Group songs by album
      const albumSongs = mockSongs.filter(song => song.album_id === id);
      if (albumSongs.length > 0) {
        setAlbum({
          id,
          title: albumSongs[0].album_title || 'Unknown Album',
          artist: albumSongs[0].artist,
          cover_url: albumSongs[0].cover_url,
          release_date: albumSongs[0].created_at,
          songs: albumSongs
        });
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handlePlay = (index: number) => {
    if (!album) return;
    setCurrentSong(album.songs[index]);
    setQueue(album.songs);
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Album not found</h2>
        <p className="text-gray-400">The album you're looking for doesn't exist.</p>
      </div>
    );
  }

  const totalDuration = album.songs.reduce((total: number, song: any) => total + song.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <BackButton />
        <h1 className="text-4xl font-bold">{album.title}</h1>
      </div>
      {/* Album Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={album.cover_url}
          alt={album.title}
          className="w-64 h-64 rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-end">
          <h1 className="text-4xl font-bold mb-4">{album.title}</h1>
          <div className="space-y-2">
            <Link
              to={`/artist/${album.artist.id}`}
              className="text-lg hover:text-purple-500"
            >
              {album.artist.artist_name}
            </Link>
            <p className="text-gray-400">
              Released {formatDistanceToNow(new Date(album.release_date))} •{' '}
              {album.songs.length} songs, {hours > 0 ? `${hours} hr ` : ''}{minutes} min
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handlePlay(0)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          <PlayCircle className="w-5 h-5" />
          Play
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Songs List */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-gray-400 text-sm py-2 px-4">
          <div className="col-span-6">TITLE</div>
          <div className="col-span-4">PLAYS</div>
          <div className="col-span-2 flex justify-end"><Clock className="h-4 w-4" /></div>
        </div>

        {album.songs.map((song: any, i: number) => (
          <div
            key={song.id}
            className="grid grid-cols-12 items-center hover:bg-gray-800 rounded-lg py-2 px-4 group"
          >
            <div className="col-span-6 flex items-center gap-4">
              <button
                onClick={() => handlePlay(i)}
                className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
              >
                <PlayCircle className="w-8 h-8" />
              </button>
              <span>{song.title}</span>
            </div>
            <div className="col-span-4 text-gray-400">
              {song.plays.toLocaleString()} plays
            </div>
            <div className="col-span-2 flex justify-end items-center gap-4">
              <button
                onClick={() => toggleLike(song.id)}
                className={`${
                  isLiked(song.id) ? 'text-purple-500' : 'text-gray-400'
                } hover:text-purple-500 transition opacity-0 group-hover:opacity-100`}
              >
                <Heart className="w-4 h-4" fill={isLiked(song.id) ? 'currentColor' : 'none'} />
              </button>
              <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100">
                <Download className="w-4 h-4" />
              </button>
              <span className="text-gray-400">
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetails;