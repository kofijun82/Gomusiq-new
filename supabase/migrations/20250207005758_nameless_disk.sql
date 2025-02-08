/*
  # Create songs and purchases tables with proper relationships

  1. New Tables
    - songs
      - id (uuid, primary key)
      - title (text)
      - artist_id (uuid, foreign key)
      - cover_url (text)
      - song_url (text)
      - price (decimal)
      - genre (text)
      - duration (integer)
      - plays (integer)
      - status (song_status)
      - created_at (timestamptz)
    - purchases
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - song_id (uuid, foreign key)
      - amount (decimal)
      - payment_status (text)
      - payment_ref (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies
*/

-- Create song status enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE song_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

-- Enable RLS on songs
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create songs policies
CREATE POLICY "Anyone can read approved songs"
  ON songs FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Artists can read own songs"
  ON songs FOR SELECT
  USING (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can create songs"
  ON songs FOR INSERT
  WITH CHECK (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create purchases policies
CREATE POLICY "Users can read own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS songs_artist_id_idx ON songs(artist_id);
CREATE INDEX IF NOT EXISTS songs_status_idx ON songs(status);
CREATE INDEX IF NOT EXISTS songs_created_at_idx ON songs(created_at);

CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_song_id_idx ON purchases(song_id);
CREATE INDEX IF NOT EXISTS purchases_payment_status_idx ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS purchases_created_at_idx ON purchases(created_at);