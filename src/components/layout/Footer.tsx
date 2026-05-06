import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import NewsletterSubscribe from '../features/NewsletterSubscribe';

const Footer: React.FC = () => {
  React.useEffect(() => {
    // Add the chat widget script
    const script = document.createElement('script');
    script.src = 'https://beta.leadconnectorhq.com/loader.js';
    script.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
    script.setAttribute('data-widget-id', '668451581123b13c7a9a9813');
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <footer className="bg-[#464E54] text-white" id="contact">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src="https://storage.googleapis.com/msgsndr/5WkCjdNQApiEdU3hlSMc/media/65f132245ad57ba9915a0c73.png" 
                alt="mytCreative" 
                className="h-20"
              />
            </div>
            <p className="mb-6 text-[#F3F3F3] leading-relaxed">
              Business Transformations and Brand Development. We help you develop custom, 
              sustainable solutions designed to support your vision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#4EBCED] transition-colors transform hover:scale-110 duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#4EBCED] transition-colors transform hover:scale-110 duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#4EBCED] transition-colors transform hover:scale-110 duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#4EBCED] transition-colors transform hover:scale-110 duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="/solutions-hub" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Solutions Hub
                </a>
              </li>
              <li>
                <a href="/author-services" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Author Services
                </a>
              </li>
              <li>
                <a href="/launchpad" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  mytSimple™ Launchpad
                </a>
              </li>
              <li>
                <a href="/mytcore" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  mytCore Collective
                </a>
              </li>
              <li>
                <a href="/community-impact" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Community Impact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-white text-xl font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <Mail size={20} className="mr-3 mt-1 text-[#4EBCED] group-hover:scale-110 transition-transform duration-200" />
                <a name className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200">
                  hello@mytcreative.com
                </a>
              </li>
              <li className="flex items-start group">
                <Phone size={20} className="mr-3 mt-1 text-[#4EBCED] group-hover:scale-110 transition-transform duration-200" />
                <a href="tel:+18669819919" className="text-[#F3F3F3] hover:text-[#4EBCED] transition-colors duration-200">
                  (866) 981-9909
                </a>
              </li>
              <li className="flex items-start group">
                <MapPin size={20} className="mr-3 mt-1 text-[#4EBCED] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-[#F3F3F3]">
                  301 S Church St, Suite 228, Rocky Mount, NC 27804
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#55595d] text-center">
          <p className="text-[#F3F3F3]">
            © 2025 mytCreative LLC - All Rights Reserved. 
            <a href="/privacy-policy" className="text-[#4EBCED] hover:text-[#71c9f1] underline transition-colors ml-2">
              Privacy Policy
            </a>
            <span className="mx-2">|</span>
            <a href="/terms" className="text-[#4EBCED] hover:text-[#71c9f1] underline transition-colors">
              Terms
            </a>
          </p>
        </div>
      </div>
      
      {/* Chat Widget */}
      <div 
        data-chat-widget 
        data-widget-id="668451581123b13c7a9a9813" 
        data-location-id="jv8y1olqwcMUxmhsWkUr"
      />
    </footer>
  );
};

export default Footer;