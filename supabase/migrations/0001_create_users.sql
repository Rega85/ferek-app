-- 0001_create_users.sql
-- Users table for Férek.cz marketplace

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE NOT NULL,
  phone text,
  full_name text,
  avatar_url text,
  trust_score integer NOT NULL DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_verified boolean NOT NULL DEFAULT false,
  premium_until timestamptz,
  neklikni_checks_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS users_trust_score_idx ON users (trust_score);