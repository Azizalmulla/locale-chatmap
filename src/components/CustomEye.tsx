
import React from 'react';

interface CustomEyeProps {
  isOpen?: boolean;
  className?: string;
}

export const CustomEye = ({ isOpen = true, className = '' }: CustomEyeProps) => {
  return (
    <svg 
      viewBox="0 0 200 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${isOpen ? 'opacity-100' : 'opacity-70'}`}
    >
      {isOpen ? (
        <>
          <path d="M10 50 Q100 -25 190 50 Q100 125 10 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 50 Q100 5 180 50 Q100 95 20 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 50 Q100 20 170 50 Q100 80 30 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M40 50 Q100 35 160 50 Q100 65 40 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="100" cy="50" r="12" stroke="currentColor" strokeWidth="3" className="animate-pulse-stroke"/>
        </>
      ) : (
        <>
          <path d="M10 50 Q100 -25 190 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 50 Q100 125 190 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="100" cy="50" r="10" stroke="currentColor" strokeWidth="2" className="animate-pulse-stroke"/>
        </>
      )}
    </svg>
  );
};
