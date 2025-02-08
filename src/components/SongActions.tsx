import React from 'react';
import { ShoppingCart, Download, PlayCircle } from 'lucide-react';
import { useStore } from '../lib/store';
import { Song } from '../types';
import { formatPrice } from '../lib/currency';

interface SongActionsProps {
  song: Song;
  showPrice?: boolean;
  className?: string;
  onPlay?: () => void;
}

const SongActions: React.FC<SongActionsProps> = ({ song, showPrice = true, className = '', onPlay }) => {
  const { purchaseSong, downloadSong, hasPurchased, isProcessing } = useStore();

  const handlePurchase = async () => {
    try {
      await purchaseSong(song);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadSong(song.song_url, song.title);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isPurchased = hasPurchased(song.id);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isPurchased ? (
        <>
          <button
            onClick={handleDownload}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          {onPlay && (
            <button
              onClick={onPlay}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition"
            >
              <PlayCircle className="w-4 h-4" />
              Play
            </button>
          )}
        </>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {showPrice ? formatPrice(song.price) : 'Buy'}
        </button>
      )}
    </div>
  );
};

export default SongActions;