-- Migration: add status tracking to pending_saas_deployments
-- Supports the ghl-saas-provisioner webhook lifecycle.

ALTER TABLE pending_saas_deployments
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS location_id TEXT;

CREATE INDEX IF NOT EXISTS idx_pending_saas_status
  ON pending_saas_deployments (status);
