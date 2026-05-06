import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Rocket, Zap, ArrowRight } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const QuickStartPage: React.FC = () => {
  const staggeredRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    staggeredRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      staggeredRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !staggeredRefs.current.includes(el)) {
      staggeredRefs.current.push(el);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-[#F3F3F3] to-[#e6f4fa]">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight appear">
              Launch Your Digital Presence,
              <span className="block text-[#4EBCED]">Effortlessly.</span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              Our Quick Start products give you the essential tools to establish your brand, connect with customers, and start growing—without the complexity. See how our mytSimple™ Launchpad makes it happen.
            </p>
            <div className="appear" style={{ animationDelay: '0.4s' }}>
              <Link to="/launchpad" className="btn btn-primary">
                Try Our Launchpad Demo
              </Link>
            </div>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Solutions Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* mytSimple™ */}
            <div className="card relative shadow-lg border-t-4 border-[#4EBCED]" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#4EBCED] text-white px-4 py-1 text-sm">
                Most Popular
              </div>
              <div className="text-[#4EBCED] mb-4">
                <Rocket size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">mytSimple™</h3>
              <div className="text-2xl font-bold text-[#4EBCED] mb-4">
                $147<span className="text-base font-normal text-[#818284]">/month</span>
              </div>
              <p className="text-[#818284] mb-6">
                Our flagship product. Get a professional one-page website and foundational marketing automation, instantly personalized and deployed via our exclusive mytSimple™ Launchpad.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Personalized One-Page Website via Launchpad</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Automated Lead Capture Forms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Google Business Profile Integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Core Analytics Dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Mobile-Responsive Design</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Essential Security & Hosting</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link 
                  to="/launchpad"
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  Launch with mytSimple™
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* mytSimple+™ */}
            <div className="card relative shadow-lg border-t-4 border-[#45899E]" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#45899E] text-white px-4 py-1 text-sm">
                Enhanced
              </div>
              <div className="text-[#45899E] mb-4">
                <Zap size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">mytSimple+™</h3>
              <div className="text-2xl font-bold text-[#45899E] mb-4">
                $247<span className="text-base font-normal text-[#818284]">/month</span>
              </div>
              <p className="text-[#818284] mb-6">
                The next tier of our software suite. Includes all mytSimple™ features plus advanced CRM integration and email marketing campaigns powered by our core GHL automation engine.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-2 flex-shrink-0 mt-1" />
                  <span><strong>All mytSimple™ features</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-2 flex-shrink-0 mt-1" />
                  <span>Automated Lead Nurturing & CRM</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-2 flex-shrink-0 mt-1" />
                  <span>Email Marketing Engine Setup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-2 flex-shrink-0 mt-1" />
                  <span>Social Media Integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-2 flex-shrink-0 mt-1" />
                  <span>Advanced SEO & Analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#45899E] mr-2 flex-shrink-0 mt-1" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link 
                  to="/launchpad"
                  className="btn btn-primary w-full flex items-center justify-center bg-[#45899E] text-white hover:bg-[#3a7485]">
                  Upgrade to mytSimple+™
                </Link>
              </div>
            </div>

            {/* mytQuick Launch™ */}
            <div className="card relative shadow-lg border-t-4 border-[#464E54]" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#464E54] text-white px-4 py-1 text-sm">
                Complete Launch
              </div>
              <div className="text-[#464E54] mb-4">
                <Rocket size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">mytQuick Launch™</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="font-bold">Complete Digital Startup Kit</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#464E54]">
                    <span className="text-base font-normal text-[#818284]">Packages starting at </span>
                  </div>
                  <div className="text-xl font-bold text-[#464E54]">
                    $997<span className="text-base font-normal text-[#818284]"> setup + 297/mo</span>
                  </div>
                </div>
              </div>
              <p className="text-[#818284] mb-6">
                A complete, productized digital startup kit. The process begins with our mytSimple™ Launchpad, our exclusive tool for instantly capturing your brand's core identity—your logo, colors, and key messaging. Our team then uses this foundation to build out your complete, multi-page website and essential launch services, providing a seamless digital foundation for your new venture.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Complete Digital Launch Platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Business email setup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Social Media Profile Creation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Foundational Marketing Automation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Go-to-Market Strategy Session</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link to="/book-discovery-call" className="btn btn-primary w-full flex items-center justify-center bg-[#464E54] text-white hover:bg-[#353c41]">
                  Schedule a Launch Consult
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss which solution best fits your business needs and goals.
            Our team is here to help you make the right choice.
          </p>
          <div>
            <a href="#contact" className="btn bg-white text-[#4EBCED] hover:bg-[#F3F3F3]">
              Schedule a Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuickStartPage;