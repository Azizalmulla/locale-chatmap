
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex flex-col gap-2 p-4 rounded-lg glass-morphism hover:bg-white/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                          {item.description}
                        </p>
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
