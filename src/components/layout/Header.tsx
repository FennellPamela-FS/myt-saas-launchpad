import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBusinessSolutionsOpen, setIsBusinessSolutionsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsBusinessSolutionsOpen(false);
    setIsAboutOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="https://storage.googleapis.com/msgsndr/5WkCjdNQApiEdU3hlSMc/media/87a37730-dc12-4597-b730-6b76ecf537f6.png" 
            alt="mytCreative" 
            className="h-10 md:h-12"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors hover:text-[#4EBCED] ${
                  location.pathname === '/' ? 'text-[#4EBCED] font-medium' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li className="relative group">
              <button
                className={`flex items-center transition-colors hover:text-[#4EBCED] ${
                  ['/quick-start', '/premium-solutions', '/launchpad', '/mytdev'].includes(location.pathname) 
                    ? 'text-[#4EBCED] font-medium' 
                    : ''
                }`}
                onClick={() => setIsBusinessSolutionsOpen(!isBusinessSolutionsOpen)}
              >
                Business Solutions
                <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 transition-all duration-200 ${
                isBusinessSolutionsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <Link 
                  to="/quick-start" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/quick-start' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  Quick Start Solutions
                </Link>
                <Link 
                  to="/premium-solutions" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/premium-solutions' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  Premium Solutions
                </Link>
                <Link 
                  to="/launchpad" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/launchpad' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  mytSimple™ Launchpad
                </Link>
                <Link 
                  to="/mytdev" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/mytdev' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  mytDev Connect
                </Link>
              </div>
            </li>
            <li>
              <Link 
                to="/author-services" 
                className={`transition-colors hover:text-[#4EBCED] ${
                  location.pathname === '/author-services' ? 'text-[#4EBCED] font-medium' : ''
                }`}
              >
                Author Services
              </Link>
            </li>
            <li>
              <Link 
                to="/mytcore" 
                className={`transition-colors hover:text-[#4EBCED] ${
                  location.pathname === '/mytcore' ? 'text-[#4EBCED] font-medium' : ''
                }`}
              >
                mytCore Collective
              </Link>
            </li>
            <li className="relative group">
              <button
                className={`flex items-center transition-colors hover:text-[#4EBCED] ${
                  ['/community-impact', '/team', '/faq'].includes(location.pathname) 
                    ? 'text-[#4EBCED] font-medium' 
                    : ''
                }`}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
              >
                About
                <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 transition-all duration-200 ${
                isAboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <Link 
                  to="/community-impact" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/community-impact' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  Community Impact
                </Link>
                <Link 
                  to="/team" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/team' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  Our Team
                </Link>
                <Link 
                  to="/faq" 
                  className={`block px-4 py-2 hover:bg-[#F3F3F3] ${
                    location.pathname === '/faq' ? 'text-[#4EBCED]' : ''
                  }`}
                >
                  FAQ
                </Link>
              </div>
            </li>
            <li> 
              <Link 
                to="/book-discovery-call" 
                className="btn btn-primary py-2 px-4"
              >
                Let's Talk
              </Link>
            </li>
            {/* <li>
              <a 
                href="https://app.mytcreative.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline py-2 px-4"
              >
                Login
              </a>
            </li> */}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-[#464E54] focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 bg-white z-40 lg:hidden transition-transform duration-300 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }}
      >
        <nav className="h-full overflow-y-auto p-6">
          <ul className="space-y-6">
            <li>
              <Link 
                to="/" 
                className={`block text-lg transition-colors hover:text-[#4EBCED] ${
                  location.pathname === '/' ? 'text-[#4EBCED] font-medium' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <button
                className="text-left w-full text-lg mb-2 flex items-center justify-between"
                onClick={() => setIsBusinessSolutionsOpen(!isBusinessSolutionsOpen)}
              >
                Business Solutions
                <ChevronDown size={20} className={`transition-transform duration-200 ${isBusinessSolutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-4 space-y-4 mt-2 overflow-hidden transition-all duration-200 ${
                isBusinessSolutionsOpen ? 'max-h-96' : 'max-h-0'
              }`}>
                <Link 
                  to="/quick-start" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/quick-start' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  Quick Start Solutions
                </Link>
                <Link 
                  to="/premium-solutions" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/premium-solutions' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  Premium Solutions
                </Link>
                <Link 
                  to="/launchpad" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/launchpad' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  mytSimple™ Launchpad
                </Link>
                <Link 
                  to="/mytdev" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/mytdev' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  mytDev Connect
                </Link>
              </div>
            </li>
            <li>
              <Link 
                to="/author-services" 
                className={`block text-lg transition-colors hover:text-[#4EBCED] ${
                  location.pathname === '/author-services' ? 'text-[#4EBCED] font-medium' : ''
                }`}
              >
                Author Services
              </Link>
            </li>
            <li>
              <Link 
                to="/mytcore" 
                className={`block text-lg transition-colors hover:text-[#4EBCED] ${
                  location.pathname === '/mytcore' ? 'text-[#4EBCED] font-medium' : ''
                }`}
              >
                mytCore Collective
              </Link>
            </li>
            <li>
              <button
                className="text-left w-full text-lg mb-2 flex items-center justify-between"
                onClick={() => setIsAboutOpen(!isAboutOpen)}
              >
                About
                <ChevronDown size={20} className={`transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-4 space-y-4 mt-2 overflow-hidden transition-all duration-200 ${
                isAboutOpen ? 'max-h-96' : 'max-h-0'
              }`}>
                <Link 
                  to="/community-impact" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/community-impact' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  Community Impact
                </Link>
                <Link 
                  to="/team" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/team' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  Our Team
                </Link>
                <Link 
                  to="/faq" 
                  className={`block transition-colors hover:text-[#4EBCED] ${
                    location.pathname === '/faq' ? 'text-[#4EBCED] font-medium' : ''
                  }`}
                >
                  FAQ
                </Link>
              </div>
            </li>
            <li className="pt-4">
              <Link 
                to="/book-discovery-call" 
                className="btn btn-primary block text-center mb-4"
              >
                Let's Talk
              </Link>
            </li>
            <li>
              <a 
                href="https://app.mytcreative.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline block text-center"
              >
                Login
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;