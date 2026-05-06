import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap as Graduation, CheckCircle, ArrowLeft, Crown, Star } from 'lucide-react';

const AuthorPremiumPaymentPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Add the GHL form embed script
    const script = document.createElement('script');
    script.src = 'https://on.mytcreative.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen bg-[#F3F3F3]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              to="/author-services" 
              className="inline-flex items-center text-[#4EBCED] hover:text-[#3e96be] transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Author Services
            </Link>
          </div>

          <div className="grid gap-8">
            {/* Package Details */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#464E54]">
              <div className="flex items-center mb-4">
                <div className="text-[#464E54] mr-3">
                  <Graduation size={48} />
                </div>
                <div className="bg-[#464E54] text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown size={16} className="inline mr-1" />
                  Premium
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Author Premium Package</h1>
              <div className="text-2xl font-bold text-[#464E54] mb-6">
                Complete Author Ecosystem
              </div>
              
              <p className="text-[#464E54] mb-6">
                Go above and beyond with our most comprehensive suite of services. Elevate your 
                digital presence with everything in Author Launch plus an exclusive online course 
                based on your book. This is our highest level of sophistication and educational offerings.
              </p>

              <h3 className="text-xl font-bold mb-4">What's Included:</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>All Features of Author Launch Package</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>Custom Online Course - Transform your book into an interactive learning experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>Course Platform Setup - Complete learning management system</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>Video Production Guidance - Professional course content creation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>Revenue Stream Development - Monetize your expertise</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>Premium Support - Dedicated account management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-3 flex-shrink-0 mt-1" />
                  <span>Marketing Strategy - Comprehensive launch and promotion plan</span>
                </li>
              </ul>

              <div className="bg-gradient-to-r from-[#464E54] to-[#353c41] text-white p-4 rounded-lg">
                <h4 className="text-white font-bold mb-2 flex items-center">
                  <Crown size={20} className="mr-2" />
                  Premium Benefits:
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Transform your book into a profitable course</li>
                  <li>• Create multiple revenue streams</li>
                  <li>• Establish yourself as a thought leader</li>
                  <li>• Build a community around your expertise</li>
                  <li>• Ongoing strategic partnership</li>
                </ul>
              </div>
            </div>


            {/* ****************************** */}
            
            {/* Payment Form */} 
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Invest in Your Premium Success</h2>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-[#464E54]/10 to-[#353c41]/10 rounded-lg border border-[#464E54]/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Author Premium Package</span>
                  <span className="font-bold text-[#464E54]">Custom Investment</span>
                </div>
                <div className="text-sm text-[#818284] mt-1">
                  Comprehensive solution with ongoing partnership
                </div>
              </div>

              {/* Premium Consultation Form Embed */}
              <iframe
                src="https://on.mytcreative.com/widget/form/CBhhjyf5LeN4CAKmNdRF"
                style={{width:'100%',height:'100%',border:'none',borderRadius:'3px'}}
                id="inline-CBhhjyf5LeN4CAKmNdRF" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="AuthorPremium - Consultation Form"
                data-height="736"
                data-layout-iframe-id="inline-CBhhjyf5LeN4CAKmNdRF"
                data-form-id="CBhhjyf5LeN4CAKmNdRF"
                title="AuthorPremium - Consultation Form"
              />
              <script src="https://on.mytcreative.com/js/form_embed.js"></script>

              <div className="text-center">
                <p className="text-sm text-[#818284]">
                  We'll contact you within 24 hours to schedule your premium consultation.
                </p>
              </div>
            </div>
          </div>  
          
          {/* Premium Value Proposition */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-[#464E54] to-[#353c41] text-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl text-white font-bold text-center mb-6">The Premium Advantage</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="mb-3">
                    <Star size={32} className="mx-auto" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Maximum ROI</h4>
                  <p className="text-sm opacity-90">Transform your book into multiple revenue streams with ongoing income potential</p>
                </div>
                <div className="text-center">
                  <div className="mb-3">
                    <Graduation size={32} className="mx-auto" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Thought Leadership</h4>
                  <p className="text-sm opacity-90">Establish yourself as an expert in your field with professional course content</p>
                </div>
                <div className="text-center">
                  <div className="mb-3">
                    <Crown size={32} className="mx-auto" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Ongoing Partnership</h4>
                  <p className="text-sm opacity-90">Dedicated support and strategic guidance throughout your author journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPremiumPaymentPage;