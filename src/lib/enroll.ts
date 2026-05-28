import { supabase } from './supabaseClient';
import { DiscoveryData, ThemeSelection, IndustryCategory } from '../store/launchpadStore';

export type EnrollError =
  | { code: 'MISSING_EMAIL' }
  | { code: 'MISSING_LOCATION_ID' }
  | { code: 'MISSING_INDUSTRY' }
  | { code: 'MISSING_INDUSTRY_OTHER' }
  | { code: 'ALREADY_COMPLETED' }
  | { code: 'PROVISIONING_IN_PROGRESS' }
  | { code: 'DB_ERROR'; message: string };

export type EnrollSuccess = { email: string; locationId: string };

export async function handleExistingEnroll({
  email,
  locationId,
  discoveryData,
  themeSelection,
  cohort,
}: {
  email: string;
  locationId: string;
  discoveryData: DiscoveryData;
  themeSelection: ThemeSelection;
  cohort?: string | null;
}): Promise<EnrollError | EnrollSuccess> {
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { code: 'MISSING_EMAIL' };
  }
  if (!locationId.trim()) {
    return { code: 'MISSING_LOCATION_ID' };
  }
  if (!discoveryData.industryCategory) {
    return { code: 'MISSING_INDUSTRY' };
  }
  if (discoveryData.industryCategory === 'other' && !discoveryData.industryOther?.trim()) {
    return { code: 'MISSING_INDUSTRY_OTHER' };
  }

  // Block if already provisioned or in-flight
  const { data: existing } = await supabase
    .from('pending_saas_deployments')
    .select('status')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (existing?.status === 'completed') return { code: 'ALREADY_COMPLETED' };
  if (existing?.status === 'processing') return { code: 'PROVISIONING_IN_PROGRESS' };

  // Upsert with locationId pre-populated — provisioner can run immediately
  const payload: Record<string, unknown> = {
    email:             email.trim().toLowerCase(),
    industry_category: discoveryData.industryCategory as IndustryCategory,
    discovery_data:    discoveryData,
    theme:             themeSelection,
    location_id:       locationId.trim(),
    status:            'pending',
  };
  if (cohort) payload.cohort = cohort;

  const { error } = await supabase
    .from('pending_saas_deployments')
    .upsert(payload, { onConflict: 'email' });

  if (error) {
    console.error('[enroll] DB upsert failed:', error.message);
    return { code: 'DB_ERROR', message: error.message };
  }

  // Fire provisioner — don't await so the confirmation screen shows immediately
  const provisionerUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ghl-saas-provisioner`;
  fetch(provisionerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      contact: { email: email.trim().toLowerCase() },
      location: { id: locationId.trim() },
    }),
  }).catch((err) => console.error('[enroll] Provisioner trigger failed:', err));

  return { email: email.trim().toLowerCase(), locationId: locationId.trim() };
}
