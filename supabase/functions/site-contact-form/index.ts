// Supabase Edge Function: site-contact-form
//
// Receives contact form submissions from client sites and upserts the lead
// directly into the client's GHL sub-account CRM via the V2 Contacts API.
// Applies the 'website-inquiry' tag to trigger the client's GHL workflow.
//
// Flow:
//   1  Validate request payload
//   2  Look up the client's location_id from client_sites_saas (active sites only)
//   3  Search GHL for an existing contact with this email in that location
//   4  Create new contact OR update existing — always apply website-inquiry tag
//   5  Add a note capturing the service interest + message
//   6  Return { success, contactId }
//
// Deploy: supabase functions deploy site-contact-form --no-verify-jwt
//
// Required Supabase secrets:
//   GHL_AGENCY_API_KEY  — PIT token with contacts:write + contacts:read scope
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY  — standard Supabase env vars

import { serve }        from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Types ────────────────────────────────────────────────────────────────────

type Payload = {
  siteId:    string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  service:   string;
  message:   string;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const GHL_BASE    = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const INQUIRY_TAG = 'website-inquiry';

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ─── Supabase (service role — read-only lookup, bypasses RLS) ─────────────────

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')              ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── GHL helpers ─────────────────────────────────────────────────────────────

function ghlHeaders(apiKey: string) {
  return {
    Authorization:  `Bearer ${apiKey}`,
    Version:        GHL_VERSION,
    'Content-Type': 'application/json',
  };
}

// Step 3: Search for existing contact by email in the location
async function findContact(locationId: string, email: string, apiKey: string): Promise<string | null> {
  const url = `${GHL_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}&limit=1`;
  const res  = await fetch(url, { headers: ghlHeaders(apiKey) });
  if (!res.ok) return null;

  const data     = await res.json() as Record<string, unknown>;
  const contacts = (data?.contacts as Record<string, unknown>[]) ?? [];
  const match    = contacts.find(c => (c.email as string)?.toLowerCase() === email.toLowerCase());
  return (match?.id as string) ?? null;
}

// Step 4a: Create a new contact with the website-inquiry tag
async function createContact(
  locationId: string,
  payload: Payload,
  apiKey: string
): Promise<string | null> {
  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method:  'POST',
    headers: ghlHeaders(apiKey),
    body:    JSON.stringify({
      locationId,
      firstName: payload.firstName.trim(),
      lastName:  payload.lastName.trim(),
      email:     payload.email.trim().toLowerCase(),
      phone:     payload.phone.trim() || undefined,
      tags:      [INQUIRY_TAG],
      source:    'Website Contact Form',
    }),
  });

  if (!res.ok) {
    console.error(`GHL create contact failed ${res.status}:`, await res.text());
    return null;
  }

  const data      = await res.json() as Record<string, unknown>;
  const contactId = ((data?.contact as Record<string, unknown>)?.id ?? data?.id) as string ?? null;
  console.log(`GHL contact created: ${contactId}`);
  return contactId;
}

// Step 4b: Update an existing contact — ensure website-inquiry tag is applied
async function tagContact(contactId: string, locationId: string, apiKey: string): Promise<void> {
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    method:  'PUT',
    headers: ghlHeaders(apiKey),
    body:    JSON.stringify({
      locationId,
      tags: [INQUIRY_TAG],
    }),
  });
  if (!res.ok) console.warn(`GHL tag update failed ${res.status}:`, await res.text());
  else console.log(`GHL contact tagged: ${contactId}`);
}

// Step 5: Add a note with service interest + message
async function addNote(contactId: string, payload: Payload, apiKey: string): Promise<void> {
  const body = [
    payload.service ? `Service Interest: ${payload.service}` : '',
    payload.message ? `Message:\n${payload.message}`         : '',
  ].filter(Boolean).join('\n\n');

  if (!body) return;

  const res = await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
    method:  'POST',
    headers: ghlHeaders(apiKey),
    body:    JSON.stringify({ body }),
  });
  if (!res.ok) console.warn(`GHL note failed ${res.status}:`, await res.text());
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST')    return json({ error: 'POST only' }, 405);

  try {
    const payload = await req.json() as Partial<Payload>;

    // ── 1. Validate ──────────────────────────────────────────────────────────
    if (!payload.siteId?.trim()) return json({ error: 'siteId required' }, 400);
    if (!payload.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      return json({ error: 'Valid email required' }, 400);

    const apiKey = Deno.env.get('GHL_AGENCY_API_KEY');
    if (!apiKey) return json({ error: 'GHL_AGENCY_API_KEY not configured' }, 500);

    // ── 2. Look up location_id — active sites only ───────────────────────────
    const { data: site } = await supabase
      .from('client_sites_saas')
      .select('location_id')
      .eq('id', payload.siteId.trim())
      .eq('status', 'active')
      .maybeSingle();

    const locationId = (site as Record<string, unknown> | null)?.location_id as string ?? null;

    if (!locationId) {
      console.warn(`site-contact-form: no active site or location_id for siteId=${payload.siteId}`);
      return json({ error: 'Site not found' }, 404);
    }

    const p = payload as Payload;

    // ── 3. Search for existing contact ───────────────────────────────────────
    let contactId = await findContact(locationId, p.email.trim().toLowerCase(), apiKey);

    if (contactId) {
      // ── 4b. Existing contact — ensure tag is applied ─────────────────────
      console.log(`Existing contact found: ${contactId} — applying tag`);
      await tagContact(contactId, locationId, apiKey);
    } else {
      // ── 4a. New contact — create with tag ────────────────────────────────
      contactId = await createContact(locationId, p, apiKey);
      if (!contactId) return json({ error: 'Failed to create GHL contact' }, 500);
    }

    // ── 5. Add note (service interest + message) ─────────────────────────────
    await addNote(contactId, p, apiKey);

    console.log(`site-contact-form: success — location=${locationId} contact=${contactId}`);
    return json({ success: true, contactId });

  } catch (err) {
    console.error('site-contact-form error:', err);
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
