import { supabase } from './supabaseClient';
import { DiscoveryData, ThemeSelection, IndustryCategory } from '../store/launchpadStore';

// ─── Types ──────────────────────────────────────────────────────────────────

export type CheckoutParams = {
  email: string;
  discoveryData: DiscoveryData;
  themeSelection: ThemeSelection;
};

export type CheckoutError =
  | { code: 'MISSING_EMAIL' }
  | { code: 'MISSING_INDUSTRY' }
  | { code: 'MISSING_INDUSTRY_OTHER' }
  | { code: 'NO_CHECKOUT_URL' }
  | { code: 'ALREADY_COMPLETED' }
  | { code: 'PROVISIONING_IN_PROGRESS' }
  | { code: 'DB_ERROR'; message: string };

export type CheckoutSuccess = {
  checkoutUrl: string;
  email: string;
};

// ─── Handler ────────────────────────────────────────────────────────────────

export async function handleSaaSCheckout({
  email,
  discoveryData,
  themeSelection,
}: CheckoutParams): Promise<CheckoutError | CheckoutSuccess> {
  // Guard: email required
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { code: 'MISSING_EMAIL' };
  }

  // Guard: industry required
  if (!discoveryData.industryCategory) {
    return { code: 'MISSING_INDUSTRY' };
  }

  // Guard: "Other" must have a description
  if (discoveryData.industryCategory === 'other' && !discoveryData.industryOther?.trim()) {
    return { code: 'MISSING_INDUSTRY_OTHER' };
  }

  // Guard: master checkout URL must be configured
  const checkoutBase = import.meta.env.VITE_GHL_MASTER_CHECKOUT_URL as string;
  if (!checkoutBase) {
    return { code: 'NO_CHECKOUT_URL' };
  }

  // Check for an existing record before upserting
  const { data: existing } = await supabase
    .from('pending_saas_deployments')
    .select('status')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (existing?.status === 'completed') {
    return { code: 'ALREADY_COMPLETED' };
  }

  if (existing?.status === 'processing') {
    return { code: 'PROVISIONING_IN_PROGRESS' };
  }

  // Safe to upsert — status is pending, failed, or row doesn't exist yet
  const { error } = await supabase
    .from('pending_saas_deployments')
    .upsert(
      {
        email: email.trim().toLowerCase(),
        industry_category: discoveryData.industryCategory as IndustryCategory,
        discovery_data: discoveryData,
        theme: themeSelection,
      },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('[checkout] Supabase upsert failed:', error.message, error.details, error.hint);
    return { code: 'DB_ERROR', message: error.message };
  }

  // Build the checkout URL with pre-fill params
  const url = new URL(checkoutBase);
  url.searchParams.set('email', email.trim().toLowerCase());
  url.searchParams.set('industry', discoveryData.industryCategory);

  return { checkoutUrl: url.toString(), email: email.trim().toLowerCase() };
}
