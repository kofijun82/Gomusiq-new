/*
  # Initial Schema for GOMusiq Platform

  1. New Tables
    - users (extends Supabase auth)
      - Additional user profile information
      - Artist status tracking
    - artists
      - Artist-specific information
      - Verification and sales tracking
    - songs
      - Music metadata and storage
      - Pricing and analytics
    - purchases
      - Transaction history
      - Revenue tracking

  2. Security
    - RLS policies for each table
    - Secure access patterns
    - Data protection
*/

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  is_artist BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  artist_name TEXT NOT NULL,
  bio TEXT,
  verified BOOLEAN DEFAULT false,
  total_sales DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Anyone can read artist data
CREATE POLICY "Anyone can read artist data"
  ON artists
  FOR SELECT
  TO authenticated
  USING (true);

-- Artists can update their own data
CREATE POLICY "Artists can update own data"
  ON artists
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id),
  cover_url TEXT NOT NULL,
  song_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  genre TEXT NOT NULL,
  duration INTEGER NOT NULL,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Anyone can read songs
CREATE POLICY "Anyone can read songs"
  ON songs
  FOR SELECT
  TO authenticated
  USING (true);

-- Artists can insert their own songs
CREATE POLICY "Artists can insert own songs"
  ON songs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE id = artist_id AND user_id = auth.uid()
    )
  );

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  song_id UUID NOT NULL REFERENCES songs(id),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchases
CREATE POLICY "Users can read own purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create purchases
CREATE POLICY "Users can create purchases"
  ON purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());