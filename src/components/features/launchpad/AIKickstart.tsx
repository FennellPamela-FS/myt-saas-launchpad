import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  useLaunchpadStore,
  ThemeSelection,
  IndustryCategory,
} from '../../../store/launchpadStore';

export const INDUSTRY_OPTIONS: { value: IndustryCategory; label: string }[] = [
  { value: 'home_services',  label: 'Home Services' },
  { value: 'medical',        label: 'Medical / Healthcare' },
  { value: 'legal',          label: 'Legal' },
  { value: 'beauty',         label: 'Beauty & Wellness' },
  { value: 'automotive',     label: 'Automotive' },
  { value: 'marketing',      label: 'Marketing Agency' },
  { value: 'real_estate',    label: 'Real Estate' },
  { value: 'restaurant',     label: 'Restaurant / Food & Beverage' },
  { value: 'fitness',        label: 'Fitness & Gym' },
  { value: 'financial',      label: 'Financial Services' },
  { value: 'education',      label: 'Education' },
  { value: 'ecommerce',      label: 'E-Commerce' },
  { value: 'coaching',       label: 'Coaching & Consulting' },
  { value: 'dental',         label: 'Dental' },
  { value: 'chiropractic',   label: 'Chiropractic' },
  { value: 'other',          label: 'Other' },
];

const THEME_OPTIONS: { value: ThemeSelection; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Clean, corporate, trust-first' },
  { value: 'creative',     label: 'Creative',     description: 'Bold, expressive, design-forward' },
  { value: 'wellness',     label: 'Wellness',     description: 'Calm, nurturing, community-centered' },
  { value: 'luxury',       label: 'Luxury',       description: 'Premium, refined, high-end feel' },
  { value: 'minimalist',   label: 'Minimalist',   description: 'Simple, focused, content-first' },
];

const DISCOVERY_QUESTIONS = [
  {
    key: 'businessName' as const,
    label: 'Business Name',
    placeholder: 'e.g., Apex Consulting Group',
    type: 'input',
    hint: 'The name your customers know you by.',
    required: true,
  },
  {
    key: 'vision' as const,
    label: 'Your Vision',
    placeholder: 'Where is your business headed in the next 3–5 years?',
    type: 'textarea',
    hint: 'Paint the picture of success. Think big.',
    required: false,
  },
  {
    key: 'hookAndProblem' as const,
    label: 'Your Hook & Problem You Solve',
    placeholder: 'What pain point do you eliminate? What makes someone stop scrolling?',
    type: 'textarea',
    hint: 'Be direct. Speak to the frustration your ideal client feels.',
    required: true,
  },
  {
    key: 'services' as const,
    label: 'Services or Products',
    placeholder: 'List your core offerings — what do you actually deliver?',
    type: 'textarea',
    hint: 'One offer per line works great.',
    required: true,
  },
  {
    key: 'uniqueValue' as const,
    label: 'Your Unique Value',
    placeholder: 'Why choose you over every other option out there?',
    type: 'textarea',
    hint: 'Your differentiator — experience, method, results, or story.',
    required: false,
  },
  {
    key: 'theAsk' as const,
    label: 'The Ask (Call to Action)',
    placeholder: 'What do you want a visitor to do the moment they land on your site?',
    type: 'textarea',
    hint: 'e.g., Book a free call, buy now, download the guide.',
    required: false,
  },
];

const AIKickstart: React.FC = () => {
  const {
    discoveryData,
    themeSelection,
    userEmail,
    setDiscoveryData,
    setThemeSelection,
    setUserEmail,
  } = useLaunchpadStore();

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleDiscoveryChange = (
    key: keyof typeof discoveryData,
    value: string
  ) => {
    setDiscoveryData({ [key]: value });
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleEmailChange = (value: string) => {
    setUserEmail(value);
    setTouched((prev) => ({ ...prev, email: true }));
  };

  const isInvalid = (key: string, required: boolean, value: string) =>
    touched[key] && required && !value.trim();

  const emailInvalid =
    touched.email && (!userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail));

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4EBCED]/15">
          <Sparkles size={20} className="text-[#4EBCED]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-tight">AI Kickstart</h2>
          <p className="text-sm text-muted-foreground">Power your launchpad with your story</p>
        </div>
      </div>

      <p className="mb-6 text-[#464E54] text-sm">
        Answer these questions and we'll use your words to generate your site copy, structure,
        and messaging. Fields marked <span className="text-red-500">*</span> are required.
      </p>

      <div className="space-y-5">

        {/* ── Industry Category (first) ── */}
        <div className="space-y-1.5">
          <Label htmlFor="industry-select">
            Industry Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={discoveryData.industryCategory}
            onValueChange={(val) => {
              setDiscoveryData({ industryCategory: val as IndustryCategory });
              setTouched((prev) => ({ ...prev, industryCategory: true }));
            }}
          >
            <SelectTrigger
              id="industry-select"
              aria-label="Industry Category"
              className={
                touched.industryCategory && !discoveryData.industryCategory
                  ? 'border-red-400 focus:ring-red-400'
                  : ''
              }
            >
              <SelectValue placeholder="Select your industry…" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.industryCategory && !discoveryData.industryCategory && (
            <p className="text-xs text-red-500">Please select an industry.</p>
          )}
        </div>

        {/* ── Other industry (conditional) ── */}
        {discoveryData.industryCategory === 'other' && (
          <div className="space-y-1.5">
            <Label htmlFor="industryOther">
              Describe Your Industry <span className="text-red-500">*</span>
            </Label>
            <Input
              id="industryOther"
              value={discoveryData.industryOther}
              onChange={(e) => handleDiscoveryChange('industryOther', e.target.value)}
              placeholder="e.g., Software Company, Venture Studio, Recording Label…"
              className={
                touched.industryOther && !discoveryData.industryOther.trim()
                  ? 'border-red-400 focus-visible:ring-red-400'
                  : ''
              }
            />
            {touched.industryOther && !discoveryData.industryOther.trim() && (
              <p className="text-xs text-red-500">Please describe your industry.</p>
            )}
          </div>
        )}

        {/* ── Email ── */}
        <div className="space-y-1.5">
          <Label htmlFor="userEmail">
            Your Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="userEmail"
            type="email"
            value={userEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="you@yourbusiness.com"
            className={emailInvalid ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          <p className="text-xs text-muted-foreground">
            Used to save your progress and send your launch details.
          </p>
          {emailInvalid && (
            <p className="text-xs text-red-500">A valid email address is required.</p>
          )}
        </div>

        {/* ── Discovery Questions ── */}
        {DISCOVERY_QUESTIONS.map((q) => {
          const value = discoveryData[q.key];
          const invalid = isInvalid(q.key, q.required, value);
          return (
            <div key={q.key} className="space-y-1.5">
              <Label htmlFor={q.key}>
                {q.label}
                {q.required && <span className="text-red-500 ml-0.5">*</span>}
              </Label>
              {q.type === 'input' ? (
                <Input
                  id={q.key}
                  value={value}
                  onChange={(e) => handleDiscoveryChange(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  className={invalid ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
              ) : (
                <Textarea
                  id={q.key}
                  value={value}
                  onChange={(e) => handleDiscoveryChange(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  className={invalid ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
              )}
              <p className="text-xs text-muted-foreground">{q.hint}</p>
              {invalid && (
                <p className="text-xs text-red-500">This field is required.</p>
              )}
            </div>
          );
        })}

        {/* ── Theme Selection ── */}
        <div className="space-y-1.5 pt-2">
          <Label htmlFor="theme-select">Site Theme</Label>
          <Select
            value={themeSelection}
            onValueChange={(val) => setThemeSelection(val as ThemeSelection)}
          >
            <SelectTrigger id="theme-select" aria-label="Site Theme">
              <SelectValue placeholder="Choose a theme…" />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value} textValue={t.label}>
                  <span className="font-medium">{t.label}</span>
                  <span className="ml-2 text-muted-foreground text-xs">— {t.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Sets the visual tone for your generated site.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIKickstart;
