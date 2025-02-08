import React, { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { usePlayer } from '../lib/player';
import { useRecommendations } from '../lib/recommendations';
import { Song } from '../types';
import SongActions from '../components/SongActions';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { recommendedSongs, trendingSongs, fetchRecommendations, fetchTrending } = useRecommendations();
  const { setCurrentSong, setQueue, setIsPlaying } = usePlayer();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchRecommendations(),
        fetchTrending()
      ]);
    } catch (err) {
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const playSong = (songs: Song[], index: number) => {
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

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Recommended Songs */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {recommendedSongs.map((song, i) => (
            <div key={song.id} className="space-y-2">
              <div className="relative group">
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => playSong(recommendedSongs, i)}
                >
                  <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>
              </div>
              <div>
                <h3 className="font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{(song as any).artist?.artist_name}</p>
              </div>
              <SongActions song={song} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Songs */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {trendingSongs.map((song, i) => (
            <div key={song.id} className="space-y-2">
              <div className="relative group">
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => playSong(trendingSongs, i)}
                >
                  <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>
              </div>
              <div>
                <h3 className="font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{(song as any).artist?.artist_name}</p>
              </div>
              <SongActions song={song} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;