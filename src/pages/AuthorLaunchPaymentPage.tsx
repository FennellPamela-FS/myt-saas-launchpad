import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, CheckCircle, ArrowLeft, Star } from 'lucide-react';

const AuthorLaunchPaymentPage: React.FC = () => {
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
            <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#4EBCED]">
              <div className="flex items-center mb-4">
                <div className="text-[#4EBCED] mr-3">
                  <Layout size={48} />
                </div>
                <div className="bg-[#4EBCED] text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Star size={16} className="inline mr-1" />
                  Most Popular
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Author Launch Package</h1>
              <div className="text-2xl font-bold text-[#4EBCED] mb-6">
                Complete Digital Presence Solution
              </div>
              
              <p className="text-[#464E54] mb-6">
                Make a powerful entrance into the digital landscape. Building on the foundation 
                of our Author Start package, this comprehensive offering propels your online 
                presence to new heights with a dedicated landing page and custom social graphics.
              </p>

              <h3 className="text-xl font-bold mb-4">What's Included:</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Everything in Author Start Package</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Custom Landing Page - Professional website showcasing your work</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Social Media Graphics - Custom designs for all major platforms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Brand Consistency - Cohesive visual identity across all materials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>SEO Optimization - Enhanced discoverability online</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Mobile Responsive Design - Perfect on all devices</span>
                </li>
              </ul>

              <div className="bg-[#e6f4fa] p-4 rounded-lg">
                <h4 className="font-bold mb-2">Perfect for:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Authors ready to build their online presence</li>
                  <li>• Content creators seeking professional branding</li>
                  <li>• Authors launching new books or series</li>
                  <li>• Those wanting comprehensive digital marketing</li>
                </ul>
              </div>
            </div>


            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Launch Your Digital Presence</h2>
              
              <div className="mb-6 p-4 bg-[#e6f4fa] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Author Launch Package</span>
                  <span className="font-bold text-[#4EBCED]">Contact for Pricing</span>
                </div>
              </div>

              {/* Payment Form Embed */}
              <iframe
                src="https://on.mytcreative.com/widget/form/wpG0fHv5koCR0qLNXTQn"
                style={{width:'100%',height:'100%',border:'none',borderRadius:'3px'}}
                id="inline-wpG0fHv5koCR0qLNXTQn" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="AuthorLaunch"
                data-height="878"
                data-layout-iframe-id="inline-wpG0fHv5koCR0qLNXTQn"
                data-form-id="wpG0fHv5koCR0qLNXTQn"
                title="AuthorLaunch"
              />
              <script src="https://on.mytcreative.com/js/form_embed.js"></script>
              <div className="mt-6 text-center">
                <p className="text-sm text-[#818284]">
                  Secure payment processing. Your information is protected.
                </p>
              </div>
            </div>
          </div>
            

            {/* ****************************** */}


          {/* Value Proposition */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Why Author Launch is Our Most Popular Package</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-[#4EBCED] mb-3">
                    <Layout size={32} className="mx-auto" />
                  </div>
                  <h4 className="font-bold mb-2">Complete Solution</h4>
                  <p className="text-sm text-[#818284]">Everything you need to establish a professional online presence</p>
                </div>
                <div className="text-center">
                  <div className="text-[#4EBCED] mb-3">
                    <Star size={32} className="mx-auto" />
                  </div>
                  <h4 className="font-bold mb-2">Best Value</h4>
                  <p className="text-sm text-[#818284]">Comprehensive package that delivers maximum impact for your investment</p>
                </div>
                <div className="text-center">
                  <div className="text-[#4EBCED] mb-3">
                    <CheckCircle size={32} className="mx-auto" />
                  </div>
                  <h4 className="font-bold mb-2">Proven Results</h4>
                  <p className="text-sm text-[#818284]">Our most successful authors choose this comprehensive approach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorLaunchPaymentPage;