import React from 'react';

interface WaveDecorationProps {
  position: 'top' | 'bottom';
  fillColor: string;
}

const WaveDecoration: React.FC<WaveDecorationProps> = ({ position, fillColor }) => {
  return (
    <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full h-16 md:h-24 overflow-hidden`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320" 
        className={`w-full h-full ${position === 'top' ? 'transform rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path 
          fill={fillColor} 
          fillOpacity="1" 
          d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default WaveDecoration;