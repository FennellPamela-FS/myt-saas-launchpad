import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen bg-[#F3F3F3]">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-[#4EBCED] mb-6">
              <CheckCircle size={64} className="mx-auto" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              You're Booked! We're Excited to Speak With You
            </h1>
            
            <p className="text-lg mb-6 text-[#464E54]">
              Thank you for scheduling your Discovery Call with mytCreative. You'll receive a 
              calendar invitation and a confirmation email shortly with all the details.
            </p>

            <div className="bg-[#f5f5f5] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">What to Expect on Our Call:</h2>
              <ul className="text-left space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 mt-1" />
                  <span>Discussion of your business goals and challenges</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 mt-1" />
                  <span>Exploration of potential solutions and strategies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 mt-1" />
                  <span>Overview of how mytCreative can support your vision</span>
                </li>
              </ul>
            </div>

            <div className="space-x-4">
              <Link to="/mytcore" className="btn btn-primary">
                Learn About Our Approach
              </Link>
              <Link to="/" className="btn btn-outline">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;