-- 20261110000000_f0_security.sql
-- F0: bezpečnostní opravy před spuštěním.
--
-- 1) users: veřejně jen jméno, avatar a stav ověření. E-mail a telefon už nejsou čitelné z API.
-- 2) users: uživatel si sám nesmí nastavit trust_score, is_verified, premium_until, neklikni_checks_used.
-- 3) listings: kontrolu Neklikni, topování a zvýraznění smí zapsat jen server (service role).
-- 4) listings: změna názvu nebo popisu zneplatní předchozí kontrolu.
-- 5) listings: smazání falešných „neklikni“ hodnot z lokální heuristiky.
-- 6) transactions: platby zapisuje jen server (webhook platební brány).
--
-- Spouští se ručně v Supabase SQL editoru. Je idempotentní, jde pustit opakovaně.

------------------------------------------------------------------
-- 1 + 2) users
------------------------------------------------------------------
REVOKE SELECT, INSERT, UPDATE ON public.users FROM anon, authenticated;

GRANT SELECT (id, full_name, avatar_url, trust_score, is_verified, created_at)
  ON public.users TO anon, authenticated;

GRANT UPDATE (full_name, avatar_url) ON public.users TO authenticated;

-- Řádky do users zakládá trigger handle_new_user (SECURITY DEFINER), klient je vkládat nemusí.
DROP POLICY IF EXISTS "users_insert_own" ON public.users;

-- Vlastní e-mail a telefon si přihlášený uživatel přečte přes tuto funkci.
CREATE OR REPLACE FUNCTION public.get_my_contact()
RETURNS TABLE (email text, phone text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.email::text, u.phone FROM public.users u WHERE u.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_contact() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_my_contact() TO authenticated;

------------------------------------------------------------------
-- 3) listings: sloupce, které klient smí zapsat
------------------------------------------------------------------
REVOKE INSERT, UPDATE ON public.listings FROM anon, authenticated;

GRANT INSERT (user_id, title, description, price, category, location_city, images, status)
  ON public.listings TO authenticated;

GRANT UPDATE (title, description, price, category, location_city, images, status, updated_at)
  ON public.listings TO authenticated;

-- neklikni_*, is_boosted, boost_until, is_highlighted, highlight_until, view_count
-- teď zapisuje jen service role (server).

------------------------------------------------------------------
-- 4) změna obsahu => kontrolu je potřeba zopakovat
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.listings_reset_neklikni_on_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.title IS DISTINCT FROM OLD.title
     OR NEW.description IS DISTINCT FROM OLD.description THEN
    NEW.neklikni_score := NULL;
    NEW.neklikni_verdict := NULL;
    NEW.neklikni_flags := NULL;
    NEW.neklikni_checked_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS listings_reset_neklikni ON public.listings;
CREATE TRIGGER listings_reset_neklikni
  BEFORE UPDATE OF title, description ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.listings_reset_neklikni_on_change();

------------------------------------------------------------------
-- 5) pryč s falešnými hodnotami (nikdy nešly přes Neklikni API)
------------------------------------------------------------------
UPDATE public.listings
SET neklikni_score = NULL,
    neklikni_verdict = NULL,
    neklikni_flags = NULL,
    neklikni_checked_at = NULL
WHERE neklikni_verdict IS NOT NULL
   OR neklikni_score IS NOT NULL
   OR neklikni_flags IS NOT NULL
   OR neklikni_checked_at IS NOT NULL;

------------------------------------------------------------------
-- 6) transactions: jen čtení pro vlastníka
------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE ON public.transactions FROM anon, authenticated;
DROP POLICY IF EXISTS "transactions_insert_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_update_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_delete_own" ON public.transactions;
