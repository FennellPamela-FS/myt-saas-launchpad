import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// ─── Cohort config ────────────────────────────────────────────────────────────

const COHORT_CONFIG: Record<string, { displayName: string; seatLimit: number }> = {
  inspire_dmv:     { displayName: 'Inspire DMV',     seatLimit: 13 },  // 10 prepaid + 3 rollover seats
  better_business: { displayName: 'Better Business', seatLimit: 30 },
};

// ─── Industry options ─────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: 'home_services',    label: 'Home Services' },
  { value: 'beauty',           label: 'Beauty & Wellness' },
  { value: 'fitness',          label: 'Fitness & Health' },
  { value: 'coaching',         label: 'Coaching & Consulting' },
  { value: 'food_and_beverage',label: 'Food & Beverage' },
  { value: 'real_estate',      label: 'Real Estate' },
  { value: 'financial',        label: 'Financial Services' },
  { value: 'marketing',        label: 'Marketing & Creative' },
  { value: 'legal',            label: 'Legal Services' },
  { value: 'automotive',       label: 'Automotive' },
  { value: 'education',        label: 'Education & Training' },
  { value: 'other',            label: 'Other' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  firstName:        string;
  lastName:         string;
  email:            string;
  phone:            string;
  companyName:      string;
  industryCategory: string;
};

type PageStatus =
  | 'loading'        // checking seat count
  | 'ready'          // form visible
  | 'full'           // cohort at capacity
  | 'invalid_cohort' // ?cohort param not recognised
  | 'submitting'     // waiting on edge function
  | 'success'        // all done
  | 'error';         // unexpected failure

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition-shadow';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const VipOnboardingPage: React.FC = () => {
  const [searchParams]   = useSearchParams();
  const cohortKey        = searchParams.get('cohort') ?? '';
  const cohortConfig     = COHORT_CONFIG[cohortKey];

  const [status, setStatus]   = useState<PageStatus>(cohortConfig ? 'loading' : 'invalid_cohort');
  const [seatsUsed, setSeatsUsed] = useState(0);
  const [errorMsg, setErrorMsg]   = useState('');
  const [form, setForm] = useState<FormState>({
    firstName: '', lastName: '', email: '',
    phone: '', companyName: '', industryCategory: '',
  });

  // ── Check seat availability ──────────────────────────────────────────────────
  useEffect(() => {
    if (!cohortConfig) return;

    supabase
      .from('pending_saas_deployments')
      .select('*', { count: 'exact', head: true })
      .eq('cohort', cohortKey)
      .neq('status', 'failed')
      .then(({ count, error }) => {
        if (error) {
          console.error('[VIP] seat count error', error);
          setStatus('error');
          setErrorMsg('Unable to verify seat availability. Please try again shortly.');
          return;
        }
        const used = count ?? 0;
        setSeatsUsed(used);
        setStatus(used >= cohortConfig.seatLimit ? 'full' : 'ready');
      });
  }, [cohortKey]);  // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: keyof FormState, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setErrorMsg('Please enter your full name.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg('Please enter a valid email address.'); return;
    }
    if (!form.phone.trim()) {
      setErrorMsg('Please enter a phone number.'); return;
    }
    if (!form.companyName.trim()) {
      setErrorMsg('Please enter your business name.'); return;
    }
    if (!form.industryCategory) {
      setErrorMsg('Please select your industry.'); return;
    }

    setStatus('submitting');

    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/provision-client-workspace`;

      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ ...form, cohort: cohortKey }),
      });

      const data = await res.json() as Record<string, unknown>;

      if (!res.ok) {
        if (data?.error === 'COHORT_FULL') {
          setStatus('full');
          return;
        }
        throw new Error((data?.error as string) ?? `Server error ${res.status}`);
      }

      setStatus('success');
    } catch (err) {
      console.error('[VIP] provision error', err);
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('ready');
    }
  };

  // ── Render states ────────────────────────────────────────────────────────────

  if (status === 'invalid_cohort') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-amber-500" size={40} />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Access Link</h1>
          <p className="text-gray-500 text-sm">This VIP link is not recognised. Please check your invitation email.</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg max-w-md w-full text-center py-14 px-8">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Workspace Provisioning Started</h2>
          <p className="text-gray-500 leading-relaxed">
            Welcome aboard, <span className="font-medium text-gray-800">{form.firstName}</span>.
            Your workspace is being built now. You'll receive an email at{' '}
            <span className="font-medium text-gray-800">{form.email}</span> with your site link
            and login instructions — usually within a few minutes.
          </p>
          <p className="text-xs text-gray-400 mt-6">
            {cohortConfig?.displayName} · Seat {seatsUsed + 1} of {cohortConfig?.seatLimit}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'full') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg max-w-md w-full text-center py-14 px-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Allocation Reached</h2>
          <p className="text-gray-500 leading-relaxed">
            The prepaid allocation for the{' '}
            <span className="font-medium text-gray-800">{cohortConfig?.displayName}</span> cohort
            has reached its capacity. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  // ── Main form (status: 'ready' | 'submitting' | 'error') ─────────────────────
  const isSubmitting = status === 'submitting';
  const seatsRemaining = (cohortConfig?.seatLimit ?? 0) - seatsUsed;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50/30 px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header card */}
        <div className="bg-gray-900 rounded-2xl px-8 py-10 mb-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-5">
            <Shield size={28} className="text-amber-400" />
          </div>
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 mb-3">
            {cohortConfig?.displayName} · VIP Access
          </p>
          <h1 className="text-2xl font-bold text-white leading-snug">
            Welcome, {cohortConfig?.displayName} VIP.
          </h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Your premium platform access has been approved.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-medium">
              {seatsRemaining} of {cohortConfig?.seatLimit} seats remaining
            </span>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Claim your workspace</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="Jane"
                  className={inputCls}
                  disabled={isSubmitting}
                />
              </Field>
              <Field label="Last name">
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Smith"
                  className={inputCls}
                  disabled={isSubmitting}
                />
              </Field>
            </div>

            <Field label="Email address">
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="jane@yourbusiness.com"
                className={inputCls}
                disabled={isSubmitting}
              />
            </Field>

            <Field label="Phone number">
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={inputCls}
                disabled={isSubmitting}
              />
            </Field>

            <Field label="Business name">
              <input
                type="text"
                value={form.companyName}
                onChange={e => set('companyName', e.target.value)}
                placeholder="Smith Creative Co."
                className={inputCls}
                disabled={isSubmitting}
              />
            </Field>

            <Field label="Industry">
              <select
                value={form.industryCategory}
                onChange={e => set('industryCategory', e.target.value)}
                className={inputCls}
                disabled={isSubmitting}
              >
                <option value="">Select your industry…</option>
                {INDUSTRIES.map(i => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </Field>

            {errorMsg && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Provisioning Workspace…
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Claim My Account &amp; Provision Workspace
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5">
            By claiming your account you agree to the mytCreative{' '}
            <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipOnboardingPage;
