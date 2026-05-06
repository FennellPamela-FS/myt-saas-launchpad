import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Rocket, Zap, Star, Crown, BookOpen, Users, ArrowRight, Heart, Calendar } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import WaveDecoration from '../components/ui/WaveDecoration';

const SolutionsHubPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const roadmapStepVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 30
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Refs for useInView
  const heroRef = useRef(null);
  const quickStartRef = useRef(null);
  const premiumRef = useRef(null);
  const specializedRef = useRef(null);
  const communityRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, threshold: 0.3 });
  const quickStartInView = useInView(quickStartRef, { once: true, threshold: 0.2 });
  const premiumInView = useInView(premiumRef, { once: true, threshold: 0.2 });
  const specializedInView = useInView(specializedRef, { once: true, threshold: 0.2 });
  const communityInView = useInView(communityRef, { once: true, threshold: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, threshold: 0.3 });

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const offsetTop = ref.current.offsetTop - 100; // Account for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-[#F3F3F3] to-[#e6f4fa] overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div 
            ref={heroRef}
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Find Your Path to Digital Growth. 
              <span className="block text-[#4EBCED]">Solutions Built for Your Vision</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              variants={itemVariants}
            >
              From our instant Launchpad for startups to custom enterprise platforms, explore the products and solutions designed to accelerate your growth.
            </motion.p>
            
            {/* Animated roadmap indicator */}
            <motion.div 
              className="flex justify-center mb-8"
              variants={itemVariants}
            >
              <div className="relative">
                <svg width="200" height="60" viewBox="0 0 200 60" className="overflow-visible">
                  <motion.path
                    d="M20 30 Q100 10 180 30"
                    stroke="#4EBCED"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    variants={pathVariants}
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                  />
                  <motion.circle
                    cx="20"
                    cy="30"
                    r="6"
                    fill="#4EBCED"
                    initial={{ scale: 0 }}
                    animate={heroInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  />
                  <motion.circle
                    cx="180"
                    cy="30"
                    r="6"
                    fill="#45899E"
                    initial={{ scale: 0 }}
                    animate={heroInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 2.2, duration: 0.3 }}
                  />
                </svg>
                <motion.div 
                  className="absolute -bottom-8 left-0 text-sm text-[#4EBCED] font-medium"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Start Here
                </motion.div>
                <motion.div 
                  className="absolute -bottom-8 right-0 text-sm text-[#45899E] font-medium"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.5 }}
                >
                  Your Success
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <WaveDecoration position="bottom" fillColor="#ffffff" />
      </section>

      {/* Roadmap Step Indicator */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-2">
        <div className="container-custom">
          <div className="flex justify-center">
            <div className="flex items-center space-x-3 text-sm">
              <motion.div 
                className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => scrollToSection(quickStartRef)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="w-3 h-3 rounded-full bg-[#4EBCED]"></div>
                <span className="text-[#4EBCED] font-medium">Quick Start</span>
              </motion.div>
              <motion.div 
                className="w-6 h-0.5 bg-gradient-to-r from-[#4EBCED] to-[#45899E]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              ></motion.div>
              <motion.div 
                className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => scrollToSection(premiumRef)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                <div className="w-3 h-3 rounded-full bg-[#45899E]"></div>
                <span className="text-[#45899E] font-medium">Premium</span>
              </motion.div>
              <motion.div 
                className="w-6 h-0.5 bg-gradient-to-r from-[#45899E] to-[#464E54]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              ></motion.div>
              <motion.div 
                className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => scrollToSection(specializedRef)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
              >
                <div className="w-3 h-3 rounded-full bg-[#464E54]"></div>
                <span className="text-[#464E54] font-medium">Specialized</span>
              </motion.div>
              <motion.div 
                className="w-6 h-0.5 bg-gradient-to-r from-[#464E54] to-[#4EBCED]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2.0, duration: 0.8 }}
              ></motion.div>
              <motion.div 
                className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => scrollToSection(communityRef)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 }}
              >
                <div className="w-3 h-3 rounded-full bg-[#4EBCED]"></div>
                <span className="text-[#4EBCED] font-medium">GAP Fillers</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Solutions Section */}
      <section className="section bg-white relative">
        {/* Connecting Path SVG */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 z-10">
          <svg width="4" height="100" viewBox="0 0 4 100">
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100"
              stroke="#4EBCED"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={quickStartInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </div>

        <div className="container-custom">
          <motion.div 
            ref={quickStartRef}
            className="text-center mb-16"
            initial="hidden"
            animate={quickStartInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-[#4EBCED] rounded-full mb-6 shadow-lg"
              variants={roadmapStepVariants}
            >
              <span className="text-white font-bold text-xl">1</span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={itemVariants}
            >
              Our Products: Quick Start Solutions for Fast Growth
            </motion.h2>
            <motion.p 
              className="text-lg max-w-3xl mx-auto"
              variants={itemVariants}
            >
              These are our scalable, ready-to-launch software products designed to get your business online and growing, effortlessly. Each solution is powered by our proprietary mytSimple™ Launchpad and built on our powerful ASK framework, giving you the benefit of an enterprise-level system through a simple, intuitive experience.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial="hidden"
            animate={quickStartInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* mytSimple™ */}
            <motion.div 
              className="card relative shadow-lg border-t-4 border-[#4EBCED] group hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 bg-[#4EBCED] text-white px-4 py-1 text-sm">
                Most Popular
              </div>
              <div className="text-[#4EBCED] mb-4">
                <Rocket size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">mytSimple™</h3>
              <div className="text-2xl font-bold text-[#4EBCED] mb-4">
                $147<span className="text-base font-normal text-[#818284]">/month</span>
                <div className="text-sm font-normal text-green-600">$0 Setup Fee</div>
              </div>
              <p className="text-[#818284] mb-4">
                The easiest way to get a professional one-page website and foundational marketing 
                automation, personalized in minutes with our exclusive mytSimple™ Launchpad.
              </p>
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-2">Ideal For:</h4>
                <p className="text-sm text-[#818284]">
                  Startups, local service providers, creative professionals, and small businesses 
                  needing an impactful online start.
                </p>
              </div>
              <div className="mt-auto">
                <Link 
                  to="/quick-start"
                  className="btn btn-primary w-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                >
                  Explore mytSimple™
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* mytSimple+™ */}
            <motion.div 
              className="card relative shadow-lg border-t-4 border-[#45899E] group hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 bg-[#45899E] text-white px-4 py-1 text-sm">
                Enhanced
              </div>
              <div className="text-[#45899E] mb-4">
                <Zap size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">mytSimple+™</h3>
              <div className="text-2xl font-bold text-[#45899E] mb-4">
                $247-$347+<span className="text-base font-normal text-[#818284]">/month</span>
                <div className="text-sm font-normal text-green-600">$0 Setup Fee</div>
              </div>
              <p className="text-[#818284] mb-4">
                For growing businesses needing more power. Includes everything in mytSimple™ 
                plus advanced SEO, CRM integration, email marketing campaigns, and more to scale 
                your operations.
              </p>
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-2">Ideal For:</h4>
                <p className="text-sm text-[#818284]">
                  Growing service businesses, multi-location businesses, and professional firms 
                  needing integrated tools.
                </p>
              </div>
              <div className="mt-auto">
                <Link 
                  to="/quick-start"
                  className="btn bg-[#45899E] text-white hover:bg-[#3a7485] w-full group-hover:shadow-lg transition-all duration-300"
                >
                  Explore mytSimple+™
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Solutions Section */}
      <section className="section bg-[#F3F3F3] relative">
        {/* Connecting Path SVG */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 z-10">
          <svg width="4" height="100" viewBox="0 0 4 100">
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100"
              stroke="#45899E"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={premiumInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </div>

        <div className="container-custom">
          <motion.div 
            ref={premiumRef}
            className="text-center mb-16"
            initial="hidden"
            animate={premiumInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-[#45899E] rounded-full mb-6 shadow-lg"
              variants={roadmapStepVariants}
            >
              <span className="text-white font-bold text-xl">2</span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={itemVariants}
            >
              Enterprise & Custom Implementations for Strategic Growth
            </motion.h2>
            <motion.p 
              className="text-lg max-w-3xl mx-auto"
              variants={itemVariants}
            >
              For established businesses with unique challenges, we offer custom solutions built on our exclusive ASK platform. This is a high-end product implementation where our team works as your dedicated partner to architect a bespoke application tailored to your strategic goals, providing a powerful asset for your long-term transformation.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial="hidden"
            animate={premiumInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* Guided Journey™ */}
            <motion.div 
              className="card relative shadow-lg border-t-4 border-[#4EBCED] group hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
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
              <p className="text-[#818284] mb-4">
                A collaborative partnership focused on strategic planning, custom development, 
                and achieving your specific business growth objectives with dedicated guidance 
                and advanced implementation.
              </p>
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-2">Ideal For:</h4>
                <p className="text-sm text-[#818284]">
                  Established businesses ($250K-$1M revenue) and growing regional leaders.
                </p>
              </div>
              <div className="mt-auto">
                <Link 
                  to="/premium-solutions"
                  className="btn btn-primary w-full group-hover:shadow-lg transition-all duration-300"
                >
                  Explore Guided Journey™
                </Link>
              </div>
            </motion.div>

            {/* Concierge Experience™ */}
            <motion.div 
              className="card relative shadow-lg border-t-4 border-[#464E54] group hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
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
              <p className="text-[#818284] mb-4">
                Our highest level of full-service implementation. A dedicated mytCreative team 
                becomes an extension of yours, driving comprehensive strategy, custom development, 
                and business transformation.
              </p>
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-2">Ideal For:</h4>
                <p className="text-sm text-[#818284]">
                  Scaling businesses ($1M+ revenue), large enterprises, and complex organizations.
                </p>
              </div>
              <div className="mt-auto">
                <Link 
                  to="/premium-solutions"
                  className="btn bg-[#464E54] text-white hover:bg-[#353c41] w-full group-hover:shadow-lg transition-all duration-300"
                >
                  Explore Concierge Experience™
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Specialized Services Section */}
      <section className="section bg-white relative">
        {/* Connecting Path SVG */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 z-10">
          <svg width="4" height="100" viewBox="0 0 4 100">
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100"
              stroke="#464E54"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={specializedInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </div>

        <div className="container-custom">
          <motion.div 
            ref={specializedRef}
            className="text-center mb-16"
            initial="hidden"
            animate={specializedInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-[#464E54] rounded-full mb-6 shadow-lg"
              variants={roadmapStepVariants}
            >
              <span className="text-white font-bold text-xl">3</span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={itemVariants}
            >
              Specialized Services for Creators & Innovators
            </motion.h2>
            <motion.p 
              className="text-lg max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Beyond our core business solutions, we offer specialized platforms for creators and on-demand access to our network of vetted technical professionals.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-12"
            initial="hidden"
            animate={specializedInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* Author & Creator Packages */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card shadow-lg border-t-4 border-[#4EBCED] h-full group hover:shadow-2xl transition-all duration-300">
                <div className="text-[#4EBCED] mb-4">
                  <BookOpen size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Start. Launch. Soar.</h3>
                <p className="text-[#818284] mb-6">
                  Elevate your online presence with our Digital Presence Packages for Authors. 
                  We offer tailored solutions to amplify your digital footprint, from professional 
                  editing and formatting to custom landing pages and online course creation.
                </p>
                <div className="mb-6">
                  <h4 className="font-bold text-sm mb-2">Ideal For:</h4>
                  <p className="text-sm text-[#818284]">
                    Aspiring authors and content creators.
                  </p>
                </div>
                <div className="mt-auto">
                  <Link 
                    to="/author-services"
                    className="btn btn-primary w-full group-hover:shadow-lg transition-all duration-300"
                  >
                    Explore Author Services
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* mytDev Connect */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card shadow-lg border-t-4 border-[#45899E] h-full group hover:shadow-2xl transition-all duration-300">
                <div className="text-[#45899E] mb-4">
                  <Users size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Power Your Projects with Expert Talent</h3>
                <p className="text-[#818284] mb-6">
                  mytDev Connect connects your business with skilled, vetted software developers 
                  and engineers. Whether you need talent for a specific project or ongoing 
                  technical expertise, we bridge the gap.
                </p>
                <div className="mb-6">
                  <h4 className="font-bold text-sm mb-2">Ideal For:</h4>
                  <p className="text-sm text-[#818284]">
                    Businesses needing flexible, on-demand technical talent.
                  </p>
                </div>
                <div className="mt-auto">
                  <Link 
                    to="/mytdev"
                    className="btn bg-[#45899E] text-white hover:bg-[#3a7485] w-full group-hover:shadow-lg transition-all duration-300"
                  >
                    Explore mytDev Connect
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Partnership Section */}
      <section className="section bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white relative">
        {/* Connecting Path SVG */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 z-10">
          <svg width="4" height="100" viewBox="0 0 4 100">
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={communityInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </div>

        <div className="container-custom">
          <motion.div 
            ref={communityRef}
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate={communityInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 shadow-lg backdrop-blur-sm"
              variants={roadmapStepVariants}
            >
              <Heart size={32} className="text-white" />
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={itemVariants}
            >
              Become a "GAP Filler": Invest in Our Youth's Future
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Our mission extends beyond business. The Digital GAP Program empowers local youth 
              with high-demand tech skills. We invite you to partner with us to sponsor a student 
              or a cohort, investing directly in the next generation of digital leaders and 
              strengthening our community's workforce.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link 
                to="/community-impact"
                className="btn bg-white text-[#4EBCED] hover:bg-[#F3F3F3] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Learn About Sponsoring Youth
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-[#8598A8] text-white relative">
        <div className="container-custom text-center">
          <motion.div 
            ref={ctaRef}
            className="max-w-3xl mx-auto"
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <Calendar size={48} className="mx-auto mb-4" />
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={itemVariants}
            >
              Not Sure Where to Start?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Every vision is unique. Let's talk about yours. Schedule a complimentary discovery call, 
              and our team will help you identify the right path and the right solutions to make 
              your vision plain.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link 
                to="/book-discovery-call"
                className="btn bg-[#4EBCED] text-white hover:bg-[#3e96be] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Schedule a Complimentary Call
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SolutionsHubPage;