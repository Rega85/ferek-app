-- 0002_create_listings.sql
-- Listings table for Férek.cz marketplace

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price integer NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  location_city text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','deleted','paused')),
  is_boosted boolean NOT NULL DEFAULT false,
  boost_until timestamptz,
  is_highlighted boolean NOT NULL DEFAULT false,
  highlight_until timestamptz,
  neklikni_score integer CHECK (neklikni_score >= 0 AND neklikni_score <= 100),
  neklikni_verdict text CHECK (neklikni_verdict IN ('safe','warning','danger')),
  neklikni_flags text[],
  neklikni_checked_at timestamptz,
  images text[],
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id);
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status);
CREATE INDEX IF NOT EXISTS listings_category_idx ON listings (category);
CREATE INDEX IF NOT EXISTS listings_location_city_idx ON listings (location_city);
CREATE INDEX IF NOT EXISTS listings_boost_until_idx ON listings (boost_until);
CREATE INDEX IF NOT EXISTS listings_highlight_until_idx ON listings (highlight_until);