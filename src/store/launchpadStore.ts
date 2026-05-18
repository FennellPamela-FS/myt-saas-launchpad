import { create } from 'zustand';

export type ThemeSelection =
  | 'professional'
  | 'creative'
  | 'wellness'
  | 'luxury'
  | 'minimalist';

export type IndustryCategory =
  | 'home_services'
  | 'medical'
  | 'legal'
  | 'beauty'
  | 'automotive'
  | 'marketing'
  | 'real_estate'
  | 'restaurant'
  | 'fitness'
  | 'financial'
  | 'education'
  | 'ecommerce'
  | 'coaching'
  | 'dental'
  | 'chiropractic'
  | 'other';

export type DiscoveryData = {
  industryCategory: IndustryCategory | '';
  industryOther: string;
  businessName: string;
  vision: string;
  hookAndProblem: string;
  services: string;
  uniqueValue: string;
  theAsk: string;
};

export type BrandingData = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string | null;
};

type LaunchpadState = {
  discoveryData: DiscoveryData;
  themeSelection: ThemeSelection;
  brandingData: BrandingData;
  userEmail: string;
  setDiscoveryData: (data: Partial<DiscoveryData>) => void;
  setThemeSelection: (theme: ThemeSelection) => void;
  setBrandingData: (data: Partial<BrandingData>) => void;
  setUserEmail: (email: string) => void;
  resetDiscovery: () => void;
};

const defaultDiscovery: DiscoveryData = {
  industryCategory: '',
  industryOther: '',
  businessName: '',
  vision: '',
  hookAndProblem: '',
  services: '',
  uniqueValue: '',
  theAsk: '',
};

const defaultBranding: BrandingData = {
  primaryColor: '#4EBCED',
  secondaryColor: '#464E54',
  accentColor: '#45899E',
  logoUrl: null,
};

export const useLaunchpadStore = create<LaunchpadState>((set) => ({
  discoveryData: defaultDiscovery,
  themeSelection: 'professional',
  brandingData: defaultBranding,
  userEmail: '',
  setDiscoveryData: (data) =>
    set((state) => ({ discoveryData: { ...state.discoveryData, ...data } })),
  setThemeSelection: (theme) => set({ themeSelection: theme }),
  setBrandingData: (data) =>
    set((state) => ({ brandingData: { ...state.brandingData, ...data } })),
  setUserEmail: (email) => set({ userEmail: email }),
  resetDiscovery: () =>
    set({
      discoveryData: defaultDiscovery,
      themeSelection: 'professional',
      brandingData: defaultBranding,
      userEmail: '',
    }),
}));
