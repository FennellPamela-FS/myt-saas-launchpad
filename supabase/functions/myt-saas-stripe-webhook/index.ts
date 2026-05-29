// Supabase Edge Function: myt-saas-stripe-webhook
//
// Receives Stripe checkout.session.completed events and owns the full
// provisioning pipeline server-side — no browser return URL required.
//
// Flow:
//   1  Verify Stripe signature
//   2  Extract email from client_reference_id (reliable) or customer_email fallback
//   3  Look up pending_saas_deployments record
//   4  If location_id is missing → create GHL sub-account → save locationId
//   5  Trigger ghl-saas-provisioner → AI copy + client_sites row + Netlify build
//
// client_reference_id is set to the user's email by checkout.ts so we can
// identify the user even when Stripe Link substitutes a different customer email.
//
// Deploy: supabase functions deploy myt-saas-stripe-webhook --no-verify-jwt
//
// Required Supabase secrets:
//   STRIPE_WEBHOOK_SECRET  — from Stripe Dashboard → Webhooks → signing secret
//   GHL_AGENCY_API_KEY     — PIT token with locations:write scope
//   GHL_COMPANY_ID         — agency company ID

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')              ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── Stripe signature verification ───────────────────────────────────────────

async function verifyStripeSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts   = Object.fromEntries(signature.split(',').map(p => p.split('=') as [string, string]));
  const timestamp = parts['t'];
  const expected  = parts['v1'];
  if (!timestamp || !expected) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const computed = Array.from(new Uint8Array(sigBytes)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === expected;
}

// ─── GHL sub-account creation ─────────────────────────────────────────────────
// Called when payment succeeds but no GHL location exists yet.

async function createGHLSubAccount(
  email: string,
  businessName: string
): Promise<string> {
  const apiKey    = Deno.env.get('GHL_AGENCY_API_KEY');
  const companyId = Deno.env.get('GHL_COMPANY_ID');

  if (!apiKey || !companyId) throw new Error('GHL_AGENCY_API_KEY or GHL_COMPANY_ID not configured');

  const res = await fetch('https://services.leadconnectorhq.com/locations/', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      Version:        '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      companyId,
      name:    businessName || email,
      email,
      country: 'US',
      timezone: 'America/New_York',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL create location failed ${res.status}: ${text}`);
  }

  const data       = await res.json() as Record<string, unknown>;
  const locationId = ((data?.location as Record<string, unknown>)?.id ?? data?.id) as string;

  if (!locationId) throw new Error(`GHL response missing locationId: ${JSON.stringify(data)}`);
  console.log(`GHL sub-account created: ${locationId} for ${email}`);
  return locationId;
}

// ─── Provisioner trigger ─────────────────────────────────────────────────────

async function triggerProvisioner(email: string, locationId: string): Promise<unknown> {
  const url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/ghl-saas-provisioner`;
  const res = await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
    },
    body: JSON.stringify({
      contact:  { email },
      location: { id: locationId },
    }),
  });
  return res.json();
}

// ─── Handler ─────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const rawBody        = await req.text();
    const stripeSignature = req.headers.get('stripe-signature') ?? '';
    const webhookSecret   = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

    if (webhookSecret) {
      const valid = await verifyStripeSignature(rawBody, stripeSignature, webhookSecret);
      if (!valid) {
        console.error('myt-saas-stripe-webhook: invalid signature');
        return new Response(JSON.stringify({ error: 'Invalid Stripe signature' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`myt-saas-stripe-webhook: received ${event.type}`);

    if (event.type !== 'checkout.session.completed') {
      return new Response(JSON.stringify({ received: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = event.data?.object ?? {};

    // client_reference_id is our email — set by checkout.ts so it survives
    // Stripe Link substituting a different customer email.
    const email = (
      (session.client_reference_id as string) ||
      (session.customer_email       as string) ||
      (session.customer_details?.email as string) ||
      ''
    ).toLowerCase().trim();

    if (!email) {
      console.error('myt-saas-stripe-webhook: no email found in session');
      return new Response(JSON.stringify({ error: 'No email found' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`myt-saas-stripe-webhook: processing payment for ${email}`);

    // ── Look up pending deployment ───────────────────────────────────────────
    // Lookup order: email → alt_email
    // This handles users who signed up with one email and paid with another.
    let { data: deployment } = await supabase
      .from('pending_saas_deployments')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!deployment) {
      console.log(`myt-saas-stripe-webhook: no match on email, trying alt_email for ${email}`);
      const { data: altMatch } = await supabase
        .from('pending_saas_deployments')
        .select('*')
        .eq('alt_email', email)
        .maybeSingle();
      deployment = altMatch;
    }

    if (!deployment) {
      console.error(`myt-saas-stripe-webhook: no pending deployment found for ${email} (checked email + alt_email)`);
      return new Response(JSON.stringify({ error: 'No pending deployment found' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use the canonical email (the one stored on the record) for all downstream calls
    const canonicalEmail = (deployment as Record<string, unknown>).email as string;

    if (deployment.status === 'completed') {
      console.log(`myt-saas-stripe-webhook: already completed for ${canonicalEmail} — skipping`);
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Create GHL sub-account if not yet linked ─────────────────────────────
    let locationId: string = (deployment as Record<string, unknown>).location_id as string ?? '';

    if (!locationId) {
      console.log(`myt-saas-stripe-webhook: no location_id for ${canonicalEmail} — creating GHL sub-account`);
      const businessName = (deployment.discovery_data as Record<string, unknown>)?.businessName as string ?? canonicalEmail;
      locationId = await createGHLSubAccount(canonicalEmail, businessName);

      await supabase
        .from('pending_saas_deployments')
        .update({ location_id: locationId })
        .eq('email', canonicalEmail);
    }

    // ── Trigger provisioner server-side ─────────────────────────────────────
    const result = await triggerProvisioner(canonicalEmail, locationId);
    console.log(`myt-saas-stripe-webhook: provisioner result for ${canonicalEmail}:`, JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, locationId, provisioner: result }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('myt-saas-stripe-webhook error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
