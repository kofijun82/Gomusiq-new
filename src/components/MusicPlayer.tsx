import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, Repeat, Shuffle, Heart, Lock, MoreVertical } from 'lucide-react';
import { usePlayer } from '../lib/player';
import { useStore } from '../lib/store';
import MusicVisualizer from './MusicVisualizer';

const MusicPlayer: React.FC = () => {
  const [showControls, setShowControls] = useState(false);
  const { 
    currentSong,
    isPlaying,
    volume,
    playbackProgress,
    queue,
    isExpanded,
    setIsPlaying,
    setVolume,
    setPlaybackProgress,
    playNext,
    playPrevious,
    shuffleQueue,
    setIsExpanded,
    toggleLike,
    isLiked
  } = usePlayer();

  if (!currentSong) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out z-50 ${
      isExpanded
        ? 'inset-0 bg-gradient-to-b from-gray-900 to-black'
        : 'h-20 md:h-24 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800'
    }`}>
      <div className={`h-full ${isExpanded ? 'p-4 md:p-8' : 'px-4 py-2 md:px-4 md:py-3'} ${!isExpanded ? 'md:ml-64' : ''}`}>
        <div className={`flex ${isExpanded ? 'flex-col h-full' : 'items-center justify-between h-full'}`}>
          {/* Mobile Toggle Controls */}
          <button
            className="absolute top-2 right-2 p-2 md:hidden"
            onClick={() => setShowControls(!showControls)}
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {/* Song Info */}
          <div className={`flex items-center gap-2 md:gap-4 ${isExpanded ? 'mb-8' : 'w-1/4'}`}>
            <img
              src={currentSong.cover_url}
              alt={currentSong.title}
              className={`object-cover rounded-lg ${
                isExpanded 
                  ? 'w-32 h-32 md:w-64 md:h-64' 
                  : 'w-12 h-12 md:w-16 md:h-16'
              }`}
            />
            <div className="min-w-0">
              <h4 className={`font-medium text-white truncate ${
                isExpanded ? 'text-xl md:text-2xl mb-2' : 'text-sm md:text-base'
              }`}>
                {currentSong.title}
              </h4>
              <p className={`text-gray-400 truncate ${
                isExpanded ? 'text-base md:text-lg' : 'text-xs md:text-sm'
              }`}>
                <Link
                  to={`/artist/${currentSong.artist_id}`}
                  className="hover:text-purple-500 transition"
                >
                  {(currentSong as any).artist?.artist_name}
                </Link>
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className={`flex-1 ${isExpanded ? 'flex flex-col items-center justify-center' : 'px-2 md:px-4'} ${
            !isExpanded && !showControls ? 'hidden md:block' : ''
          }`}>
            <div className="flex items-center justify-center gap-2 md:gap-6 mb-4">
              <button
                onClick={() => shuffleQueue()}
                className={`text-gray-400 hover:text-white transition`}
              >
                <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition"
              >
                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white rounded-full p-2 hover:bg-gray-200 transition"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-6 md:h-6 text-black" />
                ) : (
                  <Play className="w-4 h-4 md:w-6 md:h-6 text-black" />
                )}
              </button>
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition"
              >
                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => {}}
                className="text-gray-400 hover:text-white transition"
              >
                <Repeat className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-xs text-gray-400 hidden md:block">
                {Math.floor(playbackProgress / 60)}:{(playbackProgress % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 h-1 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(playbackProgress / currentSong.duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 hidden md:block">
                {Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {isExpanded && currentSong && (
              <div className="mt-4">
                <MusicVisualizer
                  audioUrl={currentSong.song_url}
                  isPlaying={isPlaying}
                />
              </div>
            )}
          </div>

          {/* Volume and Expand Controls */}
          <div className={`flex items-center gap-2 md:gap-4 ${
            isExpanded ? 'mt-8' : 'w-1/4 justify-end'
          } ${!isExpanded && !showControls ? 'hidden md:flex' : ''}`}>
            <button
              onClick={() => toggleLike(currentSong.id)}
              className={`text-gray-400 hover:text-white transition ${
                isLiked(currentSong.id) ? 'text-purple-500' : ''
              }`}
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5" fill={isLiked(currentSong.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="text-gray-400 hover:text-white transition"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 md:w-24 hidden md:block"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;