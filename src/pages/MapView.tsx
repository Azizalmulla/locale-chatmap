
import { useState } from 'react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import { useRetroMode } from './Index';
import { Search } from 'lucide-react';

const MapView = () => {
  const { isRetroMode } = useRetroMode();
  
  // Default to Kuwait City coordinates
  const [coordinates] = useState<[number, number]>([47.9774, 29.3759]);
  const [zoom] = useState<number>(11);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
  };

  if (isRetroMode) {
    // Return the retro version if retro mode is active
    return (
      <div className="flex-1 bg-[#1a1a1a] flex h-full overflow-hidden">
        <div className="w-full h-full ring-1 ring-[#0FA0CE] shadow-[0_0_15px_rgba(15,160,206,0.3)]">
          <Map className="w-full h-full" coordinates={coordinates} zoom={zoom} />
        </div>
      </div>
    );
  }

  // Apple-esque modern map view
  return (
    <div className="dashboard-layout">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-panel w-full"
      >
        <header className="panel-header">
          <div className="panel-title">
            <h2 className="text-base font-medium text-white">Map</h2>
            <p className="text-xs text-gray-400">Explore locations</p>
          </div>
        </header>
        
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={16} color="#9F9EA1" />
          <input 
            type="text" 
            placeholder="Search for a location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="panel-content">
          <Map 
            className="w-full h-full" 
            coordinates={coordinates} 
            zoom={zoom} 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MapView;
