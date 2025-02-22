
import { BookOpen, Map, TrendingUp, Eye, EyeOff } from "lucide-react";
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
  const { isRetroMode, toggleRetroMode } = useRetroMode();

  const isActiveRoute = (itemUrl: string) => {
    const currentPath = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`;
    if (itemUrl === '/app') {
      return currentPath === '/app' || currentPath === '/app/';
    }
    return currentPath === itemUrl;
  };

  return (
    <Sidebar className={`w-64 transition-all duration-300 ${
      isRetroMode 
        ? 'bg-black/20 backdrop-blur-xl border-r border-[#0FA0CE]/20' 
        : 'bg-background border-r border-border'
    }`}>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6 flex flex-col items-center gap-4">
            <motion.div 
              className={`relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center ${
                isRetroMode 
                  ? 'backdrop-blur-xl bg-black/20 border-2 border-[#0FA0CE]/30' 
                  : 'bg-accent/5 border border-border'
              }`}
              initial={false}
              animate={{ scale: isRetroMode ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {isRetroMode ? (
                <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                  <path d="M10 50 Q100 -20 190 50 Q100 120 10 50" stroke="#0FA0CE" strokeWidth="2" className="retro-glow" fill="none"/>
                  <path d="M20 50 Q100 0 180 50 Q100 100 20 50" stroke="#D946EF" strokeWidth="2" className="retro-glow" fill="none"/>
                  <path d="M30 50 Q100 20 170 50 Q100 80 30 50" stroke="#F97316" strokeWidth="2" className="retro-glow" fill="none"/>
                  <path d="M40 50 Q100 35 160 50 Q100 65 40 50" stroke="#0FA0CE" strokeWidth="2" className="retro-glow" fill="none"/>
                  <circle cx="100" cy="50" r="10" stroke="#D946EF" strokeWidth="2" className="retro-glow" fill="none"/>
                </svg>
              ) : (
                <Eye className="w-20 h-20 text-primary" />
              )}
            </motion.div>
            <button
              onClick={toggleRetroMode}
              className="p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              {isRetroMode ? (
                <EyeOff className="w-6 h-6 text-[#D946EF] retro-glow" />
              ) : (
                <Eye className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              )}
            </button>
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
                                ? 'bg-[#D946EF]/10 text-[#D946EF] retro-glow'
                                : 'text-[#0FA0CE] hover:text-[#D946EF] hover:retro-glow'
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
                            ? 'group-hover:text-[#D946EF]' 
                            : 'group-hover:text-accent-foreground'
                        }`} />
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${!isRetroMode && 'font-sans'}`}>
                            {item.title}
                          </span>
                          <span className="text-xs opacity-70 group-hover:opacity-100">
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
