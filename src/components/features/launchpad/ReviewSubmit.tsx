import React from 'react';
import { LaunchpadFormData } from '../../pages/LaunchpadPage';
import { CheckCircle, XCircle } from 'lucide-react';

interface ReviewSubmitProps {
  formData: LaunchpadFormData;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData }) => {
  const { business, contact, services, branding, social } = formData;

  // Function to check if a field is complete
  const isComplete = (value: any): boolean => {
    if (value === null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        // For arrays, check if all required items have content
        return value.every(item => {
          if (typeof item === 'object') {
            return Object.values(item).every(val => 
              typeof val === 'string' ? val.trim() !== '' : val !== null
            );
          }
          return false;
        });
      }
      // For objects like branding.logo
      return Object.values(value).some(val => val !== null && val !== '');
    }
    return false;
  };

  // Check completion status for each section
  const businessComplete = 
    isComplete(business.businessName) && 
    isComplete(business.mainHeadline) && 
    isComplete(business.introTitle) && 
    isComplete(business.introText) && 
    isComplete(business.aboutText);

  const contactComplete = 
    isComplete(contact.phone) && 
    isComplete(contact.email) && 
    isComplete(contact.benefits);

  const servicesComplete = 
    isComplete(services.title) && 
    isComplete(services.items);

  const brandingComplete = 
    isComplete(branding.primaryColor) && 
    isComplete(branding.secondaryColor);
    // Logo is optional

  const socialComplete = true; // Social media is optional

  // Count completed required sections (branding logo is optional)
  const totalSections = 5;
  const completedSections = [
    businessComplete, 
    contactComplete, 
    servicesComplete, 
    brandingComplete, 
    socialComplete
  ].filter(Boolean).length;

  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Information</h2>
      <p className="mb-6 text-[#464E54]">
        Please review all the information you've provided before submitting. You can go back
        to any section to make changes if needed.
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Completion Status:</span>
          <span className="font-bold">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-[#e6e6e6] rounded-full h-4">
          <div 
            className="bg-[#4EBCED] h-4 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Business Information */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Business Information</h3>
            <span className={`flex items-center ${businessComplete ? 'text-green-500' : 'text-red-500'}`}>
              {businessComplete ? 
                <><CheckCircle size={18} className="mr-1" /> Complete</> : 
                <><XCircle size={18} className="mr-1" /> Incomplete</>
              }
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Business Name:</strong> {business.businessName || '(Not provided)'}</div>
            <div><strong>Tagline:</strong> {business.tagline || '(Not provided)'}</div>
            <div><strong>Main Headline:</strong> {business.mainHeadline || '(Not provided)'}</div>
            <div><strong>Intro Title:</strong> {business.introTitle || '(Not provided)'}</div>
          </div>
        </div>

        {/* Contact & Benefits */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Contact & Benefits</h3>
            <span className={`flex items-center ${contactComplete ? 'text-green-500' : 'text-red-500'}`}>
              {contactComplete ? 
                <><CheckCircle size={18} className="mr-1" /> Complete</> : 
                <><XCircle size={18} className="mr-1" /> Incomplete</>
              }
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Phone:</strong> {contact.phone || '(Not provided)'}</div>
            <div><strong>Email:</strong> {contact.email || '(Not provided)'}</div>
            <div><strong>Benefits:</strong> {contact.benefits.filter(b => b.title && b.description).length} of 4 provided</div>
          </div>
        </div>

        {/* Services */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Services</h3>
            <span className={`flex items-center ${servicesComplete ? 'text-green-500' : 'text-red-500'}`}>
              {servicesComplete ? 
                <><CheckCircle size={18} className="mr-1" /> Complete</> : 
                <><XCircle size={18} className="mr-1" /> Incomplete</>
              }
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Services Title:</strong> {services.title || '(Not provided)'}</div>
            <div><strong>Services Subtitle:</strong> {services.subtitle || '(Not provided)'}</div>
            <div><strong>Services:</strong> {services.items.filter(s => s.name && s.description).length} of 3 provided</div>
          </div>
        </div>

        {/* Branding */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Branding</h3>
            <span className={`flex items-center ${brandingComplete ? 'text-green-500' : 'text-red-500'}`}>
              {brandingComplete ? 
                <><CheckCircle size={18} className="mr-1" /> Complete</> : 
                <><XCircle size={18} className="mr-1" /> Incomplete</>
              }
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Logo:</strong> {branding.logo ? branding.logo.name : '(Not provided - optional)'}</div>
            <div className="flex items-center">
              <strong className="mr-2">Primary Color:</strong> 
              <div className="w-4 h-4 inline-block mr-1 rounded" style={{ backgroundColor: branding.primaryColor }}></div>
              {branding.primaryColor}
            </div>
            <div className="flex items-center">
              <strong className="mr-2">Secondary Color:</strong> 
              <div className="w-4 h-4 inline-block mr-1 rounded" style={{ backgroundColor: branding.secondaryColor }}></div>
              {branding.secondaryColor}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Social Media</h3>
            <span className="flex items-center text-green-500">
              <CheckCircle size={18} className="mr-1" /> Optional
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Facebook:</strong> {social.facebook || '(Not provided)'}</div>
            <div><strong>Instagram:</strong> {social.instagram || '(Not provided)'}</div>
            <div><strong>Twitter/X:</strong> {social.twitter || '(Not provided)'}</div>
            <div><strong>LinkedIn:</strong> {social.linkedin || '(Not provided)'}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#f5f5f5] rounded-lg">
        <h3 className="text-lg font-medium mb-3">Next Steps</h3>
        <p className="mb-4">
          After submitting your information, our team will:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Review your submitted information</li>
          <li>Finalize your website design based on your inputs</li>
          <li>Set up your GoHighLevel account with your personalized funnel</li>
          <li>Email you with login details and instructions</li>
          <li>Schedule a brief walkthrough call to ensure you're ready to go</li>
        </ol>
      </div>
    </div>
  );
};

export default ReviewSubmit;