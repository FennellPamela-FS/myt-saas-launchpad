// Supabase Edge Function: get-copy
//
// Called by the GHL Workflow webhook action after an Order Submitted event.
// Returns the AI-generated copy (49 fields) for a given email so the GHL
// Workflow can map each field to a native Custom Value update action.
//
// Deploy with: supabase functions deploy get-copy --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();

    // Accept email from GHL webhook payload — check common locations
    const email: string =
      (body?.contact?.email as string) ||
      (body?.email as string) ||
      '';

    if (!email.trim()) {
      return new Response(
        JSON.stringify({ error: 'email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const { data, error } = await supabase
      .from('pending_saas_deployments')
      .select('generated_copy, industry_category, theme, location_id, status')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: `No deployment found for ${email}` }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    if (!data.generated_copy) {
      return new Response(
        JSON.stringify({ error: 'Copy not yet generated. Provisioner may still be running.' }),
        { status: 202, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: data.generated_copy,
        meta: {
          industry: data.industry_category,
          theme: data.theme,
          locationId: data.location_id,
          status: data.status,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err) {
    console.error('get-copy error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
});
