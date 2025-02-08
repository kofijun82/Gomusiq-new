import { create } from 'zustand';
import { supabase } from './supabase';

interface UploadState {
  isUploading: boolean;
  progress: number;
  uploadSong: (file: File, metadata: SongMetadata) => Promise<void>;
}

export interface SongMetadata {
  title: string;
  genre: string;
  price: number;
  coverImage: File;
}

export const useUpload = create<UploadState>((set) => ({
  isUploading: false,
  progress: 0,

  uploadSong: async (file: File, metadata: SongMetadata) => {
    set({ isUploading: true, progress: 0 });

    try {
      // Upload song file
      const songFileName = `${Date.now()}-${file.name}`;
      const { data: songData, error: songError } = await supabase.storage
        .from('songs')
        .upload(songFileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (songError) throw songError;

      // Upload cover image
      const coverFileName = `${Date.now()}-${metadata.coverImage.name}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from('covers')
        .upload(coverFileName, metadata.coverImage, {
          cacheControl: '3600',
          upsert: false,
        });

      if (coverError) throw coverError;

      // Get URLs
      const songUrl = supabase.storage.from('songs').getPublicUrl(songFileName).data.publicUrl;
      const coverUrl = supabase.storage.from('covers').getPublicUrl(coverFileName).data.publicUrl;

      // Get current user's artist profile
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .single();

      if (artistError) throw artistError;

      // Create song record
      const { error: insertError } = await supabase
        .from('songs')
        .insert([
          {
            title: metadata.title,
            artist_id: artistData.id,
            cover_url: coverUrl,
            song_url: songUrl,
            price: metadata.price,
            genre: metadata.genre,
            status: 'pending', // pending, approved, rejected
            duration: 0, // Will be updated after processing
          },
        ]);

      if (insertError) throw insertError;

      set({ isUploading: false, progress: 100 });
    } catch (error) {
      set({ isUploading: false, progress: 0 });
      throw error;
    }
  },
}));