
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const RetroContext = createContext<{
  isRetroMode: boolean;
  toggleRetroMode: () => void;
}>({
  isRetroMode: false,
  toggleRetroMode: () => {},
});

export const useRetroMode = () => useContext(RetroContext);

const Index = () => {
  const [isRetroMode, setIsRetroMode] = useState(false);

  // Reset retro mode to false on component mount
  useEffect(() => {
    setIsRetroMode(false);
  }, []);

  const toggleRetroMode = () => {
    setIsRetroMode(!isRetroMode);
    if (!isRetroMode) {
      toast.success("🕹️ Retro Mode Activated!");
    } else {
      toast.success("Modern Mode Activated!");
    }
  };

  return (
    <RetroContext.Provider value={{ isRetroMode, toggleRetroMode }}>
      <SidebarProvider>
        <div className={`min-h-screen flex w-full bg-background ${isRetroMode ? 'retro-grid bg-black' : 'bg-black'}`}>
          <AppSidebar />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 relative"
          >
            <button
              onClick={toggleRetroMode}
              className="absolute top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 hover:scale-110"
              title={isRetroMode ? "Switch to Modern Mode" : "Switch to Retro Mode"}
            >
              {isRetroMode ? (
                <EyeOff className="w-6 h-6 text-[#0DF5E3] retro-glow" />
              ) : (
                <Eye className="w-6 h-6 text-gray-400 hover:text-white" />
              )}
            </button>
            <Outlet />
            {isRetroMode && <div className="retro-scanline absolute inset-0 pointer-events-none" />}
          </motion.div>
        </div>
      </SidebarProvider>
    </RetroContext.Provider>
  );
};

export default Index;
