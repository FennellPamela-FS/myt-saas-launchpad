import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-br from-[#F3F3F3] to-[#e6f4fa] flex items-center">
      <div className="container-custom w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#464E54]">
              Oops! Page Not Found
            </h1>
            
            <p className="text-lg md:text-xl text-[#818284] mb-8 leading-relaxed">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry though – we'll help you find your way back to where you need to be.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                to="/" 
                className="btn btn-primary flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Home size={20} className="mr-2" />
                Back to Home
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="btn btn-outline flex items-center border-2 border-[#4EBCED] text-[#4EBCED] hover:bg-[#4EBCED] hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                Go Back
              </button>
            </div>

            {/* Helpful Links */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#464E54]">
                Looking for something specific?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  to="/launchpad" 
                  className="p-4 bg-[#f8f9fa] rounded-lg hover:bg-[#e9ecef] transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#4EBCED] rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <Search size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[#464E54]">mytSimple™ Launchpad</div>
                      <div className="text-sm text-[#818284]">Build your website in minutes</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/author-services" 
                  className="p-4 bg-[#f8f9fa] rounded-lg hover:bg-[#e9ecef] transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#45899E] rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <Search size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[#464E54]">Author Services</div>
                      <div className="text-sm text-[#818284]">Digital presence for authors</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/mytcore" 
                  className="p-4 bg-[#f8f9fa] rounded-lg hover:bg-[#e9ecef] transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#464E54] rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <Search size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[#464E54]">mytCore Collective</div>
                      <div className="text-sm text-[#818284]">AI-powered solutions</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/book-discovery-call" 
                  className="p-4 bg-[#f8f9fa] rounded-lg hover:bg-[#e9ecef] transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#4EBCED] rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <Search size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[#464E54]">Schedule a Call</div>
                      <div className="text-sm text-[#818284]">Let's discuss your project</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-[#818284] mb-4">
              Still can't find what you're looking for?
            </p>
            <Link 
              to="/book-discovery-call" 
              className="text-[#4EBCED] hover:text-[#3e96be] font-medium underline transition-colors duration-200"
            >
              Contact our team for assistance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;