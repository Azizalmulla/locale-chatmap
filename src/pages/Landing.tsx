
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        className?: string;
      }
    }
  }
}

const Landing = () => {
  const navigate = useNavigate();

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      navigate('/app');
    }
  };

  // Add event listener for Enter key
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex flex-col items-center justify-center relative bg-black"
    >
      <spline-viewer 
        url="https://prod.spline.design/HONofF9QBUivdu9Z/scene.splinecode"
        className="absolute inset-0 z-0"
      />
      
      <div className="relative z-10 text-center">
        <p className="text-white/70">Dashboard URL: /app</p>
      </div>
    </motion.div>
  );
};

export default Landing;
