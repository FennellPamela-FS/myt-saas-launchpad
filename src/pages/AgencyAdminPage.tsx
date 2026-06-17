import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Copy, Check, ChevronDown, Shield, ExternalLink, RefreshCw, Pencil, Globe, X, BookOpen, Server, ArrowRight, AlertCircle, UserPlus, Link2, Zap, Clock, Users, Mail, Settings } from 'lucide-react';

type SiteRow = {
  id: string;
  email: string;
  business_name: string;
  location_id: string;
  slug: string;
  custom_domain: string | null;
  ghl_location_key: string | null;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
};

type QueueRow = {
  email: string;
  alt_email: string | null;
  location_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  industry_category: string;
  discovery_data: { businessName?: string } | null;
  created_at: string;
  error_message?: string | null;
  cohort?: string | null;
};

type CohortRow = {
  email: string;
  location_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  industry_category: string;
  discovery_data: { businessName?: string } | null;
  created_at: string;
  cohort: string;
};

// Known cohorts with display config — add new cohorts here
const COHORT_REGISTRY: Record<string, { displayName: string; seatLimit: number; color: string }> = {
  inspire_dmv:     { displayName: 'Inspire DMV',     seatLimit: 13, color: 'amber' },
  better_business: { displayName: 'Better Business', seatLimit: 30, color: 'blue'  },
};

const AGENCY_ADMINS = (import.meta.env.VITE_AGENCY_ADMINS as string ?? '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

const CLIENT_PLATFORM_URL = (
  import.meta.env.VITE_CLIENT_PLATFORM_URL as string ?? 'https://myt-client-platform.netlify.app'
).replace(/\/$/, '').replace(/\/site$/, '');

const GHL_ACCOUNTS_BASE = 'https://app.mytcreative.com/accounts/detail';


function cleanDomain(raw: string): string {
  return raw.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
}

function getMagicLink(row: SiteRow): string {
  if (row.location_id) return `${GHL_ACCOUNTS_BASE}/${row.location_id}/`;
  return `${CLIENT_PLATFORM_URL}/${row.slug}`;
}

function StatusBadge({ status }: { status: SiteRow['status'] }) {
  const map: Record<SiteRow['status'], { label: string; cls: string }> = {
    pending:  { label: 'Pending',     cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    inactive: { label: 'Provisioned', cls: 'bg-blue-100   text-blue-800   border-blue-200'   },
    active:   { label: 'Live',        cls: 'bg-green-100  text-green-800  border-green-200'  },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

function getEnrollLink(locationId: string): string {
  return `${window.location.origin}/launchpad?enroll=${locationId}`;
}

function ActionsCell({ row, onEditDomain }: { row: SiteRow; onEditDomain: () => void }) {
  const [open, setOpen]                   = useState(false);
  const [copied, setCopied]               = useState(false);
  const [copiedEnroll, setCopiedEnroll]   = useState(false);
  const [copiedLocId, setCopiedLocId]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function copyMagicLink() {
    await navigator.clipboard.writeText(getMagicLink(row));
    setCopied(true); setOpen(false);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyEnrollLink() {
    if (!row.location_id) return;
    await navigator.clipboard.writeText(getEnrollLink(row.location_id));
    setCopiedEnroll(true); setOpen(false);
    setTimeout(() => setCopiedEnroll(false), 2000);
  }

  async function copyLocationId() {
    if (!row.location_id) return;
    await navigator.clipboard.writeText(row.location_id);
    setCopiedLocId(true); setOpen(false);
    setTimeout(() => setCopiedLocId(false), 2000);
  }

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
      >
        Actions
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
          <button
            onClick={copyMagicLink}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            {copied ? 'Copied!' : 'Copy Magic Link'}
          </button>
          {row.location_id && (<>
            <button
              onClick={copyEnrollLink}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copiedEnroll ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4 text-gray-400" />}
              {copiedEnroll ? 'Copied!' : 'Copy Enrollment Link'}
            </button>
            <button
              onClick={copyLocationId}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copiedLocId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              {copiedLocId ? 'Copied!' : 'Copy Location ID'}
            </button>
          </>)}
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { setOpen(false); onEditDomain(); }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-400" />
            Edit Domain
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Auth Gate ───────────────────────────────────────────────────────────────

function AuthGate() {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError]           = useState('');
  const [sending, setSending]       = useState(false);
  const [sent, setSent]             = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = emailInput.trim().toLowerCase();

    if (AGENCY_ADMINS.length > 0 && !AGENCY_ADMINS.includes(normalized)) {
      setError('Access denied. This email is not authorized.');
      return;
    }

    setSending(true);
    setError('');
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { emailRedirectTo: `${window.location.origin}/agency-admin` },
    });
    setSending(false);

    if (otpError) {
      setError(otpError.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Check your email</h1>
            <p className="text-sm text-gray-500 text-center">
              We sent a sign-in link to <span className="font-medium text-gray-800">{emailInput}</span>. Click it to access the dashboard.
            </p>
          </div>
          <button
            onClick={() => { setSent(false); setError(''); }}
            className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Agency Command Center</h1>
          <p className="text-sm text-gray-500 text-center">Enter your agency email to receive a sign-in link</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            placeholder="you@mytcreative.com"
            required
            autoFocus
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function AgencyAdminPage() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<'sites' | 'queue' | 'cohorts' | 'runbook' | 'platform'>('sites');
  const [sites, setSites]           = useState<SiteRow[]>([]);
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Pending deployment queue
  const [queue, setQueue]           = useState<QueueRow[]>([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [provisioning, setProvisioning] = useState<Record<string, 'running' | 'done' | 'error'>>({});

  // Inline location ID editing
  const [editingLocEmail, setEditingLocEmail] = useState<string | null>(null);
  const [locIdDraft, setLocIdDraft]           = useState('');
  const [locIdSaving, setLocIdSaving]         = useState(false);

  // Inline primary email editing
  const [editingEmailRow, setEditingEmailRow] = useState<string | null>(null);
  const [emailDraft, setEmailDraft]           = useState('');
  const [emailSaving, setEmailSaving]         = useState(false);
  const [emailConflict, setEmailConflict]     = useState(false);

  async function saveQueueEmail(oldEmail: string) {
    const newEmail = emailDraft.trim().toLowerCase();
    if (!newEmail || newEmail === oldEmail) { setEditingEmailRow(null); return; }
    setEmailConflict(false);
    setEmailSaving(true);

    // Guard: don't overwrite an existing record
    const { data: existing } = await supabase
      .from('pending_saas_deployments')
      .select('email')
      .eq('email', newEmail)
      .maybeSingle();

    if (existing) {
      setEmailSaving(false);
      setEmailConflict(true);
      return;
    }

    await supabase.from('pending_saas_deployments').update({ email: newEmail }).eq('email', oldEmail);
    // Keep client_sites_saas in sync if a live site already exists
    await supabase.from('client_sites_saas').update({ email: newEmail }).eq('email', oldEmail);

    setEmailSaving(false);
    setEditingEmailRow(null);
    setEmailDraft('');
    fetchQueue();
  }

  // Inline alt email editing
  const [editingAltRow, setEditingAltRow] = useState<string | null>(null);
  const [altEmailDraft, setAltEmailDraft] = useState('');
  const [altEmailSaving, setAltEmailSaving] = useState(false);

  async function saveAltEmail(email: string) {
    const alt = altEmailDraft.trim().toLowerCase() || null;
    setAltEmailSaving(true);
    await supabase.from('pending_saas_deployments').update({ alt_email: alt }).eq('email', email);
    setAltEmailSaving(false);
    setEditingAltRow(null);
    setAltEmailDraft('');
    fetchQueue();
  }

  async function saveQueueLocationId(email: string) {
    const cleaned = locIdDraft.trim();
    if (!cleaned) return;
    setLocIdSaving(true);
    const { error } = await supabase
      .from('pending_saas_deployments')
      .update({ location_id: cleaned })
      .eq('email', email);
    setLocIdSaving(false);
    if (!error) {
      setEditingLocEmail(null);
      setLocIdDraft('');
      fetchQueue();
    }
  }

  // Cohorts
  const [cohortRows, setCohortRows]         = useState<CohortRow[]>([]);
  const [cohortLoading, setCohortLoading]   = useState(false);
  const [cohortError, setCohortError]       = useState('');
  const [cohortLinkCopied, setCohortLinkCopied] = useState<string | null>(null);

  async function fetchCohorts() {
    setCohortLoading(true);
    setCohortError('');
    const { data, error } = await supabase
      .from('pending_saas_deployments')
      .select('email, location_id, status, industry_category, discovery_data, created_at, cohort')
      .not('cohort', 'is', null)
      .order('created_at', { ascending: true });

    if (error) setCohortError(error.message);
    else setCohortRows((data ?? []) as CohortRow[]);
    setCohortLoading(false);
  }

  async function fetchQueue() {
    setQueueLoading(true);
    setQueueError('');
    const { data, error } = await supabase
      .from('pending_saas_deployments')
      .select('email, alt_email, location_id, status, industry_category, discovery_data, created_at, error_message')
      .order('created_at', { ascending: false });

    if (error) setQueueError(error.message);
    else setQueue((data ?? []) as QueueRow[]);
    setQueueLoading(false);
  }

  async function triggerProvisioner(row: QueueRow) {
    if (!row.location_id) return;
    setProvisioning(p => ({ ...p, [row.email]: 'running' }));
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ghl-saas-provisioner`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          contact: { email: row.email },
          location: { id: row.location_id },
        }),
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      setProvisioning(p => ({ ...p, [row.email]: 'done' }));
      setTimeout(() => fetchQueue(), 2000);
    } catch (err) {
      console.error('[provision]', err);
      setProvisioning(p => ({ ...p, [row.email]: 'error' }));
    }
  }

  // Enroll existing client panel
  const [showEnroll, setShowEnroll]         = useState(false);
  const [enrollLocationId, setEnrollLocationId] = useState('');
  const [enrollCopied, setEnrollCopied]     = useState(false);

  function handleEnrollCopy() {
    const id = enrollLocationId.trim();
    if (!id) return;
    navigator.clipboard.writeText(getEnrollLink(id));
    setEnrollCopied(true);
    setTimeout(() => setEnrollCopied(false), 2000);
  }

  function handleEnrollOpen() {
    const id = enrollLocationId.trim();
    if (!id) return;
    window.open(getEnrollLink(id), '_blank', 'noopener,noreferrer');
  }

  // Inline domain editing
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [domainDraft, setDomainDraft]         = useState('');
  const [domainSaving, setDomainSaving]       = useState(false);
  const [domainError, setDomainError]         = useState('');
  const domainInputRef = useRef<HTMLInputElement>(null);

  // Inline GHL location key editing
  const [editingGhlKeyId, setEditingGhlKeyId] = useState<string | null>(null);
  const [ghlKeyDraft, setGhlKeyDraft]         = useState('');
  const [ghlKeySaving, setGhlKeySaving]       = useState(false);

  async function saveGhlLocationKey(siteId: string) {
    const cleaned = ghlKeyDraft.trim();
    setGhlKeySaving(true);
    await supabase
      .from('client_sites_saas')
      .update({ ghl_location_key: cleaned || null })
      .eq('id', siteId);
    setSites(prev => prev.map(s =>
      s.id === siteId ? { ...s, ghl_location_key: cleaned || null } : s
    ));
    setGhlKeySaving(false);
    setEditingGhlKeyId(null);
    setGhlKeyDraft('');
  }

  // Agency platform settings
  type AgencySettings = { id: string; agency_name: string; agency_website_url: string; show_powered_by: boolean };
  const [agencySettings, setAgencySettings] = useState<AgencySettings | null>(null);
  const [agencyDraft, setAgencyDraft]       = useState<Partial<AgencySettings>>({});
  const [agencySaving, setAgencySaving]     = useState(false);
  const [agencySaved, setAgencySaved]       = useState(false);

  async function fetchAgencySettings() {
    const { data } = await supabase.from('agency_settings').select('*').maybeSingle();
    if (data) { setAgencySettings(data as AgencySettings); setAgencyDraft(data as AgencySettings); }
  }

  async function saveAgencySettings() {
    if (!agencySettings) return;
    setAgencySaving(true);
    await supabase.from('agency_settings').update(agencyDraft).eq('id', agencySettings.id);
    setAgencySettings(prev => prev ? { ...prev, ...agencyDraft } : prev);
    setAgencySaving(false);
    setAgencySaved(true);
    setTimeout(() => setAgencySaved(false), 2500);
  }

  async function fetchSites() {
    setLoading(true);
    setFetchError('');
    const { data, error } = await supabase
      .from('client_sites_saas')
      .select('id, email, business_name, location_id, slug, custom_domain, ghl_location_key, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError(error.message);
    } else {
      setSites((data ?? []) as SiteRow[]);
    }
    setLoading(false);
  }

  // Restore existing Supabase session and listen for magic link sign-in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email?.toLowerCase() ?? null;
      if (email && (AGENCY_ADMINS.length === 0 || AGENCY_ADMINS.includes(email))) {
        setVerifiedEmail(email);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email?.toLowerCase() ?? null;
      if (email && (AGENCY_ADMINS.length === 0 || AGENCY_ADMINS.includes(email))) {
        setVerifiedEmail(email);
      } else {
        if (email) supabase.auth.signOut();
        setVerifiedEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (verifiedEmail) { fetchSites(); fetchQueue(); fetchCohorts(); fetchAgencySettings(); }
  }, [verifiedEmail]);

  useEffect(() => {
    if (editingDomainId) domainInputRef.current?.focus();
  }, [editingDomainId]);

  function startEditingDomain(site: SiteRow) {
    setEditingDomainId(site.id);
    setDomainDraft(site.custom_domain ?? '');
    setDomainError('');
  }

  function cancelEditingDomain() {
    setEditingDomainId(null);
    setDomainDraft('');
    setDomainError('');
  }

  async function saveDomain(siteId: string) {
    setDomainSaving(true);
    setDomainError('');
    const cleaned = cleanDomain(domainDraft);

    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-client-domain`;
      const res   = await fetch(fnUrl, {
        method:  'POST',
        headers: {
          'Content-Type':   'application/json',
          'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET ?? '',
        },
        body: JSON.stringify({ siteId, domain: cleaned }),
      });

      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setDomainError(data.error ?? 'Save failed');
      } else {
        setSites(prev => prev.map(s =>
          s.id === siteId ? { ...s, custom_domain: cleaned || null } : s
        ));
        setEditingDomainId(null);
      }
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'Network error');
    }

    setDomainSaving(false);
  }

  if (authLoading) return null;

  if (!verifiedEmail) {
    return <AuthGate />;
  }

  const liveCt    = sites.filter(s => s.status === 'active').length;
  const pendingCt = sites.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-3 md:py-4 gap-2 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm md:text-base font-semibold text-gray-900 truncate">Agency Command Center</h1>
                <p className="text-xs text-gray-500 truncate">{verifiedEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {(activeTab === 'sites' || activeTab === 'queue') && (
                <button
                  onClick={activeTab === 'sites' ? fetchSites : fetchQueue}
                  disabled={activeTab === 'sites' ? loading : queueLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${(loading || queueLoading) ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          </div>
          {/* Tab nav — scrollable on mobile */}
          <div className="flex gap-0.5 -mb-px overflow-x-auto scrollbar-none">
            {([
              { id: 'sites',    label: 'Client Sites',       icon: Server   },
              { id: 'queue',    label: 'Provisioning Queue', icon: Clock    },
              { id: 'cohorts',  label: 'Cohorts',            icon: Users    },
              { id: 'runbook',  label: 'Domain Runbook',     icon: BookOpen },
              { id: 'platform', label: 'Platform',           icon: Settings },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Provisioning Queue tab ──────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {showCompleted ? 'All Deployments' : 'Pending &amp; Failed Deployments'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {showCompleted ? 'Full deployment history' : 'Rows that never completed provisioning — trigger manually if stuck'}
                </p>
              </div>
              <button
                onClick={() => setShowCompleted(v => !v)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  showCompleted
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                {showCompleted ? 'Hide completed' : 'Show completed'}
              </button>
            </div>

            {(() => {
              const filteredQueue = showCompleted ? queue : queue.filter(r => r.status !== 'completed');
              return queueError ? (
              <div className="p-6 text-sm text-red-600">{queueError}</div>
            ) : queueLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredQueue.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-400">
                {showCompleted ? 'No deployments found.' : 'No pending deployments — all clients are provisioned.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Location ID</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Industry</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Created</th>
                      <th className="px-4 md:px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredQueue.map(row => {
                      const state = provisioning[row.email];
                      const canProvision = !!row.location_id && row.status !== 'processing';
                      return (
                        <tr key={row.email} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 md:px-6 py-4 font-medium text-gray-900 text-sm">
                            {row.discovery_data?.businessName ?? <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                            {/* Primary email */}
                            {editingEmailRow === row.email ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <input
                                    autoFocus
                                    type="email"
                                    value={emailDraft}
                                    onChange={e => { setEmailDraft(e.target.value); setEmailConflict(false); }}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') saveQueueEmail(row.email);
                                      if (e.key === 'Escape') { setEditingEmailRow(null); setEmailDraft(''); setEmailConflict(false); }
                                    }}
                                    placeholder="new@email.com"
                                    className="w-44 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                  />
                                  <button onClick={() => saveQueueEmail(row.email)} disabled={emailSaving || !emailDraft.trim()} className="px-2 py-1 text-xs bg-gray-900 text-white rounded-md disabled:opacity-40 hover:bg-gray-700">{emailSaving ? '…' : 'Save'}</button>
                                  <button onClick={() => { setEditingEmailRow(null); setEmailDraft(''); setEmailConflict(false); }} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800">✕</button>
                                </div>
                                {emailConflict && <p className="text-xs text-red-500">That email already has a record.</p>}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 group">
                                <span className="text-xs text-gray-600">{row.email}</span>
                                <button onClick={() => { setEditingEmailRow(row.email); setEmailDraft(row.email); }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                                </button>
                              </div>
                            )}

                            {/* Alt email */}
                            {editingAltRow === row.email ? (
                              <div className="flex items-center gap-1 mt-1">
                                <input
                                  autoFocus
                                  type="email"
                                  value={altEmailDraft}
                                  onChange={e => setAltEmailDraft(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') saveAltEmail(row.email);
                                    if (e.key === 'Escape') { setEditingAltRow(null); setAltEmailDraft(''); }
                                  }}
                                  placeholder="alt@email.com"
                                  className="w-40 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                <button onClick={() => saveAltEmail(row.email)} disabled={altEmailSaving} className="px-2 py-1 text-xs bg-gray-900 text-white rounded-md disabled:opacity-40 hover:bg-gray-700">{altEmailSaving ? '…' : 'Save'}</button>
                                <button onClick={() => { setEditingAltRow(null); setAltEmailDraft(''); }} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800">✕</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 mt-0.5 group">
                                {row.alt_email ? (
                                  <>
                                    <span className="text-xs text-gray-400 italic">{row.alt_email}</span>
                                    <button onClick={() => { setEditingAltRow(row.email); setAltEmailDraft(row.alt_email ?? ''); }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                                    </button>
                                  </>
                                ) : (
                                  <button onClick={() => { setEditingAltRow(row.email); setAltEmailDraft(''); }} className="text-xs text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                    + alt email
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                            {editingLocEmail === row.email ? (
                              <div className="flex items-center gap-1">
                                <input
                                  autoFocus
                                  value={locIdDraft}
                                  onChange={e => setLocIdDraft(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') saveQueueLocationId(row.email);
                                    if (e.key === 'Escape') { setEditingLocEmail(null); setLocIdDraft(''); }
                                  }}
                                  placeholder="Paste location ID…"
                                  className="w-44 px-2 py-1 text-xs border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                <button
                                  onClick={() => saveQueueLocationId(row.email)}
                                  disabled={locIdSaving || !locIdDraft.trim()}
                                  className="px-2 py-1 text-xs bg-gray-900 text-white rounded-md disabled:opacity-40 hover:bg-gray-700"
                                >
                                  {locIdSaving ? '…' : 'Save'}
                                </button>
                                <button
                                  onClick={() => { setEditingLocEmail(null); setLocIdDraft(''); }}
                                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : row.location_id ? (
                              <span className="font-mono text-xs text-gray-600">{row.location_id}</span>
                            ) : (
                              <button
                                onClick={() => { setEditingLocEmail(row.email); setLocIdDraft(''); }}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <Pencil className="w-3 h-3" /> Add ID
                              </button>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-xs text-gray-500 hidden md:table-cell">{row.industry_category}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              row.status === 'pending'    ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              row.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              row.status === 'failed'     ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              {row.status}
                            </span>
                            {row.error_message && (
                              <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={row.error_message}>
                                {row.error_message}
                              </p>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-xs text-gray-500 whitespace-nowrap hidden md:table-cell">
                            {new Date(row.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <button
                              onClick={() => triggerProvisioner(row)}
                              disabled={!canProvision || state === 'running'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 transition-colors whitespace-nowrap"
                            >
                              {state === 'running' ? (
                                <><RefreshCw className="w-3 h-3 animate-spin" /> Running…</>
                              ) : state === 'done' ? (
                                <><Check className="w-3 h-3 text-green-400" /> Triggered</>
                              ) : state === 'error' ? (
                                <><AlertCircle className="w-3 h-3 text-red-400" /> Failed</>
                              ) : (
                                <><Zap className="w-3 h-3" /> Provision Now</>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
            })()}
          </div>
        </div>
      )}

      {/* ── Cohorts tab ──────────────────────────────────────────────────── */}
      {activeTab === 'cohorts' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">

          {cohortError && (
            <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{cohortError}</div>
          )}

          {cohortLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : Object.entries(COHORT_REGISTRY).map(([key, cfg]) => {
            const members = cohortRows.filter(r => r.cohort === key);
            const active  = members.filter(r => r.status === 'completed').length;
            const pending = members.filter(r => r.status === 'pending' || r.status === 'processing').length;
            const failed  = members.filter(r => r.status === 'failed').length;
            const pct     = Math.round((members.length / cfg.seatLimit) * 100);
            const vipUrl  = `${window.location.origin}/vip?cohort=${key}`;

            return (
              <div key={key}>
                {/* Cohort header card */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">{cfg.displayName}</h2>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{key}</p>
                      </div>
                    </div>

                    {/* Seat meter */}
                    <div className="flex-1 min-w-48 max-w-xs">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">Seats claimed</span>
                        <span className="text-white font-medium">{members.length} / {cfg.seatLimit}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-emerald-400">{active} live</span>
                        <span className="text-amber-400">{pending} pending</span>
                        {failed > 0 && <span className="text-red-400">{failed} failed</span>}
                        <span className="text-gray-500 ml-auto">{cfg.seatLimit - members.length} remaining</span>
                      </div>
                    </div>

                    {/* Copy VIP link */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(vipUrl);
                        setCohortLinkCopied(key);
                        setTimeout(() => setCohortLinkCopied(null), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium hover:bg-amber-400/20 transition-colors whitespace-nowrap"
                    >
                      {cohortLinkCopied === key
                        ? <><Check className="w-3.5 h-3.5" /> Copied!</>
                        : <><Copy className="w-3.5 h-3.5" /> Copy VIP Link</>}
                    </button>
                  </div>
                </div>

                {/* Member table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {members.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No members have claimed a seat yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">#</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Industry</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Location ID</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Claimed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {members.map((row, i) => (
                            <tr key={row.email} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{i + 1}</td>
                              <td className="px-5 py-3.5 font-medium text-gray-900 text-sm">
                                {row.discovery_data?.businessName ?? <span className="text-gray-400 font-normal">—</span>}
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-500 hidden sm:table-cell">{row.email}</td>
                              <td className="px-5 py-3.5 text-xs text-gray-500 hidden md:table-cell capitalize">
                                {row.industry_category?.replace(/_/g, ' ')}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  row.status === 'completed'  ? 'bg-green-100 text-green-800 border-green-200' :
                                  row.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  row.status === 'failed'     ? 'bg-red-100 text-red-800 border-red-200' :
                                  'bg-yellow-100 text-yellow-800 border-yellow-200'
                                }`}>
                                  {row.status === 'completed' ? 'Live' : row.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 font-mono text-xs text-gray-500 hidden md:table-cell">
                                {row.location_id
                                  ? <span title={row.location_id}>{row.location_id.slice(0, 12)}…</span>
                                  : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap hidden md:table-cell">
                                {new Date(row.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Runbook tab ──────────────────────────────────────────────────── */}
      {activeTab === 'runbook' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* One-time setup */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-semibold text-gray-900">One-Time Platform Setup</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Do this first</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {[
                {
                  step: '1',
                  title: 'Deploy myt-client-platform to Netlify',
                  detail: 'Push the main branch to GitHub — Netlify auto-deploys. Confirm the build passes in the Netlify deploy log (look for "Site is live"). The netlify/edge-functions/custom-domain.ts file is a simple pass-through and requires no configuration.',
                },
                {
                  step: '2',
                  title: 'Set Supabase environment variables in Netlify',
                  detail: 'Netlify dashboard → myt-client-platform → Site configuration → Environment variables. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present. The React SPA reads these to query Supabase for hostname-based routing.',
                },
                {
                  step: '3',
                  title: 'Configure Supabase Auth URL settings',
                  detail: 'Supabase dashboard → Authentication → URL Configuration.\n  • Site URL: https://myt-client-platform.netlify.app\n  • Redirect URLs (minimum required):\n    – https://*.netlify.app/**\n    – https://myt-client-platform.netlify.app/admin/callback\n    – http://localhost:5173/**\n  All magic links route through the platform callback — no per-client entries needed.',
                },
                {
                  step: '4',
                  title: 'Deploy myt-saas-launchpad to Netlify',
                  detail: 'Push the Agency Command Center changes so the Sites tab, Domain Runbook, and domain editing tools are live for your team.',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-4 px-5 py-4">
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed whitespace-pre-line">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Per-client flow */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-semibold text-gray-900">Per-Client Domain Connection</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Repeatable</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {[
                {
                  step: '1',
                  who: 'Client',
                  title: 'Client adds DNS record at their registrar',
                  detail: 'For www subdomain (recommended):\n  Type: CNAME  |  Name: www  |  Value: myt-client-platform.netlify.app\n\nFor apex/bare domain (e.g. joesplumbing.com):\n  Type: A  |  Name: @  |  Value: 75.2.60.5\n\nTTL: Auto or 3600. Most registrars: GoDaddy, Namecheap, Cloudflare, Hover.',
                },
                {
                  step: '2',
                  who: 'Agency',
                  title: 'Set the domain in Agency Command Center',
                  detail: 'On the Sites tab, click the pencil icon in the Custom Domain column for the client\'s row. Enter the exact hostname — e.g. www.joesplumbing.com. Save. This is what the React SPA matches against to identify the site.',
                },
                {
                  step: '3',
                  who: 'Agency',
                  title: 'Add the domain alias in Netlify',
                  detail: 'Netlify dashboard → myt-client-platform → Domain management → Add domain alias. Enter the same hostname. Netlify verifies DNS and provisions an SSL/TLS certificate automatically via Let\'s Encrypt.',
                },
                {
                  step: '4',
                  who: 'Wait',
                  title: 'DNS propagation (up to 48 h, usually < 1 h)',
                  detail: 'Use dnschecker.org to verify the record is resolving globally. The Netlify SSL cert will show "Your project has HTTPS enabled ✓" once DNS is verified.',
                },
                {
                  step: '5',
                  who: 'Verify',
                  title: 'Test the site and admin login',
                  detail: 'Visit https://www.joesplumbing.com — the client\'s site should load. The browser URL stays clean on their domain with no /site/ path.\n\nTest admin: go to https://www.joesplumbing.com/admin/login, enter the site\'s registered email, click the magic link — the client should land at /admin on their domain.',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-4 px-5 py-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        item.who === 'Client' ? 'bg-purple-100 text-purple-700'
                        : item.who === 'Agency' ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-50 text-gray-400'
                      }`}>{item.who}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DNS record reference */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-4">DNS Record Reference</h2>
            <div className="bg-gray-900 rounded-xl p-5 font-mono text-xs space-y-4 text-gray-100">
              <div>
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">www subdomain (preferred)</p>
                <div className="space-y-2">
                  <div className="flex gap-4"><span className="text-gray-500 w-24">Type</span><span>CNAME</span></div>
                  <div className="flex gap-4"><span className="text-gray-500 w-24">Name / Host</span><span>www</span></div>
                  <div className="flex gap-4"><span className="text-gray-500 w-24">Points to</span><span className="text-emerald-400">myt-client-platform.netlify.app</span></div>
                  <div className="flex gap-4"><span className="text-gray-500 w-24">TTL</span><span>3600 (or Auto)</span></div>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Apex / bare domain</p>
                <div className="space-y-2">
                  <div className="flex gap-4"><span className="text-gray-500 w-24">Type</span><span>A</span></div>
                  <div className="flex gap-4"><span className="text-gray-500 w-24">Name / Host</span><span>@ (or blank)</span></div>
                  <div className="flex gap-4"><span className="text-gray-500 w-24">Points to</span><span className="text-emerald-400">75.2.60.5</span></div>
                  <div className="flex gap-4"><span className="text-gray-500 w-24">TTL</span><span>3600 (or Auto)</span></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Most clients use www. For apex domains, use the A record above (Netlify's load balancer IP). Add both if the client wants joesplumbing.com and www.joesplumbing.com — register each as a separate Netlify domain alias.
            </p>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-4">How the Routing Works</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">User visits <span className="font-mono text-gray-900">www.joesplumbing.com</span></p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">DNS resolves to Netlify via CNAME / A record → Netlify serves the <span className="font-mono text-gray-900">myt-client-platform</span> SPA</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">React app reads <span className="font-mono text-gray-900">window.location.hostname</span>, recognises it is not a platform host</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Queries Supabase: <span className="font-mono text-gray-900">custom_domain = 'www.joesplumbing.com'</span> → returns the site slug</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Site renders at <span className="font-mono text-gray-900">www.joesplumbing.com/</span> — no internal <span className="font-mono text-gray-900">/site/:slug</span> path is ever exposed in the browser</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600"><span className="font-mono text-gray-900">/admin/login</span> on the custom domain sends a magic link. Auth tokens relay through <span className="font-mono text-gray-900">myt-client-platform.netlify.app/admin/callback</span> and are forwarded back — no per-client Supabase redirect URL entries required.</p>
              </div>
            </div>
          </section>

        </div>
        </div>
      )}

      {/* ── Platform tab ─────────────────────────────────────────────────── */}
      {activeTab === 'platform' && (
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">Platform Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Controls global branding and attribution across all client sites.</p>
          </div>

          {!agencySettings ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {/* Agency name */}
              <div className="px-6 py-5">
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Agency Name</label>
                <p className="text-xs text-gray-500 mb-3">Appears in the "Powered by" line on all client sites.</p>
                <input
                  type="text"
                  value={agencyDraft.agency_name ?? ''}
                  onChange={e => setAgencyDraft(p => ({ ...p, agency_name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="mytCreative"
                />
              </div>

              {/* Agency website URL */}
              <div className="px-6 py-5">
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Agency Website URL</label>
                <p className="text-xs text-gray-500 mb-3">The "Powered by" line links to this URL.</p>
                <input
                  type="url"
                  value={agencyDraft.agency_website_url ?? ''}
                  onChange={e => setAgencyDraft(p => ({ ...p, agency_website_url: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                  placeholder="https://mytcreative.com"
                />
              </div>

              {/* Show / hide powered by */}
              <div className="px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Show "Powered by" line</p>
                  <p className="text-xs text-gray-500 mt-0.5">Displays attribution in the footer of every client site.</p>
                </div>
                <button
                  onClick={() => setAgencyDraft(p => ({ ...p, show_powered_by: !p.show_powered_by }))}
                  className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${agencyDraft.show_powered_by ? 'bg-gray-900' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${agencyDraft.show_powered_by ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Save */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
                <button
                  onClick={saveAgencySettings}
                  disabled={agencySaving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {agencySaved ? <><Check className="w-4 h-4 text-green-400" /> Saved</> : agencySaving ? '…' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Sites tab ────────────────────────────────────────────────────── */}
      {activeTab === 'sites' && (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 md:mb-8">
          {[
            { label: 'Total Sites', value: sites.length },
            { label: 'Live',        value: liveCt       },
            { label: 'Pending',     value: pendingCt    },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-900 truncate">Client Sites</h2>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400 hidden sm:inline">{sites.length} records</span>
              <button
                onClick={() => setShowEnroll(o => !o)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enroll Client</span>
                <span className="sm:hidden">Enroll</span>
              </button>
            </div>
          </div>

          {/* Enroll existing client panel */}
          {showEnroll && (
            <div className="px-4 md:px-6 py-4 bg-blue-50 border-b border-blue-100">
              <p className="text-xs font-medium text-blue-800 mb-3">Enroll an existing GHL sub-account — generates a pre-filled enrollment link</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={enrollLocationId}
                  onChange={e => setEnrollLocationId(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEnrollCopy(); if (e.key === 'Escape') setShowEnroll(false); }}
                  placeholder="GHL Location ID"
                  className="flex-1 px-3 py-1.5 text-sm font-mono border border-blue-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEnrollCopy}
                    disabled={!enrollLocationId.trim()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-blue-200 bg-white text-blue-700 hover:bg-blue-100 disabled:opacity-40 transition-colors"
                  >
                    {enrollCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {enrollCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={handleEnrollOpen}
                    disabled={!enrollLocationId.trim()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Form
                  </button>
                  <button
                    onClick={() => { setShowEnroll(false); setEnrollLocationId(''); }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {enrollLocationId.trim() && (
                <p className="mt-2 text-xs text-blue-600 font-mono truncate">
                  {getEnrollLink(enrollLocationId.trim())}
                </p>
              )}
            </div>
          )}

          {fetchError ? (
            <div className="p-6 text-sm text-red-600">{fetchError}</div>
          ) : loading ? (
            <div className="flex items-center justify-center p-16">
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sites.length === 0 ? (
            <div className="p-16 text-center text-sm text-gray-400">No sites found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Site URL</th>
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Custom Domain</th>
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">GHL Key</th>
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 md:px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sites.map(site => {
                    const siteUrl = site.custom_domain
                      ? `https://${site.custom_domain}`
                      : `${CLIENT_PLATFORM_URL}/site/${site.slug}`;
                    const isEditingDomain = editingDomainId === site.id;

                    return (
                      <tr key={site.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Business + Email stacked */}
                        <td className="px-4 md:px-6 py-4">
                          <p className="font-medium text-gray-900 text-sm leading-snug">{site.business_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{site.email}</p>
                        </td>

                        {/* Site URL */}
                        <td className="px-4 md:px-6 py-4">
                          <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-xs"
                          >
                            {site.slug}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </td>

                        {/* Custom Domain — inline editable */}
                        <td className="px-4 md:px-6 py-4 hidden md:table-cell min-w-[180px]">
                          {isEditingDomain ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <input
                                  ref={domainInputRef}
                                  value={domainDraft}
                                  onChange={e => setDomainDraft(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') saveDomain(site.id);
                                    if (e.key === 'Escape') cancelEditingDomain();
                                  }}
                                  placeholder="www.example.com"
                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                                />
                                <button
                                  onClick={() => saveDomain(site.id)}
                                  disabled={domainSaving}
                                  className="px-2 py-1 bg-gray-900 text-white text-xs rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                >
                                  {domainSaving ? '…' : 'Save'}
                                </button>
                                <button
                                  onClick={cancelEditingDomain}
                                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {domainError && <p className="text-xs text-red-500">{domainError}</p>}
                              <p className="text-xs text-gray-400">Enter without https:// — leave blank to clear</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              {site.custom_domain ? (
                                <a
                                  href={`https://${site.custom_domain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 hover:underline"
                                >
                                  <Globe className="w-3 h-3" />
                                  {site.custom_domain}
                                </a>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                              <button
                                onClick={() => startEditingDomain(site)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-gray-700 transition-all"
                                title="Edit domain"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* GHL Location Key — inline editable */}
                        <td className="px-4 md:px-6 py-4 hidden md:table-cell min-w-[160px]">
                          {editingGhlKeyId === site.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                value={ghlKeyDraft}
                                onChange={e => setGhlKeyDraft(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') saveGhlLocationKey(site.id);
                                  if (e.key === 'Escape') { setEditingGhlKeyId(null); setGhlKeyDraft(''); }
                                }}
                                placeholder="pit-xxxxx…"
                                className="w-36 px-2 py-1 text-xs border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-gray-900"
                              />
                              <button
                                onClick={() => saveGhlLocationKey(site.id)}
                                disabled={ghlKeySaving}
                                className="px-2 py-1 text-xs bg-gray-900 text-white rounded-md disabled:opacity-40 hover:bg-gray-700"
                              >
                                {ghlKeySaving ? '…' : 'Save'}
                              </button>
                              <button
                                onClick={() => { setEditingGhlKeyId(null); setGhlKeyDraft(''); }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group">
                              {site.ghl_location_key ? (
                                <span className="font-mono text-xs text-emerald-700" title={site.ghl_location_key}>
                                  {site.ghl_location_key.slice(0, 14)}…
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                              <button
                                onClick={() => { setEditingGhlKeyId(site.id); setGhlKeyDraft(site.ghl_location_key ?? ''); }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-gray-700 transition-all"
                                title="Set GHL location key"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Status + Created stacked */}
                        <td className="px-4 md:px-6 py-4">
                          <StatusBadge status={site.status} />
                          <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                            {new Date(site.created_at).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="px-4 md:px-6 py-4">
                          <ActionsCell row={site} onEditDomain={() => startEditingDomain(site)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
