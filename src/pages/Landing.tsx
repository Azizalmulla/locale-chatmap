
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Landing = () => {
  const navigate = useNavigate();

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      navigate('/signin');
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
      
      <div 
        onClick={() => navigate('/signin')}
        className="absolute bottom-24 z-10 cursor-pointer w-full h-12"
      />
    </motion.div>
  );
};

export default Landing;
