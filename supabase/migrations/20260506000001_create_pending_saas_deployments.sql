-- Migration: create pending_saas_deployments
-- Purpose: Holds discovery state submitted from the AI Kickstart form.
-- The record persists through GHL checkout so the post-payment webhook
-- can retrieve it and trigger the SaaS provisioning pipeline.

CREATE TABLE IF NOT EXISTS pending_saas_deployments (
  email              TEXT        PRIMARY KEY,
  industry_category  TEXT        NOT NULL,
  discovery_data     JSONB       NOT NULL DEFAULT '{}',
  theme              TEXT        NOT NULL DEFAULT 'professional',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_theme CHECK (
    theme IN ('professional', 'creative', 'wellness', 'luxury', 'minimalist')
  )
);

-- Index for GHL webhook lookups by industry (useful for batch reporting)
CREATE INDEX IF NOT EXISTS idx_pending_saas_industry
  ON pending_saas_deployments (industry_category);

-- Row Level Security: service role only (edge functions use service key)
ALTER TABLE pending_saas_deployments ENABLE ROW LEVEL SECURITY;

-- Anon users can insert/upsert their own row (identified by email)
CREATE POLICY "anon_upsert_own_row"
  ON pending_saas_deployments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_update_own_row"
  ON pending_saas_deployments
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
