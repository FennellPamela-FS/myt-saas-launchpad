import React, { useEffect, useRef } from 'react';
import { GraduationCap, Heart, Users, CheckCircle } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const CommunityImpactPage: React.FC = () => {
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
              Building Tomorrow's
              <span className="block text-[#4EBCED]">AI Automation Professionals </span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              Our curriculum is designed not just to teach web development, but to cultivate the most sought-after professional in today's tech market: <em>The AI Automation Engineer.</em> 
            </p>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Youth Development Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div ref={addToRefs}>
              <div className="text-[#4EBCED] mb-6">
                <GraduationCap size={48} />
              </div>
              <h2 className="text-3xl text-[#4EBCED] font-bold mb-4">
               Our Digital GAP Progam: 
              <span className="block text-[#464E54]">Advancing Future Generations of Digital Creative Minds. </span>
              </h2>
              <p className="mb-6">
                Through hands-on projects, our 'GAP Fillers' learn to analyze business needs, design workflows, and implement AI-powered automations using our technology ecosystem. They learn to be the essential bridge between advanced technology and practical business results.
              </p>
              <div className="space-y-6">
                <div className="bg-[#f5f5f5] p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Tier 1: Novice</h3>
                  <p>
                    Assisting with foundational tasks like GHL configurations, basic website testing, 
                    and digital asset creation under guidance.
                  </p>
                </div>
                <div className="bg-[#f5f5f5] p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Tier 2: Experienced</h3>
                  <p>
                    Contributing to more complex projects like WordPress/Divi customizations and 
                    advanced website features.
                  </p>
                </div>
                <div className="bg-[#f5f5f5] p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Tier 3: Advanced</h3>
                  <p>
                    Participating in custom development, API integrations, and specialized solution 
                    building.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative" ref={addToRefs}>
              <img 
                src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/678fd2318d995591bc82f58f.jpeg" 
                alt="Youth learning technology"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-lg font-bold text-[#4EBCED]">
                  Building Tomorrow's Tech Leaders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faith-Based Support Section */}
      <section className="section bg-[#F3F3F3]">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1" ref={addToRefs}>
              <img 
                src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/64e44d17affca47bad4c5a4f.png"
                alt="Community gathering"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-6">
                <Heart size={48} />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Support for Faith-Based & Community Organizations
              </h2>
              <p className="mb-6">
                mytCreative has a special focus on supporting faith-based organizations and other 
                community-focused groups. We understand the unique challenges and opportunities 
                these organizations face and offer tailored digital transformation strategies to 
                help them amplify their message, manage their communities, and achieve their 
                mission-driven goals.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Custom digital solutions for ministry management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Community engagement platforms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Event management systems</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <span>Online giving and donation platforms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" ref={addToRefs}>
              Our Community Impact
            </h2>
            <h3 className="text-3xl font-bold mb-4" ref={addToRefs}>
              Become a Gap Filler and bring our impact into reality.
            </h3>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              Through our initiatives and partnerships, we're making a real difference in our community and helping shape the future of technology education. We believe in bridging the digital divide and empowering individuals through hands-on experience and mentorship.
            </p>
          </div>


          <div className="space-y-6">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Advancing Future Talent:</h3>
              <p>
                We're committed to advancing future generations of digital creative minds through our youth development program. Most recently, two of our returning Digital GAP Program participants had the opportunity to serve as mentors in the "Tech for Teens" summer camp. We developed a full-stack app, available at https://options2win.com, to guide students through AI Automation in developing their MVP for the in-program pitch contest.
              </p>
            </div>
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Supporting Our Community:</h3>
              <p>
                We collaborate with a diverse network of organizations to expand our reach and provide tailored solutions. We've partnered with organizations like OIC, Inc. and Living Better Life, LLC to bring programs like the "Tech for Teens" summer camp to life. We also work closely with the American Red Cross, providing technology assistance and volunteer support. Our future initiative is to educate our young professionals about volunteering as an admin with technical experience in our Local Red Cross office.
              </p>
            </div>
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Driving Business and Social Good:</h3>
              <p>
                Our model creates a win-win scenario by providing hands-on experience for young people while delivering cost-effective digital solutions to small businesses, faith-based organizations, and underserved communities. We help businesses grow and scale while encouraging youth engagement in their community's economic development.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Youth Development Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div ref={addToRefs}>
              <div className="text-[#4EBCED] mb-6">
                <GraduationCap size={48} />
              </div>
              <h2 className="text-3xl text-[#4EBCED] font-bold mb-4">
              A History of 
              <span className="block text-[#464E54]">Innovation and Education: </span>
              </h2>
              <p className="mb-6">
                Our mission to use technology to bridge the gap between youth and business owners has been a driving force from the beginning. Our curriculum focuses on teaching problem-solving skills through coding, custom computer programming, and web development. This commitment was demonstrated in 2022 when we initiated and led the inaugural STEM Cohort. This was an 8-week program focusing on foundational web development concepts, including HTML, CSS, and JavaScript, for students aged 15-22.
              </p>                
            </div>
            <div className="relative" ref={addToRefs}>
              <img 
                src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/64e44d1ed6dc5b27dc779cd5.png"
                alt="Youth learning technology"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-lg font-bold text-[#4EBCED]">
                  Building Tomorrow's Tech Leaders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner With Us for Community Good
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're interested in supporting our youth programs or need digital solutions 
            for your community organization, we're here to help.
          </p>
          <div>
            <a href="#contact" className="btn bg-white text-[#4EBCED] hover:bg-[#F3F3F3]">
              Learn More About Our Initiatives
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunityImpactPage;