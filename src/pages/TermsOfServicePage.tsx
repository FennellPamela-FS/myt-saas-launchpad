import React, { useEffect } from 'react';
import { Shield, Mail, Phone, MapPin, Scale } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const TermsOfServicePage: React.FC = () => {
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
              <Scale size={64} className="mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight appear">
              Terms of Service
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              Welcome to mytCreative LLC. By accessing our website or using our services, 
              you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
            <div className="text-sm text-[#818284] appear" style={{ animationDelay: '0.4s' }}>
              Last updated: April 25, 2024
            </div>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Terms of Service Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            
            {/* Acceptable Use */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">1. Acceptable Use</h2>
              <p className="leading-relaxed">
                You agree to use our website and services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">2. Intellectual Property</h2>
              <p className="leading-relaxed">
                The content, images, brands, and other intellectual property found on our website are the property of mytCreative LLC, unless otherwise stated. These properties may not be used without prior written consent from mytCreative LLC.
              </p>
            </div>

            {/* User-Generated Content */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">3. User-Generated Content</h2>
              <p className="leading-relaxed">
                Users are responsible for their content. By posting content on our website, you grant mytCreative LLC a non-exclusive, royalty-free license to use, reproduce, edit, and authorize others to use, reproduce, and edit any of your content in any form, format, or media.
              </p>
            </div>

            {/* Hyperlinking to our Content */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">4. Hyperlinking to our Content</h2>
              <p className="leading-relaxed">
                You may link to our content as long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
              </p>
            </div>

            {/* Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">5. Privacy Policy</h2>
              <p className="leading-relaxed">
                Our Privacy Policy, which sets out how we will use your information, can be found at{' '}
                <a href="/privacy-policy" className="text-[#4EBCED] hover:text-[#3e96be] underline">
                  /privacy-policy
                </a>
                . By using this website, you consent to the processing described therein and warrant that all data provided by you is accurate.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">6. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms of Service are governed by and construed in accordance with the laws of North Carolina. Disputes arising herefrom shall be exclusively subject to the jurisdiction of the courts of North Carolina.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">7. Changes to Terms</h2>
              <p className="leading-relaxed">
                mytCreative LLC reserves the right to revise these terms at any time as it sees fit, and by using this website you are expected to review these terms on a regular basis to ensure you understand all terms and conditions governing use of this website.
              </p>
            </div>

            {/* Contact Us */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#464E54]">8. Contact Us</h2>
              <p className="mb-6 leading-relaxed">
                If you have any questions or concerns about our Terms of Service, please contact us at:
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
                By using our services, you acknowledge that you have read and agree to be bound by these Terms of Service.
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

export default TermsOfServicePage;