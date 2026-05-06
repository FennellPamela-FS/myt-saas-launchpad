import React, { useEffect } from 'react';

const BookingPage: React.FC = () => {
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Let's Connect
            </h1>
            <h3 className="text-2xl font-bold">Schedule Your Complimentary Discovery Call</h3>
            <p className="text-xl text-[#464E54]">
              Ready to discuss your vision and see how mytCreative can help? Select a time below 
              that works for you. We're excited to learn more about your business and explore 
              solutions together.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mx-auto">
            <iframe 
              src="https://on.mytcreative.com/widget/bookings/discovery-call-connection" 
              style={{ 
                width: '100%', 
                height: '1000px', // Increased height
                border: 'none',
                overflow: 'hidden'
              }} 
              scrolling="no" 
              id="0BVyDK8CU5I9Aw81RuJq_1747269082709"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
