
import { BookOpen, Map, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
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

  return (
    <Sidebar className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden backdrop-blur-xl bg-black/20 flex items-center justify-center">
              <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
                <path d="M10 50 Q100 -20 190 50 Q100 120 10 50" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M20 50 Q100 0 180 50 Q100 100 20 50" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M30 50 Q100 20 170 50 Q100 80 30 50" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M40 50 Q100 35 160 50 Q100 65 40 50" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="100" cy="50" r="10" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
          <div className="sidebar-divider" />
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar-menu-item">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={`sidebar-btn group ${
                          location.pathname === item.url ? 'bg-white/10' : ''
                        }`}
                      >
                        <item.icon className="sidebar-icon group-hover:text-white" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-white/50 group-hover:text-white/70">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
