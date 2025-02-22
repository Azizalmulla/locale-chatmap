
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black retro-grid">
        <AppSidebar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 relative"
        >
          <Outlet />
          <div className="retro-scanline absolute inset-0 pointer-events-none" />
        </motion.div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
