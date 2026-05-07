import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';
import AIKickstart from '../components/features/launchpad/AIKickstart';
import BusinessForm from '../components/features/launchpad/BusinessForm';
import ServiceForm from '../components/features/launchpad/ServiceForm';
import ContactForm from '../components/features/launchpad/ContactForm';
import BrandingForm from '../components/features/launchpad/BrandingForm';
import SocialForm from '../components/features/launchpad/SocialForm';
import LaunchpadPreview from '../components/features/launchpad/LaunchpadPreview';
import ReviewSubmit from '../components/features/launchpad/ReviewSubmit';
import { useLaunchpadStore } from '../store/launchpadStore';
import { handleSaaSCheckout } from '../lib/checkout';

// Define types for the form data
export type BusinessData = {
  businessName: string;
  tagline: string;
  mainHeadline: string;
  subheadline1: string;
  subheadline2: string;
  introTitle: string;
  introText: string;
  aboutText: string;
};

export type BenefitItem = {
  title: string;
  description: string;
};

export type ServiceItem = {
  name: string;
  description: string;
};

export type ContactData = {
  phone: string;
  email: string;
  benefits: BenefitItem[];
};

export type BrandingData = {
  logo: File | null;
  primaryColor: string;
  secondaryColor: string;
};

export type SocialData = {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
};

export type LaunchpadFormData = {
  business: BusinessData;
  contact: ContactData;
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  branding: BrandingData;
  social: SocialData;
};

const STEP_LABELS = [
  'AI Kickstart',
  'Business Info',
  'Contact',
  'Services',
  'Branding',
  'Social',
  'Review',
];

const CHECKOUT_STORAGE_KEY = 'myt_pending_checkout';

type PendingCheckout = { checkoutUrl: string; email: string; businessName: string };

const LaunchpadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(() => {
    try {
      const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as PendingCheckout) : null;
    } catch {
      return null;
    }
  });
  const { discoveryData, themeSelection, userEmail, resetDiscovery } = useLaunchpadStore();
  const [formData, setFormData] = useState<LaunchpadFormData>({
    business: {
      businessName: '',
      tagline: '',
      mainHeadline: '',
      subheadline1: '',
      subheadline2: '',
      introTitle: '',
      introText: '',
      aboutText: ''
    },
    contact: {
      phone: '',
      email: '',
      benefits: [
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' }
      ]
    },
    services: {
      title: 'Our Services',
      subtitle: 'How we can help you',
      items: [
        { name: '', description: '' },
        { name: '', description: '' },
        { name: '', description: '' }
      ]
    },
    branding: {
      logo: null,
      primaryColor: '#4EBCED',
      secondaryColor: '#464E54'
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  // Seed businessName from discovery data when advancing past Step 1
  useEffect(() => {
    if (discoveryData.businessName && !formData.business.businessName) {
      setFormData((prev) => ({
        ...prev,
        business: { ...prev.business, businessName: discoveryData.businessName },
      }));
    }
  }, [discoveryData.businessName]);

  const totalSteps = 8; // Step 1: AI Kickstart + 6 existing steps + success

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateFormData = (section: keyof LaunchpadFormData, data: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        ...data
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AIKickstart />;
      case 2:
        return (
          <BusinessForm
            data={formData.business}
            updateData={(data) => updateFormData('business', data)}
          />
        );
      case 3:
        return (
          <ContactForm
            data={formData.contact}
            updateData={(data) => updateFormData('contact', data)}
          />
        );
      case 4:
        return (
          <ServiceForm
            data={formData.services}
            updateData={(data) => updateFormData('services', data)}
          />
        );
      case 5:
        return (
          <BrandingForm
            data={formData.branding}
            updateData={(data) => updateFormData('branding', data)}
          />
        );
      case 6:
        return (
          <SocialForm
            data={formData.social}
            updateData={(data) => updateFormData('social', data)}
          />
        );
      case 7:
        return <ReviewSubmit formData={formData} />;
      case 8:
        return (
          <div className="text-center py-16">
            <div className="mb-8 text-[#4EBCED]">
              <Save size={64} className="mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your Information is Ready!</h2>
            <p className="text-xl mb-8">
              Our team will now finalize your launch. You'll receive an email shortly with next steps.
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="btn btn-primary"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleKickstartSubmit = async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    const result = await handleSaaSCheckout({ email: userEmail, discoveryData, themeSelection });
    setCheckoutLoading(false);

    if ('code' in result) {
      const messages: Record<string, string> = {
        MISSING_EMAIL: 'Please enter a valid email address.',
        MISSING_INDUSTRY: 'Please select an industry category.',
        MISSING_INDUSTRY_OTHER: 'Please describe your industry.',
        NO_CHECKOUT_URL: 'Checkout is not yet configured. Please contact us.',
        ALREADY_COMPLETED: 'An account with this email is already active. Please contact support at hello@mytcreative.com if you need help.',
        PROVISIONING_IN_PROGRESS: 'Your site is currently being set up. Check your email for updates — this usually takes just a few minutes.',
        DB_ERROR: 'Could not save your information. Please try again.',
      };
      setCheckoutError(messages[result.code] ?? 'An unexpected error occurred.');
      return;
    }

    // Save to localStorage so returning users can resume checkout
    const checkout: PendingCheckout = {
      checkoutUrl: result.checkoutUrl,
      email: result.email,
      businessName: discoveryData.businessName,
    };
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkout));
    setPendingCheckout(checkout);
  };

  const handleGoToCheckout = (url: string) => {
    window.location.href = url;
  };

  const handleStartOver = () => {
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    setPendingCheckout(null);
    resetDiscovery();
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { discoveryData, formData });
    handleNext();
  };

  const showPreview = currentStep > 1 && currentStep < 8;
  const isLastFormStep = currentStep === 7;
  const isSuccessStep = currentStep === 8;

  // Checkout-ready screen — shown after save or on return visit
  if (pendingCheckout) {
    return (
      <div className="pt-24 pb-16 bg-[#F3F3F3] min-h-screen">
        <div className="container-custom max-w-2xl">
          <div className="card shadow-lg text-center py-12 px-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#4EBCED]/15 mx-auto mb-6">
              <ShoppingCart size={32} className="text-[#4EBCED]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're one step away!</h2>
            {pendingCheckout.businessName && (
              <p className="text-[#464E54] mb-1 font-medium">{pendingCheckout.businessName}</p>
            )}
            <p className="text-[#464E54] mb-2">
              Your discovery answers have been saved. Complete your purchase to launch your site.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Returning as <span className="font-medium">{pendingCheckout.email}</span>
            </p>

            <button
              onClick={() => handleGoToCheckout(pendingCheckout.checkoutUrl)}
              className="btn btn-primary w-full text-lg py-4 mb-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Complete Your Purchase
            </button>

            <button
              onClick={handleStartOver}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#4EBCED] mx-auto transition-colors"
            >
              <ArrowLeft size={14} />
              Start over with different answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-[#F3F3F3] min-h-screen">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            mytSimple™ <span className="text-[#4EBCED]">Launchpad</span> DEMO
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Input your business information and watch your website take shape in real-time.
            Get online in minutes with our simple, intuitive builder.
          </p>
        </div>

        {/* Progress Bar */}
        {!isSuccessStep && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-[#464E54] mb-1">
              <span className="font-medium text-[#4EBCED]">
                Step {currentStep}: {STEP_LABELS[currentStep - 1]}
              </span>
              <span>{currentStep} of {totalSteps - 1}</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div
                className="bg-[#4EBCED] h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className={`grid gap-8 ${showPreview ? 'md:grid-cols-2' : ''}`}>
          {/* Form Section */}
          <div className="card shadow-lg">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {!isSuccessStep && (
              <div className="mt-8">
                {/* Checkout error feedback (Step 1 only) */}
                {currentStep === 1 && checkoutError && (
                  <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                    {checkoutError}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`btn ${
                      currentStep === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'btn-outline'
                    } flex items-center`}
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    Previous
                  </button>

                  {currentStep === 1 ? (
                    <button
                      onClick={handleKickstartSubmit}
                      disabled={checkoutLoading}
                      className="btn btn-primary flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          Start Building
                          <ChevronRight size={18} className="ml-1" />
                        </>
                      )}
                    </button>
                  ) : isLastFormStep ? (
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary flex items-center"
                    >
                      Personalize & Launch My Site
                      <ChevronRight size={18} className="ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="btn btn-primary flex items-center"
                    >
                      Continue
                      <ChevronRight size={18} className="ml-1" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="card shadow-lg overflow-hidden">
              <LaunchpadPreview formData={formData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchpadPage;
