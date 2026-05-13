// Supabase Edge Function: ghl-saas-provisioner
//
// Receives the GHL 'Order Submitted' webhook after a Digital Founda Plan purchase.
// Orchestrates the full SaaS provisioning pipeline:
//   A → Parse GHL payload (email + locationId)
//   B → Fetch pending_saas_deployments record by email
//   C → Generate 46 ABCCC website fields via Claude → Gemini fallback
//   D → Push 49 Custom Values into the GHL sub-account
//   E → Trigger Netlify build hook
//   F → Mark deployment row as 'completed'
//
// Deploy with: supabase functions deploy ghl-saas-provisioner --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Types ───────────────────────────────────────────────────────────────────

type GHLPayload = Record<string, unknown>;

type PendingDeployment = {
  email: string;
  industry_category: string;
  discovery_data: DiscoveryData;
  theme: string;
  status: string;
};

type DiscoveryData = {
  industryCategory: string;
  businessName: string;
  vision: string;
  hookAndProblem: string;
  services: string;
  uniqueValue: string;
  theAsk: string;
};

// 46 AI-generated fields — maps 1-to-1 with GHL custom value fieldKeys
// fieldKey convention: custom_values.{key}
type GeneratedFields = {
  // Hero (5)
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_value_statement: string;
  // About (5)
  about_headline: string;
  about_body: string;
  about_mission: string;
  about_cta_text: string;
  about_tagline: string;
  // Services — 4 services × 4 fields (16)
  service_1_name: string;
  service_1_description: string;
  service_1_benefit: string;
  service_1_cta: string;
  service_2_name: string;
  service_2_description: string;
  service_2_benefit: string;
  service_2_cta: string;
  service_3_name: string;
  service_3_description: string;
  service_3_benefit: string;
  service_3_cta: string;
  service_4_name: string;
  service_4_description: string;
  service_4_benefit: string;
  service_4_cta: string;
  // Benefits / Why Us — 4 × 2 (8)
  benefit_1_title: string;
  benefit_1_description: string;
  benefit_2_title: string;
  benefit_2_description: string;
  benefit_3_title: string;
  benefit_3_description: string;
  benefit_4_title: string;
  benefit_4_description: string;
  // Social Proof — 2 testimonials × 3 (6)
  testimonial_1_quote: string;
  testimonial_1_name: string;
  testimonial_1_role: string;
  testimonial_2_quote: string;
  testimonial_2_name: string;
  testimonial_2_role: string;
  // CTA / Conversion (4)
  cta_section_headline: string;
  cta_section_body: string;
  cta_button_text: string;
  cta_urgency_line: string;
  // Brand / SEO (2)
  meta_description: string;
  brand_tagline: string;
};


// ─── Supabase client (service role — bypasses RLS for writes) ────────────────

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── Step A: Parse GHL payload ───────────────────────────────────────────────

function parseGHLPayload(body: GHLPayload): { email: string; locationId: string } | null {
  const email =
    (body?.contact as Record<string, unknown>)?.email as string ||
    body?.email as string ||
    null;

  const locationId =
    (body?.location as Record<string, unknown>)?.id as string ||
    body?.locationId as string ||
    null;

  if (!email || !locationId) return null;
  return { email: email.trim().toLowerCase(), locationId: locationId.trim() };
}

// ─── Step C: AI copy generation ──────────────────────────────────────────────

function buildCopyPrompt(data: DiscoveryData, industry: string): string {
  return `You are an expert website copywriter for small businesses. Using the discovery answers below, write all website copy for a ${industry.replace(/_/g, ' ')} business.

DISCOVERY:
- Business Name: ${data.businessName}
- Vision: ${data.vision}
- Hook & Problem Solved: ${data.hookAndProblem}
- Services/Products: ${data.services}
- Unique Value: ${data.uniqueValue}
- Call to Action: ${data.theAsk}

Return ONLY a valid JSON object (no markdown, no commentary) with exactly these 46 keys:

{
  "hero_headline": "Primary hero headline (max 12 words)",
  "hero_subheadline": "Supporting hero line (max 20 words)",
  "hero_cta_primary": "Primary CTA button text (max 6 words)",
  "hero_cta_secondary": "Secondary CTA button text (max 6 words)",
  "hero_value_statement": "One-line value proposition (max 15 words)",

  "about_headline": "About section heading (max 10 words)",
  "about_body": "2-3 sentence about paragraph",
  "about_mission": "One sentence mission statement",
  "about_cta_text": "About section CTA (max 6 words)",
  "about_tagline": "Brand tagline (max 8 words)",

  "service_1_name": "Service 1 name",
  "service_1_description": "Service 1 description (1-2 sentences)",
  "service_1_benefit": "Key benefit of service 1 (max 10 words)",
  "service_1_cta": "Service 1 CTA (max 5 words)",
  "service_2_name": "Service 2 name",
  "service_2_description": "Service 2 description (1-2 sentences)",
  "service_2_benefit": "Key benefit of service 2 (max 10 words)",
  "service_2_cta": "Service 2 CTA (max 5 words)",
  "service_3_name": "Service 3 name",
  "service_3_description": "Service 3 description (1-2 sentences)",
  "service_3_benefit": "Key benefit of service 3 (max 10 words)",
  "service_3_cta": "Service 3 CTA (max 5 words)",
  "service_4_name": "Service 4 name",
  "service_4_description": "Service 4 description (1-2 sentences)",
  "service_4_benefit": "Key benefit of service 4 (max 10 words)",
  "service_4_cta": "Service 4 CTA (max 5 words)",

  "benefit_1_title": "Why-us benefit 1 title (max 6 words)",
  "benefit_1_description": "Benefit 1 explanation (1 sentence)",
  "benefit_2_title": "Why-us benefit 2 title (max 6 words)",
  "benefit_2_description": "Benefit 2 explanation (1 sentence)",
  "benefit_3_title": "Why-us benefit 3 title (max 6 words)",
  "benefit_3_description": "Benefit 3 explanation (1 sentence)",
  "benefit_4_title": "Why-us benefit 4 title (max 6 words)",
  "benefit_4_description": "Benefit 4 explanation (1 sentence)",

  "testimonial_1_quote": "Plausible client testimonial quote (2-3 sentences)",
  "testimonial_1_name": "Client first name + last initial",
  "testimonial_1_role": "Client title or descriptor",
  "testimonial_2_quote": "Plausible client testimonial quote (2-3 sentences)",
  "testimonial_2_name": "Client first name + last initial",
  "testimonial_2_role": "Client title or descriptor",

  "cta_section_headline": "Final CTA section headline (max 10 words)",
  "cta_section_body": "CTA section supporting copy (1-2 sentences)",
  "cta_button_text": "Final CTA button (max 6 words)",
  "cta_urgency_line": "Urgency or trust line below button (max 12 words)",

  "meta_description": "SEO meta description (max 155 characters)",
  "brand_tagline": "Short memorable brand tagline (max 8 words)"
}`;
}

function stripMarkdown(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

async function callClaude(prompt: string): Promise<GeneratedFields> {
  const apiKey = Deno.env.get('CLAUDE_API_KEY');
  if (!apiKey) throw new Error('CLAUDE_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return JSON.parse(stripMarkdown(json.content?.[0]?.text ?? '{}')) as GeneratedFields;
}

async function callGemini(prompt: string): Promise<GeneratedFields> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return JSON.parse(
    stripMarkdown(json.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}')
  ) as GeneratedFields;
}

async function generateCopy(data: DiscoveryData, industry: string): Promise<GeneratedFields> {
  const prompt = buildCopyPrompt(data, industry);
  try {
    return await callClaude(prompt);
  } catch (err) {
    console.warn('Claude failed, falling back to Gemini:', err);
    return await callGemini(prompt);
  }
}

// ─── Step D: GHL Custom Values ────────────────────────────────────────────────

// ─── Step D: Store generated copy in Supabase ────────────────────────────────
// GHL Workflow reads this via the get-copy edge function and applies the
// 49 values natively using GHL's own Custom Value actions — bypassing the
// agency API scope limitation on sub-account Custom Values.

async function saveGeneratedCopy(
  email: string,
  locationId: string,
  fields: GeneratedFields,
  deployment: PendingDeployment
): Promise<void> {
  const allValues = {
    ...fields,
    business_email: deployment.email,
    industry_category: deployment.industry_category,
    theme_selection: deployment.theme,
  };

  const { error } = await supabase
    .from('pending_saas_deployments')
    .update({ generated_copy: allValues })
    .eq('email', email);

  if (error) throw new Error(`Failed to save generated copy: ${error.message}`);

  console.log(`Generated copy saved for ${email} → location ${locationId}`);
}

// ─── Step E: Netlify Build Hook ───────────────────────────────────────────────

async function triggerNetlifyBuild(locationId: string, theme: string): Promise<void> {
  const hookUrl = Deno.env.get('NETLIFY_BUILD_HOOK');
  if (!hookUrl) {
    console.warn('NETLIFY_BUILD_HOOK not set — skipping build trigger');
    return;
  }
  await fetch(hookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locationId, theme }),
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  let email = '';

  try {
    // ── Step A: Parse GHL payload ──────────────────────────────────────────
    const body = (await req.json()) as GHLPayload;
    const parsed = parseGHLPayload(body);

    if (!parsed) {
      console.error('GHL payload missing email or locationId', JSON.stringify(body));
      return new Response(JSON.stringify({ error: 'Missing email or locationId in payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email: parsedEmail, locationId } = parsed;
    email = parsedEmail;

    // ── Step B: Fetch pending deployment ───────────────────────────────────
    const { data: deployment, error: fetchError } = await supabase
      .from('pending_saas_deployments')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !deployment) {
      console.error(`No pending deployment found for email: ${email}`);
      return new Response(JSON.stringify({ error: 'No pending deployment found for this email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mark as processing to prevent duplicate runs
    await supabase
      .from('pending_saas_deployments')
      .update({ status: 'processing', location_id: locationId })
      .eq('email', email);

    // ── Step C: Generate 46 ABCCC website fields ───────────────────────────
    const generatedFields = await generateCopy(
      deployment.discovery_data as DiscoveryData,
      deployment.industry_category
    );

    // ── Step D: Save generated copy to Supabase ───────────────────────────
    // GHL Workflow will read this via get-copy edge function and apply
    // the 49 values natively using GHL's own Custom Value workflow actions.
    await saveGeneratedCopy(email, locationId, generatedFields, deployment as PendingDeployment);

    // ── Step E: Trigger Netlify build ─────────────────────────────────────
    await triggerNetlifyBuild(locationId, deployment.theme);

    // ── Step F: Mark deployment completed ─────────────────────────────────
    await supabase
      .from('pending_saas_deployments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('email', email);

    console.log(`Provisioning complete for ${email} → location ${locationId}`);

    return new Response(JSON.stringify({ success: true, locationId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ghl-saas-provisioner error:', err);

    // Mark as failed if we got far enough to have an email
    if (email) {
      await supabase
        .from('pending_saas_deployments')
        .update({
          status: 'failed',
          error_message: err instanceof Error ? err.message : String(err),
        })
        .eq('email', email);
    }

    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
