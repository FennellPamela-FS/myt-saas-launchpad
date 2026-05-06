import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Code, BarChart3, Users, ArrowRight } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const HomePage: React.FC = () => {
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
      {/* Hero Section with Background Image and Gradient Overlay */}
      <section 
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/msgsndr/5WkCjdNQApiEdU3hlSMc/media/65f133295ad57b70ef5a0cdd.png')`
        }}
      >
        {/* Primary Gradient Overlay - matches other hero sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F3F3F3]/90 to-[#e6f4fa]/85"></div>
        
        {/* Secondary Brand Color Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4EBCED]/20 via-transparent to-[#45899E]/20"></div>
        
        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight appear text-[#464E54]">
              YOU WROTE THE VISION, <br />
              <span className="text-[#4EBCED]">WE HELP TO MAKE IT PLAIN.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 appear text-[#464E54]" style={{ animationDelay: '0.2s' }}>
              When our team becomes your team, we bring your vision to life—transforming your business with a powerful combination of technology, process optimization, and education.
            </p>
            <div className="appear flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: '0.4s' }}>
              <Link to="/launchpad" className="btn btn-primary bg-gradient-to-r from-[#4EBCED] to-[#45899E] hover:from-[#3e96be] hover:to-[#3a7485] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Experience the Launchpad Demo
              </Link>
              <Link to="/book-discovery-call" className="btn btn-outline border-2 border-white hover:bg-white hover:border-white hover:text-[#4EBCED] backdrop-blur-sm bg-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Let's Talk About Your Vision
              </Link>
            </div>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />  
      </section>

      {/* What We Do Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 staggered-item" ref={addToRefs}>
              Stop Juggling Complex Software. Start Growing Your Business.
            </h2>
            <p className="text-lg max-w-3xl mx-auto staggered-item" ref={addToRefs}>
              We build the integrated digital ecosystem your business needs to thrive. Our solutions, powered by our proprietary ASK framework, unify your marketing, sales, and operations into one streamlined system, giving you the power of enterprise-level technology without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="card card-hover staggered-item" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <BarChart3 size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Unified Marketing & Sales</h3>
              <p>Manage your entire customer journey from a single, powerful command center.</p>
            </div>
            
            <div className="card card-hover staggered-item" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Users size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Customer Journeys</h3>
              <p>Nurture leads and engage customers with intelligent, automated workflows that save you time.</p>
            </div>
            
            <div className="card card-hover staggered-item" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Code size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Data-Driven Decisions</h3>
              <p>Gain clear insights into what's working so you can optimize your strategy and accelerate growth.</p>
            </div>
          </div>

          {/* Launchpad Feature */}
          <div className="bg-gradient-to-r from-[#4EBCED] to-[#45899E] rounded-xl p-8 md:p-12 text-white shadow-xl staggered-item" ref={addToRefs}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Introducing the mytSimple™ Launchpad
                </h3>
                <h4 className="text-xl font-medium mb-4">
                  Your Business Online in Minutes!
                </h4>
                <p className="mb-6">
                  Get your startup or small business online fast with our intuitive Launchpad. 
                  Input your business details, see your professional website update in real-time, 
                  and launch instantly with our mytSimple™ package. Powerful marketing, simplified. This experience is powered by The ASK, our proprietary "app factory" that ensures your site is built on a secure, scalable, and powerful foundation.
                </p>
                <Link to="/launchpad" className="btn bg-white text-[#4EBCED] hover:bg-[#F3F3F3] inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Experience the Launchpad Demo
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
              <div className="relative">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="aspect-w-16 aspect-h-9 bg-[#F3F3F3] rounded overflow-hidden">
                    <div className="p-4 flex items-center justify-center h-full">
                      <p className="text-[#464E54] text-center">
                        Launchpad Preview: See your website come to life as you build it
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-lg shadow-lg transform rotate-6">
                  <div className="text-[#464E54] text-sm">
                    <span className="font-semibold">mytSimple™</span> - Launch in minutes!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section bg-[#F3F3F3]">        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 staggered-item" ref={addToRefs}>
              Our Dual Mission
            </h2>
            <h3 className="text-2xl font-bold mb-4">Innovate for Business, Educate for the Future!</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 staggered-item" ref={addToRefs}>
            <p className="text-lg mb-8 staggered-item" ref={addToRefs}>
              At the heart of mytCreative is a dual mission. <em>We exist to innovate and educate.</em> We innovate for today's businesses by building scalable technology like The ASK, our proprietary framework that powers every solution we deliver.
            </p>
              <p className="mb-4">
                Simultaneously, we educate for tomorrow's workforce through our Digital GAP Program. Every product we build funds and creates hands-on training for youth in our state-approved Apprenticeship NC curriculum. This isn't just a philosophy; it's our business model. When you partner with us, you're not only getting a powerful digital solution—you're investing in the next generation of local tech talent.
              </p>
            </div> 
            <div className="order-1 md:order-2 bg-[#4EBCED] rounded-lg p-6 text-white shadow-lg staggered-item" ref={addToRefs}>
              <h3 className="text-2xl font-bold mb-4">Why Choose mytCreative?</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <CheckCircle size={24} className="mr-3 flex-shrink-0" />
                  <span>Integrated AI Automation Strategy combining technology, process optimization, and education.</span>
                </li>
                <li className="flex">
                  <CheckCircle size={24} className="mr-3 flex-shrink-0" />
                  <span>Expertise in building sustainable, scalable digital ecosystems powered by intelligent automation.</span>
                </li>
                <li className="flex">
                  <CheckCircle size={24} className="mr-3 flex-shrink-0" />
                  <span>Commitment to client empowerment through knowledge transfer.</span>
                </li>
                <li className="flex">
                  <CheckCircle size={24} className="mr-3 flex-shrink-0" />
                  <span>Dedication to growing the next generation of digital creative minds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#45899E] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss how mytCreative can help you achieve your goals. From rapid launches 
            with the mytSimple™ Launchpad to comprehensive digital transformation strategies, 
            we're here to support you.
          </p>
          <div>
            
            <Link to="/book-discovery-call" className="btn bg-white text-[#464E54] hover:bg-[#F3F3F3] mr-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Schedule a Consultation
            </Link>
            <Link to="/solutions-hub" className="btn bg-[#4EBCED] text-white hover:bg-[#3e96be] mt-4 md:mt-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Explore Our Solutions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;