
import { Calendar, Map } from "lucide-react";
import { motion } from "framer-motion";
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
    title: "Plan My Day",
    url: "/plan",
    icon: Calendar,
    description: "AI-powered daily recommendations"
  },
  {
    title: "Cool Stuff To Do",
    url: "/activities",
    icon: Map,
    description: "Trending events & places"
  }
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6">
            <h1 className="text-lg font-medium tracking-tight">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Locale
              </span>
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              Discover your city
            </p>
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
                      <a href={item.url} className="sidebar-btn group">
                        <item.icon className="sidebar-icon group-hover:text-white" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-white/50 group-hover:text-white/70">
                            {item.description}
                          </span>
                        </div>
                      </a>
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
