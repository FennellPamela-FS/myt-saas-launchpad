import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FaqPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const faqs: FaqItem[] = [
    {
      category: "mytSimple™ Launchpad",
      question: "How quickly can I really get my website live with the Launchpad?",
      answer: "The mytSimple™ Launchpad is designed for rapid deployment. Once you've input your business information and customized your design preferences, your website can be live within minutes. The actual launch time may vary depending on the complexity of your customizations and content, but most clients can complete the process in under an hour."
    },
    {
      category: "mytSimple™ Launchpad",
      question: "What if I need more customization than the Launchpad offers?",
      answer: "While the Launchpad provides a robust set of customization options, we understand some businesses need more. If you require additional features or customizations, you can easily upgrade to our mytSimple+™ package or explore our Premium Solutions. Our team can help you transition smoothly while preserving all your existing content and settings."
    },
    {
      category: "mytSimple™ Launchpad",
      question: "What kind of business is the mytSimple™ package best for?",
      answer: "The mytSimple™ package is ideal for small businesses, startups, and entrepreneurs who need a professional online presence quickly. It's particularly well-suited for service-based businesses, consultants, and local businesses that want a clean, modern website without the complexity and cost of custom development."
    },
    {
      category: "GHL (GoHighLevel)",
      question: "What is GHL, and why do you use it?",
      answer: "GoHighLevel (GHL) is a powerful all-in-one marketing and business management platform. We use it because it provides comprehensive tools for website hosting, CRM, marketing automation, appointment scheduling, and more. This integration allows us to deliver a complete digital solution that helps you manage and grow your business effectively."
    },
    {
      category: "GHL (GoHighLevel)",
      question: "Do I need to be a GHL expert to use your services?",
      answer: "Not at all! We handle all the technical setup and configuration of GHL for you. While you'll have access to powerful features, we provide training and support to help you use the features you need. Our goal is to make the technology work for you, not the other way around."
    },
    {
      category: "mytCreative Services",
      question: "How do I know which service package is right for me?",
      answer: "We offer a range of packages to suit different business needs and stages of growth. From our mytSimple™ Launchpad for quick starts to our Premium Solutions for comprehensive digital transformation. During our initial consultation, we'll discuss your goals, budget, and requirements to recommend the best fit. You can also start with a basic package and upgrade as your needs evolve."
    },
    {
      category: "mytCreative Services",
      question: "What does 'When our team becomes your team' actually mean for me as a client?",
      answer: "This philosophy means you get more than just a service provider – you get a dedicated partner invested in your success. Our team, including both human experts and our mytCore Collective AI agents, works as an extension of your business. We learn your goals, understand your challenges, and proactively contribute to your growth through technology solutions and strategic guidance."
    },
    {
      category: "mytCreative Services",
      question: "How does the mytCore Collective (AI agents) work on my project?",
      answer: "The mytCore Collective is our suite of specialized AI agents that work alongside our human team. Each agent has specific expertise – from GHL automation (Ava) to UI/UX design (Dave). They help analyze requirements, optimize solutions, and ensure quality while our human experts maintain oversight and provide the strategic direction and personal touch your project needs."
    },
    {
      category: "Pricing & Process",
      question: "Are there any hidden fees in your packages?",
      answer: "No hidden fees! We believe in transparent pricing. All our packages clearly outline what's included and any recurring costs. While there might be optional add-ons or upgrades available, these are always discussed and agreed upon in advance. Our goal is to help you budget effectively for your digital investment."
    },
    {
      category: "Pricing & Process",
      question: "What is the typical process for starting a project with mytCreative?",
      answer: "The process typically begins with a discovery call where we learn about your business and goals. From there, we'll recommend the best solution path and provide a clear proposal. Once you're ready to proceed, we'll gather your requirements, begin implementation, and provide regular updates. Throughout the process, you'll have a dedicated point of contact and access to our support team."
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-[#F3F3F3]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-[#464E54]">
              Have questions? We've got answers! Here are some common inquiries about mytCreative 
              and how we can help your business or organization thrive.
            </p>
          </div>

          <div className="space-y-8">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <h2 className="bg-[#4EBCED] text-white px-6 py-4 text-xl font-bold">
                  {category}
                </h2>
                <div className="p-6">
                  {faqs
                    .filter(faq => faq.category === category)
                    .map((faq, index) => {
                      const actualIndex = faqs.findIndex(f => f === faq);
                      return (
                        <div key={index} className="border-b last:border-b-0">
                          <button
                            className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
                            onClick={() => toggleItem(actualIndex)}
                          >
                            <span className="font-medium pr-8">{faq.question}</span>
                            {openItems.includes(actualIndex) ? (
                              <ChevronUp size={20} className="flex-shrink-0 text-[#4EBCED]" />
                            ) : (
                              <ChevronDown size={20} className="flex-shrink-0 text-[#4EBCED]" />
                            )}
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              openItems.includes(actualIndex) ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <p className="pb-4 text-[#464E54]">{faq.answer}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="mb-6">
              We're here to help! Schedule a consultation with our team to discuss your specific needs.
            </p>
            <a href="#contact" className="btn btn-primary">
              Schedule a Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;