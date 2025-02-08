import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { Song } from '../types';
import SongActions from './SongActions';

interface SongCardProps {
  song: Song;
  onPlay: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => {
  return (
    <div className="space-y-2">
      <div className="relative group">
        <img
          src={song.cover_url}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer"
          onClick={onPlay}
        >
          <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-200" />
        </div>
      </div>
      <div>
        <h3 className="font-medium truncate">{song.title}</h3>
        <Link 
          to={`/artist/${song.artist_id}`}
          className="text-gray-400 text-sm hover:text-purple-500 transition truncate block"
        >
          {(song as any).artist?.artist_name}
        </Link>
      </div>
      <SongActions song={song} />
    </div>
  );
};

export default SongCard;