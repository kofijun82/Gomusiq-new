-- Drop existing tables to recreate them in the correct order
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS songs;

-- Create songs table first
CREATE TABLE songs (
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

-- Create purchases table with proper foreign key
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  song_id UUID NOT NULL REFERENCES songs(id),
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
CREATE INDEX songs_artist_id_idx ON songs(artist_id);
CREATE INDEX songs_status_idx ON songs(status);
CREATE INDEX songs_created_at_idx ON songs(created_at);

CREATE INDEX purchases_user_id_idx ON purchases(user_id);
CREATE INDEX purchases_song_id_idx ON purchases(song_id);
CREATE INDEX purchases_payment_status_idx ON purchases(payment_status);
CREATE INDEX purchases_created_at_idx ON purchases(created_at);