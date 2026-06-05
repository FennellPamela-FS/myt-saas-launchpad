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
  // Contact info (4)
  business_phone: string;
  business_address: string;
  business_hours: string;
  contact_form_title: string;
  // Innovative theme stat counters (3 key metrics about the business)
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
};


// ─── Supabase client (service role — bypasses RLS for writes) ────────────────

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── Step A: Parse GHL payload ───────────────────────────────────────────────

function parseGHLPayload(body: GHLPayload): { email: string; locationId: string; contactId: string | null } | null {
  const email =
    (body?.contact as Record<string, unknown>)?.email as string ||
    body?.email as string ||
    null;

  const locationId =
    (body?.location as Record<string, unknown>)?.id as string ||
    body?.locationId as string ||
    null;

  const contactId =
    (body?.contact as Record<string, unknown>)?.id as string ||
    body?.contactId as string ||
    null;

  if (!email || !locationId) return null;
  return {
    email: email.trim().toLowerCase(),
    locationId: locationId.trim(),
    contactId: contactId?.trim() ?? null,
  };
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
  "brand_tagline": "Short memorable brand tagline (max 8 words)",

  "business_phone": "A realistic placeholder phone number like (555) 123-4567",
  "business_address": "A realistic placeholder address for this type of business and industry region",
  "business_hours": "Typical business hours for this industry e.g. Mon-Fri: 9AM-6PM",
  "contact_form_title": "Contact section heading (max 6 words, e.g. 'Get Your Free Estimate')",

  "stat_1_value": "A key impact metric for this business type (e.g. '500+' or '$2M+' or '10 Yrs')",
  "stat_1_label": "What stat_1_value represents — 2-4 words (e.g. 'Clients Served')",
  "stat_2_value": "A second key metric (number, dollar amount, or percentage)",
  "stat_2_label": "What stat_2_value represents — 2-4 words (e.g. 'Projects Completed')",
  "stat_3_value": "A third key metric meaningful to this industry",
  "stat_3_label": "What stat_3_value represents — 2-4 words (e.g. 'Years Experience')"
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
): Promise<Record<string, string>> {
  const allValues: Record<string, string> = {
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
  return allValues;
}

// ─── Step D2: Create / update client_sites row ───────────────────────────────

function generateSlug(businessName: string, locationId: string): string {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 40);
  // Append last 6 chars of locationId for guaranteed uniqueness
  const suffix = locationId.slice(-6).toLowerCase();
  return base ? `${base}-${suffix}` : suffix;
}

async function upsertClientSite(
  email: string,
  locationId: string,
  deployment: PendingDeployment,
  allValues: Record<string, string>
): Promise<void> {
  const businessName = (deployment.discovery_data as DiscoveryData).businessName || '';
  const slug = generateSlug(businessName, locationId);

  // Pull brand colors and logo from pending_saas_deployments if stored
  const dd = deployment.discovery_data as Record<string, unknown>;
  const branding = (dd?.branding ?? {}) as Record<string, string>;

  const { error } = await supabase
    .from('client_sites_saas')
    .upsert(
      {
        location_id: locationId,
        email,
        business_name: businessName,
        slug,
        theme: deployment.theme,
        industry: deployment.industry_category,
        primary_color: branding.primaryColor ?? '#4EBCED',
        secondary_color: branding.secondaryColor ?? '#464E54',
        accent_color: branding.accentColor ?? '#45899E',
        logo_url: branding.logoUrl ?? null,
        generated_copy: allValues,
        custom_edits: {},
        status: 'active',
      },
      { onConflict: 'location_id' }
    );

  if (error) throw new Error(`Failed to upsert client_sites: ${error.message}`);
  console.log(`client_sites row ready: /site/${slug}`);
}

// ─── Step D3: Ensure contact exists in Agency HQ, then tag + inject site URL ──
//
// VIP / manual-trigger paths provide no contactId — this function searches
// the master agency account (AGENCY_HQ_LOCATION_ID) by email and creates
// the contact if it doesn't exist yet, so the welcome workflow always fires.

async function ensureAgencyHQContact(
  email: string,
  businessName: string,
  apiKey: string
): Promise<string | null> {
  const agencyHqLocationId = Deno.env.get('AGENCY_HQ_LOCATION_ID');
  if (!agencyHqLocationId) {
    console.warn('[provisioner] AGENCY_HQ_LOCATION_ID not set — skipping agency CRM lookup');
    return null;
  }

  // 1. Search by email first
  const searchRes = await fetch(
    `https://services.leadconnectorhq.com/contacts/?locationId=${agencyHqLocationId}&query=${encodeURIComponent(email)}&limit=1`,
    { headers: { Authorization: `Bearer ${apiKey}`, Version: '2021-07-28' } }
  );
  if (searchRes.ok) {
    const data     = await searchRes.json() as Record<string, unknown>;
    const contacts = (data?.contacts as Record<string, unknown>[]) ?? [];
    const existing = contacts.find(c => (c.email as string)?.toLowerCase() === email.toLowerCase());
    if (existing?.id) {
      console.log(`[provisioner] Agency HQ contact found: ${existing.id} for ${email}`);
      return existing.id as string;
    }
  }

  // 2. Create if not found
  const createRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      Version:        '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId:  agencyHqLocationId,
      firstName:   businessName,
      email,
      companyName: businessName,
      source:      'mytCreative Platform',
      tags:        [],
    }),
  });

  if (!createRes.ok) {
    console.warn(`[provisioner] Agency HQ contact create failed ${createRes.status}: ${await createRes.text()}`);
    return null;
  }

  const createData = await createRes.json() as Record<string, unknown>;
  const contactId  = (createData?.contact as Record<string, unknown>)?.id as string
    ?? createData?.id as string
    ?? null;
  console.log(`[provisioner] Agency HQ contact created: ${contactId} for ${email}`);
  return contactId;
}

// ─── Step D3b: Write site URL + fire welcome tag ──────────────────────────────

async function updateGHLContact(
  contactId: string,
  locationId: string,
  apiKey: string,
  siteUrl: string
): Promise<void> {
  const res = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId,
      website: siteUrl,
      tags: ['digital-founda-active'],
    }),
  });
  if (!res.ok) {
    console.warn(`[provisioner] GHL contact update failed ${res.status}: ${await res.text()}`);
  } else {
    console.log(`[provisioner] Tagged digital-founda-active + injected site URL for contact ${contactId}`);
  }
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

// ─── CORS headers (required for browser-originated calls from Agency Admin) ──

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  let email = '';

  try {
    // ── Step A: Parse GHL payload ──────────────────────────────────────────
    const body = (await req.json()) as GHLPayload;
    const parsed = parseGHLPayload(body);

    if (!parsed) {
      console.error('GHL payload missing email or locationId', JSON.stringify(body));
      return json({ error: 'Missing email or locationId in payload' }, 400);
    }

    const { email: parsedEmail, locationId, contactId } = parsed;
    email = parsedEmail;

    // ── Step B: Fetch pending deployment ───────────────────────────────────
    const { data: deployment, error: fetchError } = await supabase
      .from('pending_saas_deployments')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !deployment) {
      console.error(`No pending deployment found for email: ${email}`);
      return json({ error: 'No pending deployment found for this email' }, 400);
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

    // ── Step D: Save generated copy to pending_saas_deployments ──────────
    const allValues = await saveGeneratedCopy(email, locationId, generatedFields, deployment as PendingDeployment);

    // ── Step D2: Create client_sites row (powers the React platform) ──────
    await upsertClientSite(email, locationId, deployment as PendingDeployment, allValues);

    // ── Step D3: Ensure agency CRM contact exists, inject site URL, fire tag ──
    const ghlApiKey    = Deno.env.get('GHL_AGENCY_API_KEY');
    const businessName = (deployment.discovery_data as DiscoveryData).businessName || '';
    const slug         = generateSlug(businessName, locationId);
    const siteUrl      = `https://myt-client-platform.netlify.app/site/${slug}`;

    if (ghlApiKey) {
      // Use contactId passed from provision-client-workspace (VIP path) if
      // available; otherwise search/create in Agency HQ (Stripe + manual paths).
      let resolvedContactId = contactId;
      if (!resolvedContactId) {
        console.log(`[provisioner] No contactId in payload — resolving via Agency HQ for ${email}`);
        resolvedContactId = await ensureAgencyHQContact(email, businessName, ghlApiKey);
      }
      if (resolvedContactId) {
        await updateGHLContact(resolvedContactId, locationId, ghlApiKey, siteUrl);
      } else {
        console.warn(`[provisioner] Could not resolve agency contact for ${email} — tag skipped`);
      }
    }

    // ── Step E: Trigger Netlify build ─────────────────────────────────────
    await triggerNetlifyBuild(locationId, deployment.theme);

    // ── Step F: Mark deployment completed ─────────────────────────────────
    await supabase
      .from('pending_saas_deployments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('email', email);

    console.log(`Provisioning complete for ${email} → location ${locationId}`);

    return json({ success: true, locationId });
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

    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
