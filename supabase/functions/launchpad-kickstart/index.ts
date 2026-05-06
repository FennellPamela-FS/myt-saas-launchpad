// Supabase Edge Function: launchpad-kickstart
//
// Generates AI-powered site copy from discovery data.
// Primary provider: Claude (Anthropic). Fallback: Gemini (Google).
// SCORE assessment dependency removed — all context comes from the request body.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

export type ThemeSelection =
  | 'professional'
  | 'creative'
  | 'wellness'
  | 'luxury'
  | 'minimalist';

export type DiscoveryData = {
  businessName: string;
  vision: string;
  hookAndProblem: string;
  services: string;
  uniqueValue: string;
  theAsk: string;
};

type KickstartPayload = {
  discoveryData: DiscoveryData;
  themeSelection: ThemeSelection;
};

export type GeneratedCopy = {
  tagline: string;
  mainHeadline: string;
  subheadline1: string;
  subheadline2: string;
  introTitle: string;
  introText: string;
  aboutText: string;
  ctaText: string;
  provider: 'claude' | 'gemini';
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── Prompt ────────────────────────────────────────────────────────────────

function buildPrompt(data: DiscoveryData, theme: ThemeSelection): string {
  return `You are an expert copywriter for small business websites. Based on the business discovery answers below, write compelling website copy tailored to a "${theme}" visual theme.

DISCOVERY ANSWERS:
- Business Name: ${data.businessName}
- Vision: ${data.vision}
- Hook & Problem Solved: ${data.hookAndProblem}
- Services/Products: ${data.services}
- Unique Value: ${data.uniqueValue}
- Call to Action: ${data.theAsk}

THEME GUIDANCE:
- professional: authoritative, concise, trust-building language
- creative: bold, energetic, expressive language
- wellness: warm, nurturing, community-focused language
- luxury: elevated, refined, exclusive language
- minimalist: spare, direct, no-fluff language

Return ONLY a valid JSON object (no markdown, no explanation) with exactly these fields:
{
  "tagline": "Short punchy tagline (max 10 words)",
  "mainHeadline": "Primary hero headline (max 12 words)",
  "subheadline1": "Supporting point 1 (max 15 words)",
  "subheadline2": "Supporting point 2 (max 15 words)",
  "introTitle": "Introduction section title (max 8 words)",
  "introText": "2-3 sentence introduction paragraph",
  "aboutText": "3-4 sentence about/solutions paragraph that highlights the unique value",
  "ctaText": "Call-to-action button text (max 6 words)"
}`;
}

// ─── Claude ────────────────────────────────────────────────────────────────

async function callClaude(prompt: string): Promise<GeneratedCopy> {
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
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude error ${res.status}: ${body}`);
  }

  const json = await res.json();
  const text = json.content?.[0]?.text ?? '';
  const parsed = JSON.parse(text) as Omit<GeneratedCopy, 'provider'>;
  return { ...parsed, provider: 'claude' };
}

// ─── Gemini ────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<GeneratedCopy> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini error ${res.status}: ${body}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const parsed = JSON.parse(text) as Omit<GeneratedCopy, 'provider'>;
  return { ...parsed, provider: 'gemini' };
}

// ─── Handler ───────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const payload: KickstartPayload = await req.json();
    const { discoveryData, themeSelection } = payload;

    if (!discoveryData?.businessName || !discoveryData?.hookAndProblem || !discoveryData?.services) {
      return new Response(
        JSON.stringify({ error: 'businessName, hookAndProblem, and services are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const prompt = buildPrompt(discoveryData, themeSelection ?? 'professional');

    let result: GeneratedCopy;

    try {
      result = await callClaude(prompt);
    } catch (claudeErr) {
      console.warn('Claude failed, falling back to Gemini:', claudeErr);
      result = await callGemini(prompt);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err) {
    console.error('launchpad-kickstart error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
});
