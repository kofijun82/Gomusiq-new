/*
  # Add messages-users relationship

  1. Changes
    - Add foreign key relationship between messages and users tables
    - Add indexes for better query performance
  2. Security
    - Enable RLS on messages table
    - Add policies for message access control
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id),
  group_id UUID,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they sent or received
CREATE POLICY "Users can read their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id OR
    (receiver_id IS NULL AND group_id IS NULL) -- Public messages
  );

-- Users can create messages
CREATE POLICY "Users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Create index for better query performance
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_receiver_id_idx ON messages(receiver_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

-- Create view for messages with user details
CREATE OR REPLACE VIEW messages_with_users AS
SELECT 
  m.*,
  sender.full_name as sender_name,
  sender.avatar_url as sender_avatar_url,
  receiver.full_name as receiver_name,
  receiver.avatar_url as receiver_avatar_url
FROM messages m
LEFT JOIN users sender ON m.sender_id = sender.id
LEFT JOIN users receiver ON m.receiver_id = receiver.id;

-- Enable RLS on the view
ALTER VIEW messages_with_users SECURITY INVOKER;