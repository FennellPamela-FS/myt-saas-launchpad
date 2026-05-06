import React, { useEffect, useRef } from 'react';
import { CheckCircle, Star, Crown } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const PremiumSolutionsPage: React.FC = () => {
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
              Premium Solutions:
              <span className="block text-[#4EBCED]">Strategic Growth & Full-Service Transformation</span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              For established businesses and organizations ready for significant growth, 
              custom development, and dedicated strategic partnership.
            </p>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" /> 
      </section>

      {/* Solutions Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guided Journey™ */}
            <div className="card relative shadow-lg border-t-4 border-[#4EBCED]" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#4EBCED] text-white px-4 py-1 text-sm">
                Strategic Growth
              </div>
              <div className="text-[#4EBCED] mb-4">
                <Star size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Guided Journey™</h3>
              <div className="text-2xl font-bold text-[#4EBCED] mb-4">
                $5,000<span className="text-base font-normal text-[#818284]"> setup</span>
                <br />
                $597<span className="text-base font-normal text-[#818284]">/month</span>
              </div>
              <p className="text-[#818284] mb-6">
                For businesses with complex needs that require a tailored solution. The Guided Journey is a strategic implementation that results in a custom application built on our powerful ASK platform. Our team works with you to architect a solution that meets your specific growth objectives.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Strategic Planning & Roadmap</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Custom Application Scoping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Bespoke Feature Development on The ASK Platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Advanced Systems & API Integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Dedicated Product Manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Quarterly Strategic Reviews</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#4EBCED] mr-2 flex-shrink-0 mt-1" />
                  <span>Premium Support & Maintenance</span>
                </li>
              </ul>
              <div className="mt-auto">
                <button className="btn btn-primary w-full">
                  Start Your Guided Journey™
                </button>
              </div>
            </div>

            {/* Concierge Experience™ */}
            <div className="card relative shadow-lg border-t-4 border-[#464E54]" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#464E54] text-white px-4 py-1 text-sm">
                Premium Service
              </div>
              <div className="text-[#464E54] mb-4">
                <Crown size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Concierge Experience™</h3>
              <div className="text-2xl font-bold text-[#464E54] mb-4">
                $15,000<span className="text-base font-normal text-[#818284]"> setup</span>
                <br />
                $3,497<span className="text-base font-normal text-[#818284]">/month</span>
              </div>
              <p className="text-[#818284] mb-6">
                The ultimate enterprise solution. The Concierge Experience delivers a fully bespoke application, architected from the ground up on our ASK platform. Our team acts as your dedicated implementation partner, translating your vision into a powerful, scalable technology asset for your business.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Full Application Architecture & Development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Dedicated Development & Implementation Team</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Strategic Guidance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Unlimited Feature & Integration Scoping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Enterprise-Grade Support & SLA</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Complete Digital Transformation Roadmap</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-[#464E54] mr-2 flex-shrink-0 mt-1" />
                  <span>Access to the Full mytCreative Tech Stack</span>
                </li>
              </ul>
              <div className="mt-auto">
                <button className="btn bg-[#464E54] text-white hover:bg-[#353c41] w-full">
                  Request a Concierge Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#45899E] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Strategic Growth?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss how our premium solutions can transform your business and drive 
            significant growth. Schedule a consultation with our team today.
          </p>
          <div>
            <a href="#contact" className="btn bg-white text-[#464E54] hover:bg-[#F3F3F3]">
              Schedule Your Strategy Session
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default PremiumSolutionsPage;