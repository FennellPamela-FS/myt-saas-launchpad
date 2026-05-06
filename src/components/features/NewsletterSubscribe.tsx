import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSubscribeProps {
  className?: string;
}

const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    try {
      // Here you would integrate with your actual newsletter service
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className={`newsletter-subscribe ${className}`}>
      <div className="flex items-center mb-4">
        <Mail size={24} className="text-[#4EBCED] mr-3" />
        <h4 className="text-white text-xl font-bold">Stay Updated</h4>
      </div>
      
      <p className="mb-6 text-[#F3F3F3] leading-relaxed">
        Subscribe to our newsletter for the latest insights.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            className={`w-full px-4 py-3 rounded-lg bg-[#353c41] border transition-all duration-300 text-white placeholder-[#818284] focus:outline-none focus:ring-2 focus:ring-[#4EBCED] focus:border-transparent ${
              status === 'error' 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-[#55595d] hover:border-[#6c757d]'
            }`}
            disabled={status === 'loading'}
          />
          {status === 'loading' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4EBCED]"></div>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'loading' || !email}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4EBCED] focus:ring-offset-2 focus:ring-offset-[#464E54] ${
            status === 'loading' || !email
              ? 'bg-[#55595d] text-[#818284] cursor-not-allowed transform-none'
              : 'bg-gradient-to-r from-[#4EBCED] to-[#45899E] text-white hover:from-[#3e96be] hover:to-[#3a7485] shadow-lg hover:shadow-xl'
          }`}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#818284] mr-2"></div>
              Subscribing...
            </span>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>
      </form>
 
      {/* Status Messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-center transition-all duration-300 ${
          status === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {status === 'success' ? (
            <CheckCircle size={18} className="mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}

      {/* Privacy Notice */}
      {/* <p className="mt-4 text-xs text-[#818284] leading-relaxed">
        We respect your privacy. Unsubscribe at any time. By subscribing, you agree to our{' '}
        <a href="#" className="text-[#4EBCED] hover:text-[#71c9f1] underline transition-colors">
          Privacy Policy
        </a>
        .
      </p> */}
    </div>
  );
};

export default NewsletterSubscribe;