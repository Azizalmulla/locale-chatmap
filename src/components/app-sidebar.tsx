import { MessageSquare, Map, TrendingUp, X, User } from "lucide-react";
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
    title: "Dashboard",
    url: "/app",
    icon: MessageSquare,
    description: "Combined view"
  },
  {
    title: "Chat",
    url: "/app/chat",
    icon: MessageSquare,
    description: "Talk with your guide"
  },
  {
    title: "Map",
    url: "/app/map",
    icon: Map,
    description: "Explore locations"
  },
  {
    title: "Cool Stuff To Do",
    url: "/app/trending",
    icon: TrendingUp,
    description: "Trending activities"
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { isRetroMode } = useRetroMode();

  const isActiveRoute = (itemUrl: string) => {
    if (itemUrl === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname === itemUrl;
  };

  if (isRetroMode) {
    // Return the retro version if retro mode is active
    return (
      <Sidebar className={`w-64 transition-all duration-500 ${
        isRetroMode 
          ? 'bg-black/40 backdrop-blur-xl border-r border-[#0DF5E3]/20' 
          : 'bg-background border-r border-border'
      }`}>
        <SidebarContent>
          <SidebarGroup>
            <div className="px-4 py-6 flex flex-col items-center overflow-hidden">
              <motion.div 
                className="relative w-32 h-32 flex items-center justify-center"
                initial={false}
                animate={
                  isRetroMode
                    ? {
                        scale: [1, 0.5, 1.2, 1],
                        rotate: [0, -180, 180, 0],
                        x: [-50, 50, 0],
                        y: [-30, 30, 0],
                      }
                    : {
                        scale: 1,
                        rotate: 0,
                        x: 0,
                        y: 0,
                      }
                }
                transition={
                  isRetroMode
                    ? {
                        duration: 1.5,
                        times: [0, 0.4, 0.7, 1],
                        ease: "easeInOut",
                      }
                    : {
                        duration: 0.5,
                      }
                }
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
                              ? 'text-accent-foreground'
                              : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/50'
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

  // Apple-esque minimal sidebar
  return (
    <aside className="minimal-sidebar">
      <div className="sidebar-avatar">
        <User size={16} color="#FFFFFF" />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link 
            key={item.title}
            to={item.url}
            className={`nav-icon ${isActiveRoute(item.url) ? 'active' : ''}`}
            title={item.title}
          >
            <item.icon size={18} />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
