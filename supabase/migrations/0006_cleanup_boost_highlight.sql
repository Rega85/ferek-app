-- migrations/0006_cleanup_boost_highlight.sql

UPDATE listings
SET is_boosted = false, updated_at = NOW()
WHERE is_boosted = true
  AND boost_until IS NOT NULL
  AND boost_until < NOW()
  AND status != 'deleted';

UPDATE listings
SET is_highlighted = false, updated_at = NOW()
WHERE is_highlighted = true
  AND highlight_until IS NOT NULL
  AND highlight_until < NOW()
  AND status != 'deleted';

-- Indexy pro výkon
CREATE INDEX IF NOT EXISTS idx_listings_boost_until 
  ON listings(boost_until) WHERE is_boosted = true;
CREATE INDEX IF NOT EXISTS idx_listings_highlight_until 
  ON listings(highlight_until) WHERE is_highlighted = true;