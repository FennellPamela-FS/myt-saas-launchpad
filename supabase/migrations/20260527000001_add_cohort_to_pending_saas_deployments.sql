-- Add cohort tracking to pending_saas_deployments
-- Used for bulk-paid / VIP cohort seat management (e.g. inspire_dmv)

ALTER TABLE pending_saas_deployments
  ADD COLUMN IF NOT EXISTS cohort TEXT;

-- Index for fast seat-count queries
CREATE INDEX IF NOT EXISTS idx_pending_saas_deployments_cohort
  ON pending_saas_deployments (cohort)
  WHERE cohort IS NOT NULL;

COMMENT ON COLUMN pending_saas_deployments.cohort IS
  'Identifies the bulk-paid cohort this record belongs to, e.g. ''inspire_dmv''. NULL for regular Stripe-paid signups.';
