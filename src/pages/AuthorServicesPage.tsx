import React, { useEffect, useRef } from 'react';
import { CheckCircle, BookOpen, FileEdit, Layout, Image, GraduationCap as Graduation, User } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const AuthorServicesPage: React.FC = () => {
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
              Start. Launch. Soar:
              <span className="block text-[#4EBCED]">Digital Presence Packages for Authors</span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              Elevate your online presence with our mytCreative Digital Presence Packages. 
              Whether you're an aspiring author or a content creator, we offer tailored solutions 
              to amplify your digital footprint.
            </p>
            <div className="appear" style={{ animationDelay: '0.4s' }}>
              <a href="#packages" className="btn btn-primary">
                View Our Packages
              </a>
            </div>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Packages Section */}
      <section id="packages" className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 staggered-item" ref={addToRefs}>
              Choose Your Digital Presence Package
            </h2>
            <p className="text-lg max-w-3xl mx-auto staggered-item" ref={addToRefs}>
              Select from three dynamic packages designed to meet your specific needs as an author or content creator.
              Each package builds upon the previous one, offering increasing levels of digital presence and engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Package 1: Author Start */}
            <div className="card relative shadow-lg border-t-4 border-[#45899E] transition-all duration-300 hover:shadow-xl staggered-item" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#45899E] text-white px-4 py-1 text-sm">
                Basic
              </div>
              <div className="text-[#45899E] mb-4">
                <FileEdit size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Author Start</h3>
              <p className="text-[#818284] mb-6">
                Our foundational package ensures your content is polished to perfection.
              </p>
              <div className="mb-8">
                <p className="mb-4">
                  With our creative editing and formatting services, we'll refine your materials, 
                  guaranteeing a professional and cohesive presentation. Ideal for those seeking 
                  essential enhancements to their written work.
                </p>
                <h4 className="font-bold text-lg mb-3">What's included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#45899E] mr-2" />
                    <span>Professional Editing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#45899E] mr-2" />
                    <span>Expert Formatting</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <a 
                  href="/author-start-payment"
                  className="btn btn-outline border-[#45899E] text-[#45899E] hover:bg-[#45899E] hover:text-white w-full inline-block text-center"
                >
                  Get Started
                </a>
              </div>
            </div>
            
            {/* Package 2: Author Launch */}
            <div className="card relative shadow-lg border-t-4 border-[#4EBCED] transition-all duration-300 hover:shadow-xl transform md:scale-105 z-10 staggered-item" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#4EBCED] text-white px-4 py-1 text-sm">
                Popular
              </div>
              <div className="text-[#4EBCED] mb-4">
                <Layout size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Author Launch</h3>
              <p className="text-[#818284] mb-6">
                Make a powerful entrance into the digital landscape.
              </p>
              <div className="mb-8">
                <p className="mb-4">
                  Building on the foundation of Package 1, this comprehensive offering propels your online 
                  presence to new heights. Introduce your work with a dedicated landing page that captivates 
                  your audience and showcase your unique identity through customized social graphics.
                </p>
                <h4 className="font-bold text-lg mb-3">What's included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#4EBCED] mr-2" />
                    <span>Everything in Author Start</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#4EBCED] mr-2" />
                    <span>Custom Landing Page</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#4EBCED] mr-2" />
                    <span>Social Media Graphics</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <a 
                  href="/author-launch-payment"
                  className="btn btn-primary w-full inline-block text-center"
                >
                  Launch Your Presence
                </a>
              </div>
            </div>
            
            {/* Package 3: Author Premium */}
            <div className="card relative shadow-lg border-t-4 border-[#464E54] transition-all duration-300 hover:shadow-xl staggered-item" ref={addToRefs}>
              <div className="absolute top-0 right-0 bg-[#464E54] text-white px-4 py-1 text-sm">
                Premium
              </div>
              <div className="text-[#464E54] mb-4">
                <Graduation size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Author Premium</h3>
              <p className="text-[#818284] mb-6">
                Go above and beyond with a full suite of services.
              </p>
              <div className="mb-8">
                <p className="mb-4">
                  Elevate your digital presence with a dedicated landing page, captivating social 
                  graphics, and an exclusive online course based on your book. Tailored for those 
                  seeking the highest level of sophistication and educational offerings.
                </p>
                <h4 className="font-bold text-lg mb-3">What's included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#464E54] mr-2" />
                    <span>All features of Author Launch</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#464E54] mr-2" />
                    <span>Online Course Based on Book</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-[#464E54] mr-2" />
                    <span>Premium Support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <a 
                  href="/author-premium-payment"
                  className="btn bg-[#464E54] text-white hover:bg-[#353c41] w-full inline-block text-center"
                >
                  Go Premium
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-[#F3F3F3]">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 staggered-item" ref={addToRefs}>
              Meet Your Author Success Team
            </h2>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              Our dedicated professionals are committed to elevating your content and digital presence.
              With expertise in education, editing, design, and digital solutions, we're here to support
              your journey as an author or content creator.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {/* Dr. Anita Mckaney */}
            <div className="card group hover:shadow-xl transition-all duration-300 staggered-item" ref={addToRefs}>
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/655c12430226f0eb0708aa7a.png"
                  alt="Dr. Anita Mckaney"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-[#464E54]">Dr. Anita Mckaney, CAO</h3>
                <h4 className="text-lg text-[#45899E] font-medium mb-3">Director of Author Services</h4>
                <p className="mb-4 text-[#818284] leading-relaxed">
                  Anita brings extensive experience as an educator, author, and editor to help you
                  refine your content and develop a compelling digital presence that resonates with
                  your audience.
                </p>
                <div className="flex flex-wrap justify-center">
                  <span className="bg-[#e6f4fa] text-[#45899E] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Educator
                  </span>
                  <span className="bg-[#e6f4fa] text-[#45899E] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Author
                  </span>
                  <span className="bg-[#e6f4fa] text-[#45899E] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Editor
                  </span>
                </div>
              </div>
            </div>

            {/* Dr. Pamela Bynum */}
            <div className="card group hover:shadow-xl transition-all duration-300 staggered-item" ref={addToRefs}>
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/68915446afc66b242e20e01a.png"
                  alt="Dr. Pamela Bynum"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-[#464E54]">Dr. Pamela Bynum</h3>
                <h4 className="text-lg text-[#4EBCED] font-medium mb-3">Digital Solutions Developer</h4>
                <p className="mb-4 text-[#818284] leading-relaxed">
                  Pamela translates an author's vision into a stunning digital presence. From manuscript formatting to book cover design, she uses our mytCreative Digital Center to ensure every project is both technically flawless and visually beautiful.
                </p>
                <div className="flex flex-wrap justify-center">
                  <span className="bg-[#e6f4fa] text-[#4EBCED] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Book Cover & Layout Design
                  </span>
                  <span className="bg-[#e6f4fa] text-[#4EBCED] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Manuscript Formatting
                  </span>
                </div>
              </div>
            </div>

            {/* Rose Williams */}
            <div className="card group hover:shadow-xl transition-all duration-300 staggered-item" ref={addToRefs}>
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac9f2737d8eb51f1ce.png"
                  alt="Rose Williams"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-[#464E54]">Rose Williams</h3>
                <h4 className="text-lg text-[#464E54] font-medium mb-3">Author Services</h4>
                <p className="mb-4 text-[#818284] leading-relaxed">
                  Rose specializes in supporting authors through their digital journey, providing expert guidance 
                  on content development, formatting, and creating compelling author platforms that connect with readers.
                </p>
                <div className="flex flex-wrap justify-center">
                  <span className="bg-[#e6f4fa] text-[#464E54] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Content Development
                  </span>
                  <span className="bg-[#e6f4fa] text-[#464E54] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Author Support
                  </span>
                  <span className="bg-[#e6f4fa] text-[#464E54] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    Digital Platforms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="text-center mt-16 staggered-item" ref={addToRefs}>
            <div className="inline-block bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-3">The Write Choice for Exceptional Content</h3>
              <p className="mb-6">
                Partner with our expert team to transform your written work into a compelling digital presence
                that captivates your audience and elevates your brand.
              </p>
              <a href="#contact" className="btn btn-primary">
                Start Your Author Journey
              </a>
            </div>
          </div> */} 
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 staggered-item" ref={addToRefs}>
              What Our Authors Say
            </h2>
            <p className="text-lg max-w-3xl mx-auto staggered-item" ref={addToRefs}>
              Hear from authors who have transformed their digital presence with our packages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-[#F3F3F3] staggered-item" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <BookOpen size={32} />
              </div>
              <blockquote className="mb-4">
                <p className="italic">
                  "The Author Launch package completely transformed my online presence. The landing page they created
                  perfectly captures the essence of my book, and the social graphics have significantly increased
                  my engagement on social media."
                </p>
              </blockquote>
              <div className="font-bold">— Sarah J., Author of "Morning Reflections"</div>
            </div>

            <div className="card bg-[#F3F3F3] staggered-item" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <BookOpen size={32} />
              </div>
              <blockquote className="mb-4">
                <p className="italic">
                  "As a first-time author, I was overwhelmed by the editing and formatting process. The Author Start
                  package provided exactly what I needed to polish my manuscript and prepare it for publication."
                </p>
              </blockquote>
              <div className="font-bold">— Michael T., Author of "Business Reimagined"</div>
            </div>

            <div className="card bg-[#F3F3F3] staggered-item" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <BookOpen size={32} />
              </div>
              <blockquote className="mb-4">
                <p className="italic">
                  "The online course created through the Author Premium package has been a game-changer. It's opened
                  up a new revenue stream and allowed me to connect with my audience in a more meaningful way."
                </p>
              </blockquote>
              <div className="font-bold">— Elena R., Author of "Mindful Leadership"</div>
            </div>
          </div>
        </div>
      </section>  */} 

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Amplify Your Author Platform?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss how mytCreative can help you achieve your goals as an author or content creator.
            From professional editing to comprehensive digital presence packages, we're here to support your journey.
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

export default AuthorServicesPage;