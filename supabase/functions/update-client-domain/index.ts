// Supabase Edge Function: update-client-domain
//
// Updates custom_domain on a client_sites_saas row using the service role key,
// bypassing RLS. Then syncs the change to the Netlify site's domain_aliases
// array so the alias is registered (or removed) automatically — no manual
// Netlify dashboard step required.
//
// Deploy: supabase functions deploy update-client-domain --no-verify-jwt
//
// Required Supabase secrets:
//   ADMIN_SECRET              — shared secret, must match VITE_ADMIN_SECRET in launchpad
//   NETLIFY_TOKEN             — Netlify personal access token (app.netlify.com/user/applications)
//   NETLIFY_SITE_ID           — site ID for myt-client-platform (Netlify → Site configuration)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — standard Supabase env vars

import { serve }        from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL')              ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

function isValidDomain(d: string): boolean {
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(d);
}

// ─── Netlify helpers ──────────────────────────────────────────────────────────

async function getNetlifyAliases(token: string, siteId: string): Promise<string[]> {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Netlify GET site failed ${res.status}: ${await res.text()}`);
  const site = await res.json() as { domain_aliases?: string[] };
  return site.domain_aliases ?? [];
}

async function patchNetlifyAliases(token: string, siteId: string, aliases: string[]): Promise<void> {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method:  'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ domain_aliases: aliases }),
  });
  if (!res.ok) throw new Error(`Netlify PATCH site failed ${res.status}: ${await res.text()}`);
}

async function syncNetlifyAlias(newDomain: string, oldDomain: string | null): Promise<void> {
  const token  = Deno.env.get('NETLIFY_TOKEN');
  const siteId = Deno.env.get('NETLIFY_SITE_ID');

  if (!token || !siteId) {
    console.warn('update-client-domain: NETLIFY_TOKEN or NETLIFY_SITE_ID not set — skipping alias sync');
    return;
  }

  const current = await getNetlifyAliases(token, siteId);

  // Remove old domain (if there was one), add new domain (if one was set)
  let updated = current.filter(d => d !== oldDomain);
  if (newDomain && !updated.includes(newDomain)) updated = [...updated, newDomain];

  await patchNetlifyAliases(token, siteId, updated);
  console.log(`update-client-domain: Netlify aliases synced — removed=${oldDomain ?? 'none'} added=${newDomain || 'none'}`);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST')    return json({ error: 'POST only' }, 405);

  const secret = req.headers.get('x-admin-secret');
  if (!secret || secret !== Deno.env.get('ADMIN_SECRET')) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body   = await req.json() as { siteId?: string; domain?: string };
    const siteId = body.siteId?.trim() ?? '';
    const domain = body.domain?.trim()  ?? '';

    if (!siteId) return json({ error: 'siteId required' }, 400);
    if (domain && !isValidDomain(domain)) return json({ error: 'Invalid domain format' }, 400);

    const supabase = getSupabase();

    // Read current domain so we know what to remove from Netlify if clearing
    const { data: existing } = await supabase
      .from('client_sites_saas')
      .select('custom_domain')
      .eq('id', siteId)
      .maybeSingle();

    const oldDomain = (existing as { custom_domain: string | null } | null)?.custom_domain ?? null;

    // Write to Supabase
    const { error: dbError } = await supabase
      .from('client_sites_saas')
      .update({ custom_domain: domain || null })
      .eq('id', siteId);

    if (dbError) {
      console.error('update-client-domain DB error:', dbError.message);
      return json({ error: dbError.message }, 500);
    }

    console.log(`update-client-domain: siteId=${siteId} old=${oldDomain ?? 'none'} new=${domain || 'cleared'}`);

    // Sync Netlify alias — non-fatal if it fails
    try {
      await syncNetlifyAlias(domain, oldDomain);
    } catch (netlifyErr) {
      const msg = netlifyErr instanceof Error ? netlifyErr.message : String(netlifyErr);
      console.warn('update-client-domain: Netlify sync failed (non-fatal):', msg);
      // Return success with a warning — the Supabase write succeeded
      return json({ success: true, warning: `Domain saved but Netlify alias sync failed: ${msg}` });
    }

    return json({ success: true });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('update-client-domain UNHANDLED ERROR:', msg);
    return json({ error: msg }, 500);
  }
});
