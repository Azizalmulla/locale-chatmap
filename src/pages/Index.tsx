
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { CustomEye } from '@/components/CustomEye';

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
            >
              <CustomEye 
                isOpen={!isRetroMode} 
                className={`w-8 h-8 ${isRetroMode ? 'text-[#D946EF] retro-glow' : 'text-white'}`} 
              />
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
