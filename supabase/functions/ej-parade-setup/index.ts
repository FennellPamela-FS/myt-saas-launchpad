// Supabase Edge Function: ej-parade-setup
//
// One-shot DFY configurator for Ty Whitehead / EJ's Parade of Hope.
//
// Executes in order:
//   1  Create custom field folder  "EJ Parade of Hope"
//   2  Create all 6 custom fields inside that folder
//   3  Return field IDs for use in GHL Form Builder
//
// Trigger once via:
//   curl -X POST https://<supabase-url>/functions/v1/ej-parade-setup \
//     -H "Authorization: Bearer <anon-key>" \
//     -H "Content-Type: application/json" \
//     -d '{ "locationId": "TY_LOCATION_ID" }'
//
// Deploy: supabase functions deploy ej-parade-setup --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GHL_BASE    = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

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

// ─── GHL API helpers ──────────────────────────────────────────────────────────

async function ghlPost(path: string, apiKey: string, body: unknown) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      Version:        GHL_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`GHL ${res.status} on ${path}: ${JSON.stringify(data)}`);
  return data;
}

// ─── Step 1: Create custom field folder ──────────────────────────────────────

async function createFolder(locationId: string, apiKey: string): Promise<string> {
  const data = await ghlPost(
    `/locations/${locationId}/customFields/folder`,
    apiKey,
    { name: 'EJ Parade of Hope' }
  ) as Record<string, unknown>;

  const folderId = (data?.folder as Record<string, unknown>)?.id as string
    ?? data?.id as string;

  if (!folderId) throw new Error(`Folder creation returned no ID: ${JSON.stringify(data)}`);
  console.log(`Folder created: ${folderId}`);
  return folderId;
}

// ─── Step 2: Create custom fields ────────────────────────────────────────────

type FieldDef = {
  name: string;
  dataType: string;
  placeholder?: string;
  options?: { label: string }[];
};

function buildFieldDefs(): FieldDef[] {
  return [
    // Field 1 — City of Residence
    {
      name:        'City of Residence',
      dataType:    'TEXT',
      placeholder: 'e.g. Washington, DC',
    },

    // Field 2 — Number of Children Attending
    {
      name:        'Number of Children Attending',
      dataType:    'NUMERICAL',
      placeholder: '0',
    },

    // Field 3 — Children Details
    {
      name:        'Children Details (Age, Gender, Grade)',
      dataType:    'LARGE_TEXT',
      placeholder: 'e.g.\nChild 1: Age 7, Girl, 2nd Grade\nChild 2: Age 10, Boy, 5th Grade',
    },

    // Field 4 — First Time Attending?
    {
      name:     'First Time Attending?',
      dataType: 'RADIO',
      options:  [
        { label: 'Yes' },
        { label: 'No'  },
      ],
    },

    // Field 5 — How did you hear about the event?
    {
      name:     'How did you hear about the event?',
      dataType: 'DROPDOWN',
      options:  [
        { label: 'Social Media'    },
        { label: 'Friend/Family'   },
        { label: 'Email'           },
        { label: 'Community Flyer' },
        { label: 'Other'           },
      ],
    },

    // Field 6 — Photo & Video Release Consent
    {
      name:     'Photo & Video Release Consent',
      dataType: 'CHECKBOX',
      options:  [
        {
          label: 'I grant permission for photos/videos taken during the event to be used for future marketing, educational, and community awareness purposes.',
        },
      ],
    },
  ];
}

async function createField(
  locationId: string,
  apiKey: string,
  folderId: string,
  position: number,
  field: FieldDef
): Promise<{ name: string; id: string; fieldKey: string }> {
  const payload: Record<string, unknown> = {
    name:     field.name,
    dataType: field.dataType,
    position,
    groupId:  folderId,
  };
  if (field.placeholder) payload.placeholder = field.placeholder;
  if (field.options)     payload.options     = field.options;

  const data = await ghlPost(
    `/locations/${locationId}/customFields`,
    apiKey,
    payload
  ) as Record<string, unknown>;

  const created = (data?.customField ?? data) as Record<string, unknown>;
  const id       = created?.id       as string;
  const fieldKey = created?.fieldKey as string;

  console.log(`  ✓ ${field.name}  id=${id}  key=${fieldKey}`);
  return { name: field.name, id, fieldKey };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST')    return json({ error: 'POST only' }, 405);

  try {
    const body       = await req.json() as { locationId?: string };
    const locationId = body?.locationId?.trim();
    if (!locationId) return json({ error: 'locationId is required' }, 400);

    const apiKey = Deno.env.get('GHL_AGENCY_API_KEY');
    if (!apiKey) return json({ error: 'GHL_AGENCY_API_KEY not configured' }, 500);

    console.log(`EJ Parade setup → location ${locationId}`);

    // 1. Folder
    const folderId = await createFolder(locationId, apiKey);

    // 2. Fields
    const fieldDefs = buildFieldDefs();
    const createdFields: { name: string; id: string; fieldKey: string }[] = [];

    for (let i = 0; i < fieldDefs.length; i++) {
      const result = await createField(locationId, apiKey, folderId, i, fieldDefs[i]);
      createdFields.push(result);
    }

    console.log('EJ Parade setup complete.');

    return json({
      success: true,
      folderId,
      fields: createdFields,
      nextSteps: [
        '1. Copy the fieldKey values above — you will need them when building the form in GHL UI.',
        '2. Go to GHL → Sites → Forms → New Form → "EJ Walk - Main Registration".',
        '3. Add standard fields: First Name, Last Name, Phone, Email.',
        '4. Add all 6 custom fields using the fieldKey values returned.',
        '5. Enable SMS and Email consent toggles in form settings.',
        '6. Add a Custom HTML block at the bottom with the disclaimer text.',
        '7. Build Workflow 1 (registration confirmation) and Workflow 2 (post-event survey) per the runbook.',
      ],
    });

  } catch (err) {
    console.error('[ej-parade-setup]', err);
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
