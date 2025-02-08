import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, Loader2, AlertTriangle } from 'lucide-react';
import { useUpload, SongMetadata } from '../lib/upload';
import { useAuth } from '../lib/auth';
import { logger } from '../lib/logger';
import BackButton from '../components/BackButton';

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const { isUploading, progress, uploadSong } = useUpload();
  const user = useAuth((state) => state.user);

  // Check if user has permission to upload
  const canUpload = user?.is_admin || user?.is_artist;

  if (!canUpload) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
        <p className="text-gray-400 mb-6">
          Only artists and administrators can upload music. If you're an artist and seeing this message,
          please contact support to verify your account.
        </p>
        <a
          href="/profile"
          className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Profile
        </a>
      </div>
    );
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
      setError(null);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError('Please select a song file');
      return;
    }

    if (!coverImage) {
      setError('Please upload cover art');
      return;
    }

    if (!title || !genre || !price) {
      setError('Please fill in all fields');
      return;
    }

    const metadata: SongMetadata = {
      title,
      genre,
      price: parseFloat(price),
      coverImage,
    };

    try {
      await uploadSong(selectedFile, metadata);
      // Reset form
      setSelectedFile(null);
      setCoverImage(null);
      setTitle('');
      setGenre('');
      setPrice('');
      setError(null);
      logger.info('Song uploaded successfully', { title, genre });
    } catch (err) {
      logger.error('Failed to upload song', err as Error);
      setError('Failed to upload song. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-4xl font-bold">Upload Your Music</h1>
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 text-purple-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading... {progress}%</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-purple-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="space-y-2">
            <UploadIcon className="mx-auto h-12 w-12 text-purple-500" />
            <p className="text-xl">{selectedFile.name}</p>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-sm text-purple-500 hover:text-purple-400"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl mb-2">Drag and drop your music file here</p>
            <p className="text-gray-400 mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition"
            >
              Browse Files
            </button>
          </>
        )}
        <p className="text-sm text-gray-400 mt-4">
          Supported formats: MP3, WAV, FLAC (max 50MB)
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Song Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Song Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter song title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a genre</option>
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="hiphop">Hip Hop</option>
              <option value="electronic">Electronic</option>
              <option value="jazz">Jazz</option>
              <option value="classical">Classical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter price"
            />
            <p className="text-sm text-gray-400 mt-1">
              You will receive 70% of each sale
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cover Art
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
              {coverImage ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover preview"
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="text-sm text-purple-500 hover:text-purple-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="text-purple-500 hover:text-purple-400"
                >
                  Upload Cover Art
                </button>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Recommended size: 1400x1400px
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
    </div>
  );
};

export default Upload;