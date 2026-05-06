import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';

const ReferralPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen bg-[#F3F3F3]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[#4EBCED] mb-4">
              <Heart size={48} className="mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Love What We Do? Share the mytCreative Experience!
            </h1>
            <p className="text-xl text-[#464E54]">
              If you're happy with our services, we'd be honored if you'd refer us to other 
              businesses or creators who could benefit from our digital solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* GHL Referral Form Embed Placeholder */}
            <div className="bg-[#f5f5f5] rounded-lg p-8 text-center">
              <p className="text-lg text-[#464E54]">
                Referral form will be embedded here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;