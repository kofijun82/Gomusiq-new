/*
  # Create songs and related tables

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `artist_id` (uuid, foreign key to artists)
      - `cover_url` (text)
      - `song_url` (text) 
      - `price` (decimal)
      - `genre` (text)
      - `duration` (integer)
      - `plays` (integer)
      - `status` (enum: pending, approved, rejected)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on songs table
    - Add policies for:
      - Anyone can read approved songs
      - Artists can read their own songs
      - Artists can create songs
      - Admin can update song status
*/

-- Create song status enum
CREATE TYPE song_status AS ENUM ('pending', 'approved', 'rejected');

-- Create songs table
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
  status song_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved songs
CREATE POLICY "Anyone can read approved songs"
  ON songs
  FOR SELECT
  USING (status = 'approved');

-- Artists can read their own songs
CREATE POLICY "Artists can read own songs"
  ON songs
  FOR SELECT
  USING (
    artist_id IN (
      SELECT id FROM artists WHERE user_id = auth.uid()
    )
  );

-- Artists can create songs
CREATE POLICY "Artists can create songs"
  ON songs
  FOR INSERT
  WITH CHECK (
    artist_id IN (
      SELECT id FROM artists WHERE user_id = auth.uid()
    )
  );

-- Admin can update song status
CREATE POLICY "Admin can update song status"
  ON songs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX songs_artist_id_idx ON songs(artist_id);
CREATE INDEX songs_status_idx ON songs(status);
CREATE INDEX songs_created_at_idx ON songs(created_at);