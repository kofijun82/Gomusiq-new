import { Database } from './supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  is_artist: boolean;
  is_admin?: boolean;
  created_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  cover_url: string;
  song_url: string;
  price: number;
  genre: string;
  duration: number;
  plays: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Artist {
  id: string;
  user_id: string;
  artist_name: string;
  bio: string;
  verified: boolean;
  total_sales: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  song_id: string;
  amount: number;
  platform_fee: number;
  artist_revenue: number;
  created_at: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  is_public: boolean;
  created_at: string;
  songs: Song[];
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}