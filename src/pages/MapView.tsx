
import { useState } from 'react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import { useRetroMode } from './Index';

const MapView = () => {
  const { isRetroMode } = useRetroMode();
  
  // Default to Kuwait City coordinates
  const [coordinates] = useState<[number, number]>([47.9774, 29.3759]);
  const [zoom] = useState<number>(11);

  return (
    <div className="flex-1 bg-[#1a1a1a] flex h-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-full h-full"
      >
        <div className={`w-full h-full ${
          isRetroMode 
            ? 'ring-1 ring-[#0FA0CE] shadow-[0_0_15px_rgba(15,160,206,0.3)]' 
            : ''
        }`}>
          <Map className="w-full h-full" coordinates={coordinates} zoom={zoom} />
        </div>
      </motion.div>
    </div>
  );
};

export default MapView;
