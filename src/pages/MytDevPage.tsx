import React, { useEffect, useRef } from 'react';
import { Users, CheckCircle, Code, Workflow, Brain, ArrowRight } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const MytDevPage: React.FC = () => {
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
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight appear">
              Power Your Projects with Expert Talent:
              <span className="block text-[#4EBCED]">Introducing mytDev Connect</span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              mytDev Connect, a mytCreative Initiative, connects businesses like yours with skilled, 
              vetted software developers and engineers. Whether you need talent for a specific project 
              or ongoing technical expertise, we bridge the gap, providing access to proficient 
              professionals ready to make an impact.
            </p>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* How It Works Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
              How mytDev Connect Works for Your Business
            </h2>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              Whether you need a React developer, a GHL expert, or an AI Automation Specialist to analyze and streamline your internal processes, we connect you with the right professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Brain size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Define Your Needs</h3>
              <p className="text-[#818284]">
                Tell us your project scope, required technical skills, and desired engagement model. 
                Whether it's React, Next.js, API development, or GHL expertise, we'll understand 
                your needs.
              </p>
            </div>

            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Users size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Matching & Vetting</h3>
              <p className="text-[#818284]">
                We source developers from our community, ensuring they have the right skills and 
                problem-solving abilities. Our thorough vetting process guarantees quality.
              </p>
            </div>

            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Code size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Engagement</h3>
              <p className="text-[#818284]">
                Engage top-tier talent on your terms, from short-term projects to longer 
                collaborations. Scale your technical team as your needs evolve.
              </p>
            </div>

            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Workflow size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Simplified Administration</h3>
              <p className="text-[#818284]">
                We handle financial transactions and contractual arrangements, ensuring timely 
                payment and compliance. Focus on your project, not paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-[#F3F3F3]">
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
              The mytDev Connect Advantage
            </h2>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              Why businesses choose mytDev Connect for their technical talent needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md" ref={addToRefs}>
              <h3 className="text-2xl font-bold mb-6">For Businesses</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Access Vetted Professionals</h4>
                    <p className="text-[#818284]">
                      Gain immediate access to a pool of software developers and engineers assessed 
                      for skills and professionalism.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Unmatched Flexibility</h4>
                    <p className="text-[#818284]">
                      Scale your technical team as needed without traditional hiring overhead.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Reduced Hiring Burden</h4>
                    <p className="text-[#818284]">
                      Save time and resources on recruitment; we find the right match.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">MTE Proficiency</h4>
                    <p className="text-[#818284]">
                      Option for developers familiar with the mytCreative Technology Ecosystem 
                      for seamless integration.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md" ref={addToRefs}>
              <h3 className="text-2xl font-bold mb-6">For Developers</h3>
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-3">Join Our Network of Innovators</h4>
                <p className="text-[#818284]">
                  Are you a talented software developer or engineer passionate about solving 
                  real-world problems? Join the mytDev Connect network.
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Access Diverse Projects</h4>
                    <p className="text-[#818284]">
                      Expand your portfolio across industries and technologies.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Professional Growth</h4>
                    <p className="text-[#818284]">
                      Join a community committed to advancing digital skills and continuous learning.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Fair & Timely Compensation</h4>
                    <p className="text-[#818284]">
                      Clear contracts and managed payments for peace of mind.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Alignment Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center" ref={addToRefs}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Fulfilling Our Mission, Together
            </h2>
            <p className="text-lg mb-8">
              mytDev Connect is a direct extension of mytCreative's commitment: To "improve how 
              businesses operate through technology" – by providing the precise technical talent 
              needed. And "while advancing future generations of digital creative minds" – by 
              creating valuable opportunities for developers to apply and grow their skills.
            </p>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Ready to Build or Ready to Create?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 text-[#464E54]">
              <h3 className="text-2xl font-bold mb-4">Need Expert Tech Talent?</h3>
              <p className="mb-6">
                Let mytDev Connect find the right developers or engineers to bring your technical 
                vision to life. Reduce hiring complexities and access vetted professionals on demand.
              </p>
              <a 
                href="#contact" 
                className="btn btn-primary flex items-center justify-center"
              >
                Find Talent for Your Project
                <ArrowRight size={18} className="ml-2" />
              </a>
            </div>

            <div className="bg-white rounded-lg p-8 text-[#464E54]">
              <h3 className="text-2xl font-bold mb-4">Join Our Developer Network</h3>
              <p className="mb-6">
                Become part of the mytDev Connect community and get access to exciting project 
                opportunities that match your skills and career goals.
              </p>
              <a 
                href="#contact" 
                className="btn btn-primary flex items-center justify-center"
              >
                Apply as a Developer
                <ArrowRight size={18} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MytDevPage;