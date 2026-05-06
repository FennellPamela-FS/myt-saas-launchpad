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
  | { code: 'NO_CHECKOUT_URL' }
  | { code: 'DB_ERROR'; message: string };

// ─── Handler ────────────────────────────────────────────────────────────────

export async function handleSaaSCheckout({
  email,
  discoveryData,
  themeSelection,
}: CheckoutParams): Promise<CheckoutError | null> {
  // Guard: email required
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { code: 'MISSING_EMAIL' };
  }

  // Guard: industry required
  if (!discoveryData.industryCategory) {
    return { code: 'MISSING_INDUSTRY' };
  }

  // Guard: master checkout URL must be configured
  const checkoutUrl = import.meta.env.VITE_GHL_MASTER_CHECKOUT_URL as string;
  if (!checkoutUrl) {
    return { code: 'NO_CHECKOUT_URL' };
  }

  // Persist discovery state so the post-payment GHL webhook can provision the snapshot
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
    return { code: 'DB_ERROR', message: error.message };
  }

  // Append email + industry so GHL can pre-fill checkout and route the snapshot
  const url = new URL(checkoutUrl);
  url.searchParams.set('email', email.trim().toLowerCase());
  url.searchParams.set('industry', discoveryData.industryCategory);

  window.location.href = url.toString();
  return null;
}
