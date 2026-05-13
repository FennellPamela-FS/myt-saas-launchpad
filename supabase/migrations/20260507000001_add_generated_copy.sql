-- Migration: add generated_copy to pending_saas_deployments
-- Stores AI-generated website copy so GHL Workflow can read and apply it
-- to sub-account Custom Values natively, bypassing agency API scope limits.

ALTER TABLE pending_saas_deployments
  ADD COLUMN IF NOT EXISTS generated_copy JSONB;

-- Allow anon to SELECT (needed so get-copy function can read via anon key)
-- Service role already has full access; this policy covers the edge function
-- calling with the anon key if needed.
CREATE POLICY "anon_read_own_row"
  ON pending_saas_deployments
  FOR SELECT
  TO anon
  USING (true);
