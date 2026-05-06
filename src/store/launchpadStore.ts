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
  | 'chiropractic';

export type DiscoveryData = {
  industryCategory: IndustryCategory | '';
  businessName: string;
  vision: string;
  hookAndProblem: string;
  services: string;
  uniqueValue: string;
  theAsk: string;
};

type LaunchpadState = {
  discoveryData: DiscoveryData;
  themeSelection: ThemeSelection;
  userEmail: string;
  setDiscoveryData: (data: Partial<DiscoveryData>) => void;
  setThemeSelection: (theme: ThemeSelection) => void;
  setUserEmail: (email: string) => void;
  resetDiscovery: () => void;
};

const defaultDiscovery: DiscoveryData = {
  industryCategory: '',
  businessName: '',
  vision: '',
  hookAndProblem: '',
  services: '',
  uniqueValue: '',
  theAsk: '',
};

export const useLaunchpadStore = create<LaunchpadState>((set) => ({
  discoveryData: defaultDiscovery,
  themeSelection: 'professional',
  userEmail: '',
  setDiscoveryData: (data) =>
    set((state) => ({ discoveryData: { ...state.discoveryData, ...data } })),
  setThemeSelection: (theme) => set({ themeSelection: theme }),
  setUserEmail: (email) => set({ userEmail: email }),
  resetDiscovery: () =>
    set({ discoveryData: defaultDiscovery, themeSelection: 'professional', userEmail: '' }),
}));
