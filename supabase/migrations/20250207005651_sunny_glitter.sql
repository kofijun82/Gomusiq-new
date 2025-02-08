/*
  # Fix purchases and songs relationship

  1. Changes
    - Drop existing foreign key if exists
    - Recreate purchases table with proper relationships
    - Add proper indexes and RLS policies
*/

-- Drop existing foreign key if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'purchases_song_id_fkey'
  ) THEN
    ALTER TABLE purchases DROP CONSTRAINT purchases_song_id_fkey;
  END IF;
END $$;

-- Recreate purchases table with proper relationships
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  song_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT purchases_song_id_fkey 
    FOREIGN KEY (song_id) 
    REFERENCES songs(id) 
    ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_song_id_idx ON purchases(song_id);
CREATE INDEX IF NOT EXISTS purchases_payment_status_idx ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS purchases_created_at_idx ON purchases(created_at);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchases
CREATE POLICY "Users can read own purchases"
ON purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create purchases
CREATE POLICY "Users can create purchases"
ON purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);