
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import { useRetroMode } from './Index';

const MapView = () => {
  const { isRetroMode } = useRetroMode();

  return (
    <div className="flex-1 bg-[#343541]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen p-4"
      >
        <div className={`h-full rounded-lg overflow-hidden ${
          isRetroMode 
            ? 'ring-1 ring-[#0FA0CE] shadow-[0_0_15px_rgba(15,160,206,0.3)]' 
            : 'ring-1 ring-white/10'
        }`}>
          <Map className="w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default MapView;
