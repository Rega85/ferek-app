-- 0003_create_conversations.sql
-- Conversations between buyer and seller

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id),
  buyer_id uuid NOT NULL REFERENCES users(id),
  seller_id uuid NOT NULL REFERENCES users(id),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, buyer_id)
);

CREATE INDEX IF NOT EXISTS conversations_listing_id_idx ON conversations (listing_id);
CREATE INDEX IF NOT EXISTS conversations_buyer_id_idx ON conversations (buyer_id);
CREATE INDEX IF NOT EXISTS conversations_seller_id_idx ON conversations (seller_id);