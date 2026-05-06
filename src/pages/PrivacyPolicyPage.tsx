import React, { useEffect } from 'react';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-[#F3F3F3] to-[#e6f4fa]">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-[#4EBCED] mb-6">
              <Shield size={64} className="mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight appear">
              Privacy Policy
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              At mytCreative LLC, we prioritize your privacy. This policy outlines our practices 
              regarding data collection, use, and protection.
            </p>
            <div className="text-sm text-[#818284] appear" style={{ animationDelay: '0.4s' }}>
              Last updated: April 25, 2024
            </div>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Privacy Policy Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            
            {/* Who We Are */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">Who We Are</h2>
              <p className="mb-4 leading-relaxed">
                When we mention "our sites" or "mytCreative sites"—whether referred to individually or collectively—we are discussing the websites and applications offered by mytCreative, including, but not limited to: mytcreative.com, go.mytcreative.com, login.mytcreative.com, and be.mytcreative.com, along with their subdomains and content.
              </p>
              <p className="leading-relaxed">
                These sites are owned and operated by mytCreative Solutions LLC, referred to as "mytCreative," "us," or "we" throughout this policy. When we refer to persons interacting with mytCreative in this policy, we use the term "you."
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">Introduction</h2>
              <p className="leading-relaxed">
                At mytCreative LLC, we prioritize your privacy. As a provider of digital solutions, educational services, and community impact initiatives, we are committed to protecting and respecting your personal information. This policy outlines our practices regarding data collection, use, and protection.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#4EBCED]">Personal Information:</h3>
                  <p className="leading-relaxed">Names, email addresses, and phone numbers provided by you.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#4EBCED]">Non-Personal Information:</h3>
                  <p className="leading-relaxed">Usage details like IP addresses, browser types, and access times.</p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services.</li>
                <li>To communicate with you regarding your inquiries and our services.</li>
                <li>To improve and personalize your experience on our sites.</li>
                <li>For compliance with legal obligations.</li>
              </ul>
            </div>

            {/* Cookies and Tracking Technologies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">3. Cookies and Tracking Technologies</h2>
              <p className="leading-relaxed">
                We use cookies to enhance site functionality and user experience. You can control cookie settings through your browser.
              </p>
            </div>

            {/* Compliance with Laws */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">4. Compliance with Laws</h2>
              <p className="leading-relaxed">
                We adhere to the GDPR for users in the EEA and comply with relevant North Carolina privacy laws, ensuring lawful processing of your data.
              </p>
            </div>

            {/* Accessibility */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">5. Accessibility</h2>
              <p className="leading-relaxed">
                We ensure that our privacy policy is accessible to all users, including those with disabilities. Alternative formats of this document are available upon request.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">6. Data Security</h2>
              <p className="leading-relaxed">
                We implement robust security measures to protect your data from unauthorized access and breaches.
              </p>
            </div>

            {/* Third-Party Disclosure */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">7. Third-Party Disclosure</h2>
              <p className="leading-relaxed">
                We do not sell your data. We only share information with third parties to the extent necessary for providing our services, such as payment processing.
              </p>
            </div>

            {/* User Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">8. User Rights</h2>
              <p className="leading-relaxed">
                You have the right to access, correct, or delete your personal data. Please contact us to make such requests.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">9. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this policy to reflect changes to our practices. We encourage you to review it regularly to stay informed of any changes.
              </p>
            </div>

            {/* Contact Us */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">10. Contact Us</h2>
              <p className="mb-6 leading-relaxed">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              
              <div className="bg-[#F3F3F3] rounded-lg p-6 space-y-4">
                <div className="flex items-center">
                  <Mail size={20} className="text-[#4EBCED] mr-3" />
                  <span>hello@mytcreative.com</span>
                </div>
                <div className="flex items-center">
                  <Phone size={20} className="text-[#4EBCED] mr-3" />
                  <span>866-981-9909</span>
                </div>
                <div className="flex items-start">
                  <MapPin size={20} className="text-[#4EBCED] mr-3 mt-1" />
                  <span>301 S Church St, Suite 228, Rocky Mount, NC 27804</span>
                </div>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="bg-[#e6f4fa] rounded-lg p-6 text-center">
              <p className="font-medium text-[#464E54]">
                By using our sites, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <p className="text-sm text-[#818284] mt-2">
                Last updated: April 25, 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;