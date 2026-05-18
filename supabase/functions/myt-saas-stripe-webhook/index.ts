// Supabase Edge Function: myt-saas-stripe-webhook
//
// Receives Stripe checkout.session.completed events after a test or live
// payment, then triggers the ghl-saas-provisioner to generate the client
// site — same pipeline as the GHL Order Submitted workflow, but via Stripe.
//
// Deploy: supabase functions deploy myt-saas-stripe-webhook --no-verify-jwt
//
// Required Supabase secrets:
//   STRIPE_WEBHOOK_SECRET  — from Stripe Dashboard → Webhooks → signing secret

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── Stripe signature verification (no SDK needed) ───────────────────────────

async function verifyStripeSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = Object.fromEntries(
    signature.split(',').map((p) => p.split('=') as [string, string])
  );
  const timestamp = parts['t'];
  const expected = parts['v1'];
  if (!timestamp || !expected) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`)
  );

  const computed = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computed === expected;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const rawBody = await req.text();
    const stripeSignature = req.headers.get('stripe-signature') ?? '';
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

    // Verify signature when secret is configured
    if (webhookSecret) {
      const valid = await verifyStripeSignature(rawBody, stripeSignature, webhookSecret);
      if (!valid) {
        console.error('myt-saas-stripe-webhook: invalid signature');
        return new Response(JSON.stringify({ error: 'Invalid Stripe signature' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`myt-saas-stripe-webhook: received ${event.type}`);

    // Only handle completed checkouts
    if (event.type !== 'checkout.session.completed') {
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = event.data?.object ?? {};
    const email = (
      session.customer_email ||
      session.customer_details?.email ||
      ''
    ).toLowerCase().trim();

    if (!email) {
      console.error('myt-saas-stripe-webhook: no email in session');
      return new Response(JSON.stringify({ error: 'No email found in Stripe session' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Look up the pending deployment for this email
    const { data: deployment } = await supabase
      .from('pending_saas_deployments')
      .select('location_id, status')
      .eq('email', email)
      .maybeSingle();

    if (!deployment) {
      console.error(`myt-saas-stripe-webhook: no pending deployment for ${email}`);
      return new Response(JSON.stringify({ error: 'No pending deployment found for this email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (deployment.status === 'completed') {
      console.log(`myt-saas-stripe-webhook: already completed for ${email} — skipping`);
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!deployment.location_id) {
      console.error(`myt-saas-stripe-webhook: no location_id for ${email}`);
      return new Response(JSON.stringify({ error: 'No locationId in pending deployment — use enrollment link first' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Trigger the provisioner server-side (reliable — no browser fire-and-forget)
    const provisionerUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/ghl-saas-provisioner`;
    const res = await fetch(provisionerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({
        contact: { email },
        location: { id: deployment.location_id },
      }),
    });

    const result = await res.json();
    console.log(`myt-saas-stripe-webhook: provisioner result for ${email}:`, JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, provisioner: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('myt-saas-stripe-webhook error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
