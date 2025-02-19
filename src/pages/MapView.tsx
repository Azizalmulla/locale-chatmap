
import { motion } from 'framer-motion';
import Map from '@/components/Map';

const MapView = () => {
  return (
    <div className="flex-1 bg-[#343541]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen p-4"
      >
        <div className="h-full rounded-lg overflow-hidden ring-1 ring-white/10">
          <Map className="w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default MapView;
