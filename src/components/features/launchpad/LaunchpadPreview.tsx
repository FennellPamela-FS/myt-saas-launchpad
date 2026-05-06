import React, { useState } from 'react';
import { LaunchpadFormData } from '../../pages/LaunchpadPage';
import { Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Maximize2, Minimize2, X, MapPin, Clock, Star, ArrowRight, CheckCircle, Menu } from 'lucide-react';

interface LaunchpadPreviewProps {
  formData: LaunchpadFormData;
}

const LaunchpadPreview: React.FC<LaunchpadPreviewProps> = ({ formData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { business, contact, services, branding, social } = formData;

  // Get placeholder or actual value
  const getValue = (value: string, placeholder: string) => {
    return value ? value : placeholder;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const PreviewContent = () => (
    <div className="launchpad-preview font-sans bg-white" style={{ color: branding.secondaryColor }}>
      {/* Internal Website Header - Always visible in fullscreen, hidden in embedded view */}
      {isFullscreen && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {branding.logo ? (
                  <img 
                    src={URL.createObjectURL(branding.logo)} 
                    alt="Logo" 
                    className="h-10 w-auto mr-3 myt-lp-logo-img"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {getValue(business.businessName, 'B').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-bold text-xl myt-lp-business-name" style={{ color: branding.secondaryColor }}>
                    {getValue(business.businessName, 'Your Business Name')}
                  </div>
                  {business.tagline && (
                    <div className="text-sm text-gray-600 myt-lp-tagline">{business.tagline}</div>
                  )}
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">Home</a>
                <a href="#about" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">About</a>
                <a href="#services" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">Services</a>
                <a href="#contact" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">Contact</a>
              </nav>

              {/* Contact Info & CTA */}
              <div className="hidden lg:flex items-center space-x-4">
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center text-gray-600 hover:text-[#4EBCED] transition-colors myt-lp-phone"
                  >
                    <Phone size={16} className="mr-2" />
                    <span className="font-medium">{contact.phone}</span>
                  </a>
                )}
                <button 
                  className="px-6 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} style={{ color: branding.secondaryColor }} />
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
                <nav className="flex flex-col space-y-3 mt-4">
                  <a href="#home" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">Home</a>
                  <a href="#about" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">About</a>
                  <a href="#services" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">Services</a>
                  <a href="#contact" className="text-gray-700 hover:text-[#4EBCED] transition-colors font-medium">Contact</a>
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="text-gray-600 font-medium">{contact.phone}</a>
                  )}
                </nav>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Enhanced Hero Section with Background Image and Modern Design */}
      <section 
        id="home"
        className={`relative ${isFullscreen ? 'pt-24' : 'pt-0'} pb-20 md:pb-32 bg-cover bg-center bg-no-repeat overflow-hidden min-h-[600px] flex items-center`}
        style={{ 
          backgroundImage: `url('https://storage.googleapis.com/msgsndr/5WkCjdNQApiEdU3hlSMc/media/67172f483a21fb48994907fb.png')` 
        }}
      >
        {/* Primary Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95"></div>
        
        {/* Secondary Brand Color Overlay for depth */}
        <div 
          className="absolute inset-0 bg-gradient-to-r via-transparent opacity-20"
          style={{ 
            background: `linear-gradient(135deg, ${branding.primaryColor}40, transparent, ${branding.secondaryColor}30)` 
          }}
        ></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: branding.primaryColor }}></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: branding.secondaryColor }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight myt-lp-headline"
                style={{ color: branding.primaryColor }}
              >
                {getValue(business.mainHeadline, 'Transform Your Business with Professional Solutions')}
              </h1>
              
              {business.subheadline1 && (
                <h2 className="text-xl md:text-2xl mb-4 font-medium text-gray-700 myt-lp-subheadline1">
                  {business.subheadline1}
                </h2>
              )}
              
              {business.subheadline2 && (
                <p className="text-lg mb-8 text-gray-600 leading-relaxed myt-lp-subheadline2">
                  {business.subheadline2}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="px-8 py-4 rounded-lg text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Get Started Today
                  <ArrowRight size={20} className="ml-2" />
                </button>
                <button 
                  className="px-8 py-4 rounded-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                  style={{ 
                    borderColor: branding.primaryColor, 
                    color: branding.primaryColor 
                  }}
                >
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 font-medium">5.0 Rating</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">500+</span> Happy Customers
                </div>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 rounded w-full" style={{ backgroundColor: `${branding.primaryColor}20` }}></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} style={{ color: branding.primaryColor }} />
                  <span className="text-sm font-medium">Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern About/Introduction Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6 myt-lp-intro-title-services"
              style={{ color: branding.secondaryColor }}
            >
              {getValue(business.introTitle, 'Welcome to Our Business')}
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8 myt-lp-intro-text-services">
              {getValue(business.introText, 'We are dedicated to providing exceptional solutions that help your business thrive. Our team combines expertise with innovation to deliver results that exceed expectations.')}
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {getValue(business.aboutText, 'With years of experience and a commitment to excellence, we understand what it takes to succeed in today\'s competitive market. Let us help you achieve your goals with our proven strategies and personalized approach.')}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: branding.primaryColor }}>500+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: branding.primaryColor }}>98%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: branding.primaryColor }}>24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: branding.secondaryColor }}>
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We deliver exceptional value through our comprehensive approach and commitment to your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contact.benefits.map((benefit, index) => (
              <div key={index} className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                <div 
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${branding.primaryColor}20` }}
                >
                  <CheckCircle size={24} style={{ color: branding.primaryColor }} />
                </div>
                <h3 
                  className={`text-lg font-bold mb-3 myt-lp-benefit${index+1}-title group-hover:text-current transition-colors`}
                  style={{ color: branding.primaryColor }}
                >
                  {getValue(benefit.title, `Key Benefit ${index+1}`)}
                </h3>
                <p className={`text-gray-600 leading-relaxed myt-lp-benefit${index+1}-desc`}>
                  {getValue(benefit.description, `This is a compelling description of how this benefit helps your customers achieve their goals and solve their problems.`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 myt-lp-services-title" style={{ color: branding.secondaryColor }}>
              {getValue(services.title, 'Our Services')}
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getValue(services.subtitle, 'Comprehensive solutions designed to help your business succeed')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.items.map((service, index) => (
              <div key={index} className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                <div 
                  className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${branding.primaryColor}20` }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: branding.primaryColor }}
                  ></div>
                </div>
                <h3 
                  className={`text-xl font-bold mb-4 myt-lp-service${index+1}-name group-hover:text-current transition-colors`}
                  style={{ color: branding.primaryColor }}
                >
                  {getValue(service.name, `Professional Service ${index+1}`)}
                </h3>
                <p className={`text-gray-600 leading-relaxed mb-6 myt-lp-service${index+1}-desc`}>
                  {getValue(service.description, `Comprehensive description of this service and how it provides value to your customers. We focus on delivering exceptional results that exceed expectations.`)}
                </p>
                <a 
                  href="#" 
                  className="inline-flex items-center font-semibold group-hover:translate-x-1 transition-transform duration-200"
                  style={{ color: branding.primaryColor }}
                >
                  Learn more 
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: branding.primaryColor }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today to learn how we can help your business grow and succeed with our proven solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 rounded-lg font-semibold bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                style={{ color: branding.primaryColor }}
              >
                Get Free Consultation
              </button>
              <button 
                className="px-8 py-4 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-current transition-all duration-300"
                style={{ '--hover-color': branding.primaryColor } as any}
              >
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer id="contact" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                {branding.logo ? (
                  <img 
                    src={URL.createObjectURL(branding.logo)} 
                    alt="Logo" 
                    className="h-10 w-auto mr-3"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {getValue(business.businessName, 'B').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-xl font-bold">
                  {getValue(business.businessName, 'Your Business Name')}
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {business.tagline || 'Your trusted partner for professional solutions and exceptional service. We\'re committed to helping your business succeed.'}
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                {social.facebook && (
                  <a href={social.facebook} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors myt-lp-social-facebook">
                    <Facebook size={20} />
                  </a>
                )}
                {social.instagram && (
                  <a href={social.instagram} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors myt-lp-social-instagram">
                    <Instagram size={20} />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors myt-lp-social-twitter">
                    <Twitter size={20} />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors myt-lp-social-linkedin">
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <div className="space-y-4">
                {contact.phone && (
                  <div className="flex items-center myt-lp-phone">
                    <Phone size={18} className="mr-3 text-gray-400" />
                    <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-white transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center myt-lp-email">
                    <Mail size={18} className="mr-3 text-gray-400" />
                    <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-white transition-colors">
                      {contact.email}
                    </a>
                  </div>
                )}
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 text-gray-400 mt-1" />
                  <span className="text-gray-300">
                    123 Business Street<br />
                    Your City, State 12345
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-3 text-gray-400" />
                  <span className="text-gray-300">
                    Mon-Fri: 9AM-6PM
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} {getValue(business.businessName, 'Your Business Name')}. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Fullscreen Header */}
        <div className="bg-[#464E54] text-white p-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium">Live Preview - Fullscreen</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-[#55595d] rounded transition-colors"
              title="Exit Fullscreen"
            >
              <Minimize2 size={18} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-[#55595d] rounded transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Fullscreen Content */}
        <div className="h-full overflow-auto">
          <PreviewContent />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Preview Header with Fullscreen Button */}
      <div className="bg-[#464E54] text-white p-3 font-medium flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span>Live Preview</span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-1 hover:bg-[#55595d] rounded transition-colors"
          title="View Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
      
      {/* Preview Content */}
      <div className="overflow-auto max-h-[700px]">
        <PreviewContent />
      </div>
    </div>
  );
};

export default LaunchpadPreview;