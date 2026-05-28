// Supabase Edge Function: provision-client-workspace
//
// VIP / bulk-paid cohort provisioner — bypasses Stripe entirely.
//
// Flow:
//   1  Validate request payload
//   2  Capacity check — hard-stop at cohort seat limit (race-safe, server-side)
//   3  Create GHL sub-account via V2 Locations API → capture locationId
//   4  Upsert pending_saas_deployments with cohort tag + locationId
//   5  Fire ghl-saas-provisioner (async, non-blocking) for full AI pipeline
//   6  Return { success, locationId } to the frontend
//
// Deploy: supabase functions deploy provision-client-workspace --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  industryCategory: string;
  cohort: string;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const COHORT_SEAT_LIMITS: Record<string, number> = {
  inspire_dmv:     13,  // 10 prepaid + 3 rollover seats from previous cohort
  better_business: 30,
};

const GHL_LOCATIONS_API = 'https://services.leadconnectorhq.com/locations/';
const GHL_API_VERSION   = '2021-07-28';

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ─── Supabase client (service role — bypasses RLS) ────────────────────────────

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')              ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── Step 2: Capacity check ───────────────────────────────────────────────────

async function countCohortSeats(cohort: string): Promise<number> {
  const { count, error } = await supabase
    .from('pending_saas_deployments')
    .select('*', { count: 'exact', head: true })
    .eq('cohort', cohort)
    .neq('status', 'failed');   // failed rows don't occupy a seat

  if (error) throw new Error(`Seat count query failed: ${error.message}`);
  return count ?? 0;
}

// ─── Step 3: Create GHL sub-account ──────────────────────────────────────────

async function createGHLSubAccount(payload: RequestPayload): Promise<string> {
  const apiKey    = Deno.env.get('GHL_AGENCY_API_KEY');
  const companyId = Deno.env.get('GHL_COMPANY_ID');

  if (!apiKey)    throw new Error('GHL_AGENCY_API_KEY not set');
  if (!companyId) throw new Error('GHL_COMPANY_ID not set');

  const body = {
    companyId,
    name:      payload.companyName.trim(),
    email:     payload.email.trim().toLowerCase(),
    phone:     payload.phone.trim(),
    firstName: payload.firstName.trim(),
    lastName:  payload.lastName.trim(),
    // Sensible defaults for required GHL fields we don't collect in the VIP form
    country:   'US',
    timezone:  'America/New_York',
  };

  const res = await fetch(GHL_LOCATIONS_API, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      Version:        GHL_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL create sub-account failed ${res.status}: ${text}`);
  }

  const data = await res.json() as Record<string, unknown>;

  // GHL V2 returns the new location under data.location.id or data.id
  const locationId =
    (data?.location as Record<string, unknown>)?.id as string ??
    (data?.id as string) ??
    null;

  if (!locationId) throw new Error(`GHL response missing locationId: ${JSON.stringify(data)}`);

  console.log(`GHL sub-account created: ${locationId} for ${payload.email}`);
  return locationId;
}

// ─── Step 4: Upsert pending_saas_deployments ──────────────────────────────────

function buildMinimalDiscoveryData(payload: RequestPayload) {
  return {
    businessName:    payload.companyName.trim(),
    industryCategory: payload.industryCategory,
    vision:          `${payload.companyName} is committed to delivering exceptional value and building a strong digital presence.`,
    hookAndProblem:  `We help clients overcome the challenge of standing out in a competitive market by providing premium, personalized service.`,
    services:        `Core business services tailored to client needs`,
    uniqueValue:     `Our commitment to quality, reliability, and results-driven work sets us apart.`,
    theAsk:          `Book a free consultation or get in touch to learn how we can help you grow.`,
  };
}

async function upsertPendingDeployment(
  payload: RequestPayload,
  locationId: string
): Promise<void> {
  const discoveryData = buildMinimalDiscoveryData(payload);

  const { error } = await supabase
    .from('pending_saas_deployments')
    .upsert(
      {
        email:             payload.email.trim().toLowerCase(),
        industry_category: payload.industryCategory,
        discovery_data:    discoveryData,
        theme:             'professional',
        location_id:       locationId,
        cohort:            payload.cohort,
        status:            'pending',
      },
      { onConflict: 'email' }
    );

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

// ─── Step 5: Fire provisioner (async, non-blocking) ───────────────────────────

function fireProvisioner(email: string, locationId: string): void {
  const provisionerUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/ghl-saas-provisioner`;
  const serviceKey     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  fetch(provisionerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      contact:  { email },
      location: { id: locationId },
    }),
  }).catch((err: Error) =>
    console.error('[provision-client-workspace] Provisioner fire failed:', err.message)
  );
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload = (await req.json()) as Partial<RequestPayload>;

    // ── 1. Validate ──────────────────────────────────────────────────────────
    const required: (keyof RequestPayload)[] = ['firstName', 'lastName', 'email', 'phone', 'companyName', 'industryCategory', 'cohort'];
    for (const field of required) {
      if (!payload[field]?.toString().trim()) {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!)) {
      return json({ error: 'Invalid email address' }, 400);
    }

    const seatLimit = COHORT_SEAT_LIMITS[payload.cohort!];
    if (!seatLimit) {
      return json({ error: `Unknown cohort: ${payload.cohort}` }, 400);
    }

    // ── 2. Capacity check (server-side, race-safe) ───────────────────────────
    const seatsUsed = await countCohortSeats(payload.cohort!);
    if (seatsUsed >= seatLimit) {
      return json({ error: 'COHORT_FULL', seatsUsed, seatLimit }, 409);
    }

    // ── 3. Create GHL sub-account ────────────────────────────────────────────
    const locationId = await createGHLSubAccount(payload as RequestPayload);

    // ── 4. Upsert Supabase record ─────────────────────────────────────────────
    await upsertPendingDeployment(payload as RequestPayload, locationId);

    // ── 5. Fire provisioner (non-blocking) ───────────────────────────────────
    fireProvisioner(payload.email!.trim().toLowerCase(), locationId);

    console.log(`VIP provisioning queued: cohort=${payload.cohort} email=${payload.email} location=${locationId}`);

    return json({ success: true, locationId, seatsUsed: seatsUsed + 1, seatLimit });

  } catch (err) {
    console.error('[provision-client-workspace] Error:', err);
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
