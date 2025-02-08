import React, { useState, useRef } from 'react';
import { Settings, Edit2, Upload, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { logger } from '../lib/logger';

const Profile: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<{
    full_name: string;
    email: string;
    bio?: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuth((state) => state.user);
  const updateUser = useAuth((state) => state.updateUser);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create a mock URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      
      // Update user with new avatar URL
      await updateUser({ ...user!, avatar_url: imageUrl });

      logger.info('Profile picture updated successfully');
    } catch (err) {
      logger.error('Failed to update profile picture', err as Error);
      setError('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = () => {
    if (!user) return;
    setEditedProfile({
      full_name: user.full_name,
      email: user.email,
      bio: user.bio || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedProfile || !user) return;
    try {
      await updateUser({
        ...user,
        ...editedProfile,
      });
      setIsEditing(false);
      logger.info('Profile updated successfully');
    } catch (err) {
      logger.error('Failed to update profile', err as Error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <div className="flex items-center gap-8">
        <div className="relative group">
          <div className="relative w-32 h-32">
            <img
              src={user?.avatar_url || `https://source.unsplash.com/random/150x150?portrait&sig=${user?.id}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 transform"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                ) : (
                  <Camera className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={editedProfile?.full_name || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-2xl font-bold"
                  placeholder="Full Name"
                />
              </div>
            ) : (
              <h1 className="text-4xl font-bold">{user?.full_name}</h1>
            )}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          {isEditing ? (
            <input
              type="email"
              value={editedProfile?.email || ''}
              onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 mt-2"
              placeholder="Email"
            />
          ) : (
            <p className="text-gray-400 mt-2">{user?.email}</p>
          )}
          <div className="flex gap-6 mt-4">
            <div>
              <span className="font-bold">128</span>
              <span className="text-gray-400 ml-1">Purchases</span>
            </div>
            <div>
              <span className="font-bold">1.2k</span>
              <span className="text-gray-400 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-bold">450</span>
              <span className="text-gray-400 ml-1">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Bio</h2>
        {isEditing ? (
          <textarea
            value={editedProfile?.bio || ''}
            onChange={(e) => setEditedProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 min-h-[100px] resize-none"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-300 leading-relaxed">
            {user?.bio || 'No bio yet. Click "Edit Profile" to add one!'}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold">$249.99</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 mb-2">Songs Owned</h3>
          <p className="text-3xl font-bold">128</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 mb-2">Hours Listened</h3>
          <p className="text-3xl font-bold">342</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
              <img
                src={`https://source.unsplash.com/random/60x60?music&sig=${i}`}
                alt="Song cover"
                className="w-15 h-15 rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">Purchased "Song Title"</h3>
                <p className="text-gray-400">2 days ago</p>
              </div>
              <span className="text-purple-500">$4.99</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;