import React, { useEffect } from 'react';

const FeedbackPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen bg-[#F3F3F3]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              We Value Your Feedback!
            </h1>
            <p className="text-xl text-[#464E54]">
              Thank you for choosing mytCreative. To help us continually improve, please take 
              a few moments to share your experience with our recent services.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* GHL Survey Embed Placeholder */}
            <div className="bg-[#f5f5f5] rounded-lg p-8 text-center">
              <p className="text-lg text-[#464E54]">
                Service satisfaction survey will be embedded here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;