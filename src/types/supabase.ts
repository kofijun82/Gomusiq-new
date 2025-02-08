export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          user_id: string
          artist_name: string
          bio: string | null
          verified: boolean
          total_sales: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artist_name: string
          bio?: string | null
          verified?: boolean
          total_sales?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artist_name?: string
          bio?: string | null
          verified?: boolean
          total_sales?: number
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          song_id: string
          amount: number
          platform_fee: number
          artist_revenue: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          song_id: string
          amount: number
          platform_fee: number
          artist_revenue: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string
          amount?: number
          platform_fee?: number
          artist_revenue?: number
          created_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          title: string
          artist_id: string
          cover_url: string
          song_url: string
          price: number
          genre: string
          duration: number
          plays: number
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_id: string
          cover_url: string
          song_url: string
          price: number
          genre: string
          duration: number
          plays?: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_id?: string
          cover_url?: string
          song_url?: string
          price?: number
          genre?: string
          duration?: number
          plays?: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          is_artist: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          is_artist?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          is_artist?: boolean
          created_at?: string
        }
      }
    }
  }
}