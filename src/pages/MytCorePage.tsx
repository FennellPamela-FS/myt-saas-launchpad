import React, { useEffect, useRef } from 'react';
import { Brain, Zap, Code, Layout, BarChart3, Workflow } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const MytCorePage: React.FC = () => {
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
              Meet the mytCore Collective: 
              <span className="block text-[#4EBCED]">AI-Powered Innovation at Your Service</span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              When our team becomes your team, it's not just about our human experts. We leverage 
              the cutting edge of AI through our mytCore Collective – a specialized suite of AI agents working alongside our human experts. They are our internal AI Automation team, ensuring your solutions are strategic, efficient, and perfectly tailored to your vision.
            </p>
            {/* <div className="appear" style={{ animationDelay: '0.4s' }}>
              <img 
                src="https://storage.googleapis.com/msgsndr/5WkCjdNQApiEdU3hlSMc/media/6668978c73d3b03e3242f577.png"
                alt="mytCore Collective"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
            </div> */}
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* AI Agents Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
              Your AI Automation Engineer
            </h2>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              Together, our mytCore Collective functions as a holistic AI Automation Engineer, analyzing your strategy (Axion), streamlining your operations (Omar), designing your user experience (Dave), configuring your marketing automation (Ava), and integrating your technology (Isaac & Liam).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ava */}
            <div className="card" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <BarChart3 size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Ava</h3>
              <p className="text-[#464E54] font-medium mb-3">GHL & Automation Strategy</p>
              <p className="text-[#818284]">
                Specializes in optimizing GoHighLevel configurations and creating efficient 
                marketing automation workflows. Ava ensures your systems are working seamlessly 
                together.
              </p>
            </div>

            {/* Axion */}
            <div className="card" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Brain size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Axion</h3>
              <p className="text-[#464E54] font-medium mb-3">Strategic Frameworks & Insights</p>
              <p className="text-[#818284]">
                Analyzes industry best practices and frameworks to ensure your solutions are 
                built on solid strategic foundations, aligned with market success principles.
              </p> 
            </div>

            {/* Liam */}
            <div className="card" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Code size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Liam</h3>
              <p className="text-[#464E54] font-medium mb-3">Lead Development AI</p>
              <p className="text-[#818284]">
                Focuses on Premium Custom Solutions and leads development strategies, ensuring 
                your systems are optimized for conversion and growth.
              </p>
            </div>

            {/* Omar */}
            <div className="card" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Workflow size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Omar</h3>
              <p className="text-[#464E54] font-medium mb-3">Operations & Process AI</p>
              <p className="text-[#818284]">
                Streamlines operational processes and workflows, ensuring efficiency in every 
                aspect of your digital solution implementation.
              </p>
            </div>

            {/* Dave */}
            <div className="card" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Layout size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Dave</h3>
              <p className="text-[#464E54] font-medium mb-3">UI/UX & Design AI</p>
              <p className="text-[#818284]">
                Creates intuitive and engaging user experiences, ensuring your digital presence 
                is both beautiful and functional.
              </p>
            </div>

            {/* Isaac */}
            <div className="card" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Zap size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Isaac</h3>
              <p className="text-[#464E54] font-medium mb-3">API Integration AI</p>
              <p className="text-[#818284]">
                Specializes in connecting different systems and ensuring smooth data flow 
                between various platforms and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="section bg-[#F3F3F3]">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" ref={addToRefs}>
              How We Work Together: The mytSimple™ Launchpad Story
            </h2>
            
            <div className="card p-8" ref={addToRefs}>
              <p className="mb-6">
                When we created the mytSimple™ Launchpad to help businesses launch faster, 
                our mytCore Collective worked in perfect harmony:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Brain size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Strategic Vision</h4>
                    <p className="text-[#818284]">
                      Axion identified the core need for speed and visual feedback in the 
                      website creation process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <BarChart3 size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Automation Architecture</h4>
                    <p className="text-[#818284]">
                      Ava mapped out how the GHL snapshot needed to be structured for dynamic 
                      updates and optimal performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Layout size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">User Experience Design</h4>
                    <p className="text-[#818284]">
                      Dave designed the user-friendly app interface and the matching GHL template, 
                      ensuring a seamless experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Code size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Technical Integration</h4>
                    <p className="text-[#818284]">
                      Liam and Isaac architected the data flow from app to GHL, ensuring smooth 
                      operation and reliable performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Workflow size={24} className="text-[#4EBCED] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Process Optimization</h4>
                    <p className="text-[#818284]">
                      Omar streamlined the backend process for account provisioning with the 
                      Launchpad, making deployment efficient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Future of Digital Solutions
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Partner with mytCreative and let our combined human and AI expertise elevate your 
            business to new heights.
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

export default MytCorePage;