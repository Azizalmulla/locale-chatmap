
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Landing = () => {
  const navigate = useNavigate();

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      navigate('/setup');
    }
  };

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
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/HONofF9QBUivdu9Z/scene.splinecode"
        />
      </div>
      
      {/* Added clickable button */}
      <motion.button
        onClick={() => navigate('/setup')}
        className="absolute bottom-24 z-10 px-8 py-2 rounded-full border border-white/20 bg-transparent hover:bg-white/5 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-white/60 text-sm font-medium">OPEN APP</span>
      </motion.button>
    </motion.div>
  );
};

export default Landing;
