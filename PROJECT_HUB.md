# PROJECT HUB — mytSimple™ Launchpad

> Maintained by: Dr. Bynum / mytCreative
> Last updated: 2026-05-06

---

## Active Pivot: Generic Small Business Cohort

The LaunchPad has been repositioned to serve a **generic small business cohort**. The prior dependency on the S.C.O.R.E. assessment framework and its Supabase tables has been fully removed.

---

## Architecture Overview

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Multi-step form wizard at `/launchpad` |
| Styling | Tailwind CSS + shadcn/ui primitives | CSS variables already in `index.css` |
| State | Zustand (`src/store/launchpadStore.ts`) | Holds `discoveryData` + `themeSelection` |
| Edge Function | Supabase Edge Function (Deno) | `supabase/functions/launchpad-kickstart/` |
| AI Integration | Claude (primary) → Gemini (fallback) | Implemented in edge function |

---

## State Changes (2026-05-06)

### Removed
- All S.C.O.R.E. assessment state
- Supabase SCORE table queries from `launchpad-kickstart` edge function

### Added: `src/store/launchpadStore.ts`

New Zustand store with two top-level state slices:

#### `discoveryData: DiscoveryData`

| Field | Type | Purpose |
|---|---|---|
| `businessName` | `string` | The business's trading name |
| `vision` | `string` | Long-term vision / where they're headed |
| `hookAndProblem` | `string` | Core problem solved + attention hook |
| `services` | `string` | Services or products offered |
| `uniqueValue` | `string` | Differentiator / competitive advantage |
| `theAsk` | `string` | Desired visitor action (CTA) |

#### `themeSelection: ThemeSelection`

Enum controlling the visual tone of the generated site:

| Value | Description |
|---|---|
| `professional` | Clean, corporate, trust-first |
| `creative` | Bold, expressive, design-forward |
| `wellness` | Calm, nurturing, community-centered |
| `luxury` | Premium, refined, high-end feel |
| `minimalist` | Simple, focused, content-first |

---

## Component Changes (2026-05-06)

### New: `src/components/features/launchpad/AIKickstart.tsx`
- shadcn-style form (Label, Input, Textarea, Select primitives)
- Asks 6 discovery questions + theme dropdown
- Reads/writes directly to Zustand store
- Required field validation with inline error messaging

### Updated: `src/pages/LaunchpadPage.tsx`
- AIKickstart inserted as **Step 1** (all prior steps shifted +1)
- Total steps: 8 (1 AI Kickstart + 6 form steps + 1 success screen)
- Step label bar added above progress bar
- Discovery store seeded into `BusinessForm` (`businessName` auto-populated)
- `handleSubmit` now logs both `discoveryData` and `formData`

### New: shadcn UI Primitives
Located in `src/components/ui/`:
- `input.tsx`
- `textarea.tsx`
- `label.tsx`
- `select.tsx`

Utility: `src/lib/utils.ts` (`cn()` helper using `clsx` + `tailwind-merge`)

---

## Edge Function: `launchpad-kickstart`

**Path:** `supabase/functions/launchpad-kickstart/index.ts`

### Expected Request Payload
```json
{
  "discoveryData": {
    "businessName": "string",
    "vision": "string",
    "hookAndProblem": "string",
    "services": "string",
    "uniqueValue": "string",
    "theAsk": "string"
  },
  "themeSelection": "professional | creative | wellness | luxury | minimalist"
}
```

### Required Fields
`businessName`, `hookAndProblem`, `services`

### AI Provider Strategy
**Primary:** Claude (`claude-haiku-4-5-20251001`) via Anthropic Messages API
**Fallback:** Gemini (`gemini-1.5-flash`) via Google Generative Language API

If Claude returns any error (credits exhausted, rate limit, etc.), the function automatically retries with Gemini. The `provider` field in the response indicates which was used.

### Supabase Secrets Required
```
CLAUDE_API_KEY
GEMINI_API_KEY
```
Set via: `supabase secrets set CLAUDE_API_KEY=... GEMINI_API_KEY=...`

---

## Dependency Additions (2026-05-06)

| Package | Version | Purpose |
|---|---|---|
| `zustand` | ^5.x | Lightweight global state store |
| `@radix-ui/react-label` | ^2.x | shadcn Label primitive |
| `@radix-ui/react-select` | ^2.x | shadcn Select primitive |
| `class-variance-authority` | ^0.7.x | CVA for variant styling |
| `clsx` | ^2.x | Conditional classname utility |
| `tailwind-merge` | ^2.x | Tailwind class merge deduplication |

---

---

## Hand-off and Catch — Master Snapshot Architecture (updated 2026-05-06)

### Overview

When a prospect completes the AI Kickstart form they are **not** advanced to the next wizard step — they are routed to a single GHL checkout page. The **Master Snapshot** model uses one universal GHL offer/snapshot for all industries. Industry context is passed as a query parameter so the post-payment webhook can apply the correct configuration.

```
[AI Kickstart Form]
       │  Submit
       ▼
[handleSaaSCheckout]  ──► Supabase upsert → pending_saas_deployments
       │  Success
       ▼
[window.location.href]  ──► VITE_GHL_MASTER_CHECKOUT_URL?email=...&industry=...
       │  Payment complete
       ▼
[GHL Webhook]  ──► reads pending_saas_deployments by email ──► configures master snapshot
```

### Why Master Snapshot?

- One GHL offer to manage instead of 15
- Industry-specific configuration handled post-payment by the webhook reading `industry_category` from `pending_saas_deployments`
- Simpler pricing and checkout UX for the prospect

### Database: `pending_saas_deployments`

| Column | Type | Notes |
|---|---|---|
| `email` | `TEXT PK` | Prospect's email; used by GHL webhook to fetch state |
| `industry_category` | `TEXT` | Drives snapshot configuration post-payment |
| `discovery_data` | `JSONB` | Full `DiscoveryData` object from the store |
| `theme` | `TEXT` | One of the 5 theme values |
| `created_at` | `TIMESTAMPTZ` | Auto-set on insert |

Migration: `supabase/migrations/20260506000001_create_pending_saas_deployments.sql`

RLS: anon users can insert/upsert their own row. Service role (GHL webhook) has full access.

### Checkout Router: `src/lib/checkout.ts`

`handleSaaSCheckout({ email, discoveryData, themeSelection })` — async, returns `CheckoutError | null`.

**Flow:**
1. Validates email and `industryCategory`
2. Reads `VITE_GHL_MASTER_CHECKOUT_URL` — single env var for all industries
3. Upserts row into `pending_saas_deployments` (conflict on `email`)
4. Redirects to `VITE_GHL_MASTER_CHECKOUT_URL?email=...&industry=...`

**Error codes:**

| Code | Meaning |
|---|---|
| `MISSING_EMAIL` | Email blank or malformed |
| `MISSING_INDUSTRY` | No industry selected |
| `NO_CHECKOUT_URL` | `VITE_GHL_MASTER_CHECKOUT_URL` not set |
| `DB_ERROR` | Supabase upsert failed |

### Environment Variable

| Variable | Purpose |
|---|---|
| `VITE_GHL_MASTER_CHECKOUT_URL` | Single GHL checkout URL for the master snapshot offer |

Set in `.env` (local) and in Netlify/Vercel environment settings (production).

---

---

## SaaS Provisioner Webhook (2026-05-06)

### Function: `supabase/functions/ghl-saas-provisioner/index.ts`

Receives the GHL **Order Submitted** webhook after a Digital Founda Plan purchase and runs the full provisioning pipeline.

**Deploy command:**
```bash
supabase functions deploy ghl-saas-provisioner --no-verify-jwt
```
`--no-verify-jwt` is required — GHL cannot sign Supabase JWTs.

**GHL Workflow setup:** In GHL, create a Workflow triggered by **Order Submitted** (Digital Founda Plan). Add a Webhook action pointing to:
```
https://<project-ref>.supabase.co/functions/v1/ghl-saas-provisioner
```

### Pipeline Steps

| Step | Action |
|---|---|
| **A** | Parse GHL payload — extract `email` from `contact.email` or `email`; `locationId` from `location.id` or `locationId` |
| **B** | Query `pending_saas_deployments` by email — return 400 if not found; mark row `processing` |
| **C** | Generate **46 ABCCC website fields** via Claude (`claude-haiku-4-5-20251001`) → Gemini fallback |
| **D** | Push **49 Custom Values** (46 AI + email + industry + theme) to the GHL sub-account via Agency API |
| **E** | POST to `NETLIFY_BUILD_HOOK` with `{ locationId, theme }` to trigger site build |
| **F** | Update row to `completed` with `completed_at` timestamp; on any error → `failed` with `error_message` |

### 46 AI-Generated Fields (ABCCC)

| Section | Fields |
|---|---|
| Hero (5) | `hero_headline`, `hero_subheadline`, `hero_cta_primary`, `hero_cta_secondary`, `hero_value_statement` |
| About (5) | `about_headline`, `about_body`, `about_mission`, `about_cta_text`, `about_tagline` |
| Services (16) | `service_{1-4}_name`, `service_{1-4}_description`, `service_{1-4}_benefit`, `service_{1-4}_cta` |
| Benefits (8) | `benefit_{1-4}_title`, `benefit_{1-4}_description` |
| Social Proof (6) | `testimonial_{1-2}_quote`, `testimonial_{1-2}_name`, `testimonial_{1-2}_role` |
| CTA (4) | `cta_section_headline`, `cta_section_body`, `cta_button_text`, `cta_urgency_line` |
| Brand/SEO (2) | `meta_description`, `brand_tagline` |

**+ 3 static fields** (business_email, industry_category, theme_selection) = **49 total Custom Values**

GHL custom value `fieldKey` convention: `custom_values.{field_name}`

### Updated Table Schema: `pending_saas_deployments`

Migration `20260506000002` adds:

| Column | Type | Notes |
|---|---|---|
| `status` | `TEXT` | `pending` → `processing` → `completed` / `failed` |
| `error_message` | `TEXT` | Populated on failure |
| `completed_at` | `TIMESTAMPTZ` | Set when status = completed |
| `location_id` | `TEXT` | GHL sub-account ID written at processing time |

### Supabase Secrets Required

```bash
supabase secrets set \
  CLAUDE_API_KEY=... \
  GEMINI_API_KEY=... \
  GHL_AGENCY_API_KEY=... \
  NETLIFY_BUILD_HOOK=...
```

Note: `NETLIFY_BUILD_HOOK` is the server-side secret name — do not prefix with `VITE_` in Supabase secrets.

### GHL API Rate Limiting

Custom values are pushed in parallel batches of 5 to respect GHL API limits. 49 values = 10 batches.

---

## Next Steps

- [x] `VITE_GHL_MASTER_CHECKOUT_URL` — populated
- [ ] Run `supabase db push` to apply migration 20260506000002 (adds status columns)
- [ ] Set Supabase secrets: `CLAUDE_API_KEY`, `GEMINI_API_KEY`, `GHL_AGENCY_API_KEY`, `NETLIFY_BUILD_HOOK`
- [ ] Deploy: `supabase functions deploy ghl-saas-provisioner --no-verify-jwt`
- [ ] Wire GHL Workflow: Order Submitted → Webhook → provisioner URL
- [ ] Confirm GHL snapshot custom value `fieldKey` names match the 46-field map above
