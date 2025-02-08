/*
  # Fix Purchases and Songs Relationship

  1. Changes
    - Add foreign key constraint between purchases and songs tables
    - Add payment status and reference columns to purchases table
    - Add indexes for better query performance

  2. Security
    - Enable RLS on purchases table
    - Add policies for users to read their own purchases
*/

-- Add payment status and reference columns to purchases
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_ref TEXT;

-- Add foreign key constraint
ALTER TABLE purchases
ADD CONSTRAINT purchases_song_id_fkey
FOREIGN KEY (song_id)
REFERENCES songs(id)
ON DELETE CASCADE;

-- Create indexes for better performance
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