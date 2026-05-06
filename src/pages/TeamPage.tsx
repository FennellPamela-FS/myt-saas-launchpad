import React, { useEffect, useRef } from 'react';
import { Mail, Linkedin, Twitter, Play, Users, Heart, Target } from 'lucide-react';
import WaveDecoration from '../components/ui/WaveDecoration';

const TeamPage: React.FC = () => {
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

  const teamMembers = [
    {
      name: "Dr. Pamela Bynum",
      role: "Founder & CEO",
      bio: "Visionary leader with over 15 years of experience in digital transformation and business automation. Dr. Bynum founded mytCreative with the mission to bridge the gap between advanced technology and practical business solutions.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/68915446afc66b242e20e01a.png",
      email: "#",
      linkedin: "https://www.linkedin.com/in/pfennell-bynum/",
      twitter: "#"
    },
    {
      name: "Dr. Anita Mckaney",
      role: "CAO & Director of Author Services",
      bio: "Full-stack developer specializing in React, Node.js, and cloud architecture. Sarah leads our development team in creating scalable solutions that power our clients' digital transformation.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/655c12430226f0eb0708aa7a.png",
      email: "sarah@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Velma Fennell",
      role: "CFO",
      bio: "Creative designer with a passion for user-centered design. David ensures that every digital solution we create is not only functional but also intuitive and visually compelling.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac9f2737d8eb51f1ce.png",
      email: "david@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Crystal Wimes-Anderson",
      role: "Community Impact Strategist",
      bio: "Creative designer with a passion for user-centered design. David ensures that every digital solution we create is not only functional but also intuitive and visually compelling.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/655c1243fb2d8ef8a4691493.png",
      email: "david@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Myrna Miott",
      role: "Sales & Director of Customer Success",
      bio: "Creative designer with a passion for user-centered design. David ensures that every digital solution we create is not only functional but also intuitive and visually compelling.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac902503823e7a84f3.png",
      email: "david@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Anelka Arnold-Allums",
      role: "Technical Project Manager",
      bio: "Experienced project manager who ensures seamless execution of client projects. Lisa coordinates between teams and maintains clear communication throughout the development process.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/68916e6c746eb867da615ceb.png",
      email: "lisa@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Tisha Di Fresco",
      role: "Web Developer",
      bio: "Full-stack developer specializing in React, Node.js, and cloud architecture. Sarah leads our development team in creating scalable solutions that power our clients' digital transformation.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/6891674b9025035e0b7a8701.png",
      email: "sarah@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Ny'Shae Carter",
      role: "Web Developer & Business Strategist",
      bio: "Strategic consultant with expertise in digital transformation and process optimization. Michael works closely with clients to identify opportunities and develop comprehensive growth strategies.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac9f2737d8eb51f1ce.png",
      email: "michael@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Rose Williams",
      role: "Author Services",
      bio: "Expert in GoHighLevel and marketing automation strategies. Emily helps our clients streamline their marketing processes and maximize their customer engagement.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac9f2737d8eb51f1ce.png",
      email: "emily@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Cameron Williams",
      role: "Web Associate",
      bio: "Creative designer with a passion for user-centered design. David ensures that every digital solution we create is not only functional but also intuitive and visually compelling.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/655c1243196215c1b8e9e867.png",
      email: "david@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Javen Williams",
      role: "Digital Explorer: Web & Social Media",
      bio: "Strategic consultant with expertise in digital transformation and process optimization. Michael works closely with clients to identify opportunities and develop comprehensive growth strategies.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/68917b7c746eb829d161722e.png",
      email: "michael@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Denzel Harrison",
      role: "Digital Explorer: Web & QA Tester",
      bio: "Strategic consultant with expertise in digital transformation and process optimization. Michael works closely with clients to identify opportunities and develop comprehensive growth strategies.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/68917c06902503e7167aa89f.png",
      email: "michael@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Brittnae Patterson",
      role: "Digital Explorer: Tech Support",
      bio: "Expert in GoHighLevel and marketing automation strategies. Emily helps our clients streamline their marketing processes and maximize their customer engagement.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac9f2737d8eb51f1ce.png",
      email: "emily@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Colleen Patterson",
      role: "Digital Explorer: Marketing",
      bio: "Expert in GoHighLevel and marketing automation strategies. Emily helps our clients streamline their marketing processes and maximize their customer engagement.",
      image: "https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/689165ac9f2737d8eb51f1ce.png",
      email: "emily@mytcreative.com",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-[#F3F3F3] to-[#e6f4fa]">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight appear">
              Meet Our
              <span className="block text-[#4EBCED]">Exceptional Team</span>
            </h1>
            <p className="text-xl mb-8 appear" style={{ animationDelay: '0.2s' }}>
              The passionate professionals behind mytCreative's innovative solutions. 
              Our diverse team combines technical expertise with creative vision to deliver 
              transformative digital experiences for our clients.
            </p>
            <div className="appear" style={{ animationDelay: '0.4s' }}>
              <a href="#team-members" className="btn btn-primary">
                Meet the Team
              </a>
            </div>
          </div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Team Values Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
              Our Core Values
            </h2>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              The principles that guide everything we do and shape how we work with our clients and each other.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Target size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation First</h3>
              <p className="text-[#818284]">
                We constantly push boundaries and explore new technologies to deliver 
                cutting-edge solutions that give our clients a competitive advantage.
              </p>
            </div>

            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Users size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Collaborative Partnership</h3>
              <p className="text-[#818284]">
                We believe in true partnership with our clients, working together as one team 
                to achieve shared goals and create lasting success.
              </p>
            </div>

            <div className="card text-center" ref={addToRefs}>
              <div className="text-[#4EBCED] mb-4">
                <Heart size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Impact</h3>
              <p className="text-[#818284]">
                We're committed to giving back and building the next generation of digital 
                creative minds through education and mentorship programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section id="team-members" className="section bg-[#F3F3F3]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
              Our Team Members
            </h2>
            <p className="text-lg max-w-3xl mx-auto" ref={addToRefs}>
              Get to know the talented individuals who make mytCreative's mission possible. 
              Each team member brings unique expertise and passion to every project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card group hover:shadow-xl transition-all duration-300" ref={addToRefs}>
                {/* Photo Area */}
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-[#464E54]">{member.name}</h3>
                  <p className="text-[#4EBCED] font-medium mb-4">{member.role}</p>
                  {/* <p className="text-[#818284] mb-6 leading-relaxed">{member.bio}</p> */}
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                  {/* 
                    <a 
                      href={`mailto:${member.email}`} 
                      className="w-10 h-10 bg-[#4EBCED] rounded-full flex items-center justify-center text-white hover:bg-[#3e96be] transition-colors duration-200"
                      title="Email"
                    >
                      <Mail size={18} />
                    </a> 
                    <a 
                      href={member.linkedin}
                      className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white hover:bg-[#004182] transition-colors duration-200"
                      title="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a> 
                    */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Video Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
                Meet Our Team in Action
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4" ref={addToRefs}>
               <span className="block text-[#4EBCED]">with our Digital GAP Explorers</span> 
              </h3>
              <p className="text-lg max-w-2xl mx-auto" ref={addToRefs}>
                Watch our team discuss our mission, values, and approach to helping businesses 
                transform through technology. Get an inside look at what makes mytCreative special.
              </p>
            </div>

            {/* Video Area */}
            <div className="relative" ref={addToRefs}>
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#4EBCED] to-[#45899E] rounded-xl overflow-hidden shadow-2xl"> 
                {/* Video Placeholder 
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-200 cursor-pointer">
                      <Play size={32} className="ml-1" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Team Introduction Video</h3>
                    <p className="text-lg opacity-90">Click to play our team story</p>
                  </div>
                </div>
                */}
                {/* When you have an actual video, replace the above with: */}
                
                <iframe 
                  src="https://storage.googleapis.com/msgsndr/jv8y1olqwcMUxmhsWkUr/media/6891a11a9f2737e3db52b0d0.mp4"
                  title="mytCreative Team Video"
                  className="w-full h-96"
                  allowFullScreen
                ></iframe>
                
              </div>
              
              {/* Video Caption */}
              <div className="mt-6 text-center">
                <p className="text-[#818284] italic">
                  "Our team's passion for innovation and commitment to client success drives everything we do." 
                  - Dr. Pamela Bynum, Founder & CEO
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Join Our Team?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for innovation 
            and helping businesses succeed. Explore opportunities to grow with mytCreative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn bg-white text-[#4EBCED] hover:bg-[#F3F3F3]">
              View Open Positions
            </a>
            <a href="#contact" className="btn border-2 border-white text-white hover:bg-white hover:text-[#4EBCED]">
              Send Us Your Resume
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPage;