-- Alternate email for pending deployments
-- Allows a secondary/payment email to be stored alongside the primary.
-- The Stripe webhook checks client_reference_id → email → alt_email
-- so a user who signs up with one email and pays with another is still matched.

ALTER TABLE pending_saas_deployments
  ADD COLUMN IF NOT EXISTS alt_email TEXT;

CREATE INDEX IF NOT EXISTS idx_pending_saas_deployments_alt_email
  ON pending_saas_deployments (alt_email)
  WHERE alt_email IS NOT NULL;

COMMENT ON COLUMN pending_saas_deployments.alt_email IS
  'Secondary / payment email. Set when the user signed up with a different
   address than the one used at Stripe checkout.';
