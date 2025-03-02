
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
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
  const location = useLocation();
  
  // Check if we're on the root app path to use email layout
  const isEmailLayout = location.pathname === '/app';

  const toggleRetroMode = () => {
    setIsRetroMode(!isRetroMode);
    if (!isRetroMode) {
      toast.success("🕹️ Retro Mode Activated!");
    } else {
      toast.success("Modern Mode Activated!");
    }
  };

  if (isEmailLayout) {
    return (
      <RetroContext.Provider value={{ isRetroMode, toggleRetroMode }}>
        <div className={`h-screen w-full bg-black ${isRetroMode ? 'retro-grid' : ''}`}>
          <Outlet />
          {isRetroMode && <div className="retro-scanline absolute inset-0 pointer-events-none" />}
        </div>
      </RetroContext.Provider>
    );
  }

  return (
    <RetroContext.Provider value={{ isRetroMode, toggleRetroMode }}>
      <SidebarProvider>
        <div className={`h-screen flex w-full bg-background ${isRetroMode ? 'retro-grid bg-black' : ''}`}>
          <AppSidebar />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 relative overflow-hidden"
          >
            <button
              onClick={toggleRetroMode}
              className="absolute top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              {isRetroMode ? (
                <EyeOff className="w-6 h-6 text-[#D946EF] retro-glow" />
              ) : (
                <Eye className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              )}
            </button>
            <div className="h-full overflow-auto">
              <Outlet />
            </div>
            {isRetroMode && <div className="retro-scanline absolute inset-0 pointer-events-none" />}
          </motion.div>
        </div>
      </SidebarProvider>
    </RetroContext.Provider>
  );
};

export default Index;
