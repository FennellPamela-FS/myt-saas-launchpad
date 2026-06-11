// Supabase Edge Function: update-client-domain
//
// Updates custom_domain on a client_sites_saas row using the service role key,
// bypassing RLS. Called exclusively by Agency Admin — requires the shared
// ADMIN_SECRET header so the anon key alone cannot trigger writes.
//
// Deploy: supabase functions deploy update-client-domain --no-verify-jwt
//
// Required Supabase secrets:
//   ADMIN_SECRET              — shared secret, must match VITE_ADMIN_SECRET in launchpad
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

// Accepts bare hostnames like "www.example.com" or "example.com". Empty string = clear.
function isValidDomain(d: string): boolean {
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(d);
}

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
    const domain = body.domain?.trim() ?? '';

    if (!siteId) return json({ error: 'siteId required' }, 400);
    if (domain && !isValidDomain(domain)) return json({ error: 'Invalid domain format' }, 400);

    const supabase = getSupabase();
    const { error } = await supabase
      .from('client_sites_saas')
      .update({ custom_domain: domain || null })
      .eq('id', siteId);

    if (error) {
      console.error('update-client-domain DB error:', error.message);
      return json({ error: error.message }, 500);
    }

    console.log(`update-client-domain: siteId=${siteId} domain=${domain || 'cleared'}`);
    return json({ success: true });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('update-client-domain UNHANDLED ERROR:', msg);
    return json({ error: msg }, 500);
  }
});
