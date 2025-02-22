
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
                <svg className="w-24 h-24" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 25 C25 10 75 10 95 25 C75 40 25 40 5 25" stroke="#0FA0CE" strokeWidth="2" className="retro-glow" fill="none"/>
                  <path d="M15 25 C30 15 70 15 85 25 C70 35 30 35 15 25" stroke="#D946EF" strokeWidth="2" className="retro-glow" fill="none"/>
                  <path d="M25 25 C35 20 65 20 75 25 C65 30 35 30 25 25" stroke="#0FA0CE" strokeWidth="2" className="retro-glow" fill="none"/>
                  <circle cx="50" cy="25" r="4" stroke="#D946EF" strokeWidth="2" className="retro-glow" fill="none"/>
                  <circle cx="50" cy="25" r="2" fill="#F97316" className="retro-glow"/>
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
