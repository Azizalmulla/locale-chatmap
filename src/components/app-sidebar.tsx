
import { BookOpen, Map, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useRetroMode } from "@/pages/Index";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Guide",
    url: "/app",
    icon: BookOpen,
    description: "Your Agent"
  },
  {
    title: "Explore",
    url: "/app/map",
    icon: Map,
    description: "Interactive map"
  },
  {
    title: "Trending",
    url: "/app/trending",
    icon: TrendingUp,
    description: "Cool stuff to do"
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { isRetroMode } = useRetroMode();

  const isActiveRoute = (itemUrl: string) => {
    const currentPath = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`;
    if (itemUrl === '/app') {
      return currentPath === '/app' || currentPath === '/app/';
    }
    return currentPath === itemUrl;
  };

  return (
    <Sidebar className={`w-64 transition-all duration-500 ${
      isRetroMode 
        ? 'bg-black/40 backdrop-blur-xl border-r border-[#0DF5E3]/20' 
        : 'bg-background border-r border-border'
    }`}>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6 flex flex-col items-center">
            <motion.div 
              className="relative w-32 h-32 flex items-center justify-center"
              initial={false}
              animate={{ 
                scale: isRetroMode ? [1, 1.05, 1] : 1,
                rotate: isRetroMode ? [0, -5, 0, 5, 0] : 0
              }}
              transition={{ 
                duration: isRetroMode ? 2 : 0.3,
                repeat: isRetroMode ? Infinity : 0,
                repeatDelay: 3
              }}
            >
              <svg className="w-24 h-24" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 50 Q100 -20 190 50 Q100 120 10 50" stroke={isRetroMode ? "#0DF5E3" : "#64748b"} strokeWidth="2" className={isRetroMode ? "retro-glow" : ""} fill="none"/>
                <path d="M20 50 Q100 0 180 50 Q100 100 20 50" stroke={isRetroMode ? "#0DF5E3" : "#64748b"} strokeWidth="2" className={isRetroMode ? "retro-glow" : ""} fill="none"/>
                <path d="M30 50 Q100 20 170 50 Q100 80 30 50" stroke={isRetroMode ? "#0DF5E3" : "#64748b"} strokeWidth="2" className={isRetroMode ? "retro-glow" : ""} fill="none"/>
                <path d="M40 50 Q100 35 160 50 Q100 65 40 50" stroke={isRetroMode ? "#0DF5E3" : "#64748b"} strokeWidth="2" className={isRetroMode ? "retro-glow" : ""} fill="none"/>
                <circle cx="100" cy="50" r="10" stroke={isRetroMode ? "#0DF5E3" : "#64748b"} strokeWidth="2" className={isRetroMode ? "retro-glow" : ""} fill="none"/>
              </svg>
            </motion.div>
          </div>
          <div className={`sidebar-divider ${isRetroMode ? 'opacity-20' : ''}`} />
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`group flex w-full ${
                        isRetroMode 
                          ? 'retro-text ' + (
                              isActiveRoute(item.url)
                                ? 'bg-[#0DF5E3]/10 text-[#0DF5E3] retro-glow'
                                : 'text-[#0DF5E3]/80 hover:text-[#0DF5E3] hover:retro-glow'
                            )
                          : isActiveRoute(item.url)
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <motion.div
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-4 py-2 w-full"
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${
                          isRetroMode 
                            ? 'group-hover:text-[#0DF5E3] retro-glow' 
                            : 'group-hover:text-accent-foreground'
                        }`} />
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${isRetroMode ? 'retro-text' : 'font-sans'}`}>
                            {item.title}
                          </span>
                          <span className={`text-xs opacity-70 group-hover:opacity-100 ${isRetroMode ? 'retro-text' : ''}`}>
                            {item.description}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
