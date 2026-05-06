import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, CheckCircle, ArrowLeft } from 'lucide-react';

const AuthorStartPaymentPage: React.FC = () => {
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
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-[#45899E] mb-4">
                <FileEdit size={48} />
              </div>
              <h1 className="text-3xl font-bold mb-4">Author Start Package</h1>
              <div className="text-2xl font-bold text-[#45899E] mb-6">
                Professional Foundation Package
              </div>
              
              <p className="text-[#464E54] mb-6">
                Our foundational package ensures your content is polished to perfection. 
                With our creative editing and formatting services, we'll refine your materials, 
                guaranteeing a professional and cohesive presentation.
              </p>

              <h3 className="text-xl font-bold mb-4">What's Included:</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-3 flex-shrink-0 mt-1" />
                  <span>Professional Editing - Complete review and refinement of your manuscript</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-3 flex-shrink-0 mt-1" />
                  <span>Expert Formatting - Professional layout and typography for print and digital</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-3 flex-shrink-0 mt-1" />
                  <span>Quality Assurance - Final review to ensure consistency and professionalism</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-3 flex-shrink-0 mt-1" />
                  <span>Delivery in Multiple Formats - Ready for various publishing platforms</span>
                </li>
              </ul>

              <div className="bg-[#f5f5f5] p-4 rounded-lg">
                <h4 className="font-bold mb-2">Perfect for:</h4>
                <ul className="text-sm space-y-1">
                  <li>• First-time authors</li>
                  <li>• Manuscripts needing professional polish</li>
                  <li>• Authors seeking essential enhancements</li>
                  <li>• Budget-conscious content creators</li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Your Investment & Next Step</h2>
              
              <div className="mb-6 p-4 bg-[#e6f4fa] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#45899E]">A one-time investment of $550</span>
                  <span className="font-medium">Author Start Package</span>
                </div>
              </div>
              
              <p className="text-[#464E54] mb-6">
                Our foundational package ensures your content is polished to perfection. 
                With our creative editing and formatting services, we'll refine your materials, 
                guaranteeing a professional and cohesive presentation.
              </p>

              {/* Payment Form Embed */}
              <iframe
                src="https://on.mytcreative.com/widget/form/jFeR6R8M2gnsXRbl1XIW"
                style={{display:'none', width:'100%', height:'100%', border:'none', borderRadius:'3px'}}
                id="inline-jFeR6R8M2gnsXRbl1XIW" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="showAfter"
                data-trigger-value="3"
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="leadCollected"
                data-deactivation-value=""
                data-form-name="AuthorStart"
                data-height="798"
                data-layout-iframe-id="inline-jFeR6R8M2gnsXRbl1XIW"
                data-form-id="jFeR6R8M2gnsXRbl1XIW"
                title="AuthorStart"
              />
              <script src="https://on.mytcreative.com/js/form_embed.js"></script>
              <div className="mt-6 text-center">
                <p className="text-sm text-[#818284]">
                  Secure payment processing. Your information is protected.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Why Choose mytCreative?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Expert Team</h4>
                  <p className="text-sm text-[#818284]">Professional editors and formatting specialists</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Quality Guarantee</h4>
                  <p className="text-sm text-[#818284]">We ensure your satisfaction with every project</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Fast Turnaround</h4>
                  <p className="text-sm text-[#818284]">Professional results delivered on time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorStartPaymentPage;