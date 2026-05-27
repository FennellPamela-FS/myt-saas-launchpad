-- Kairos Award: Premium Expansion Module allocation
-- Tracks how many bonus pages a client has unlocked via the Kairos retention award.
-- Default 0 = standard plan. Any value > 0 = Kairos Award recipient.
-- Agency sets this manually in Supabase or via future admin tooling.

ALTER TABLE client_sites_saas
  ADD COLUMN IF NOT EXISTS bonus_page_allocation INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN client_sites_saas.bonus_page_allocation IS
  'Number of premium expansion pages unlocked via the Kairos Award. '
  '0 = standard plan. Values 1–3 unlock the corresponding premium modules: '
  '1 = Meet the Team / Founder''s Story, '
  '2 = + Portfolio / Case Studies, '
  '3 = + Press, Awards & Community.';
