import { Home, BookOpen, TrendingUp, MessageSquare, Heart, UserPlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    testId: "nav-dashboard",
  },
  {
    title: "Journal",
    url: "/journal",
    icon: BookOpen,
    testId: "nav-journal",
  },
  {
    title: "Insights",
    url: "/insights",
    icon: TrendingUp,
    testId: "nav-insights",
  },
  {
    title: "AI Assistant",
    url: "/assistant",
    icon: MessageSquare,
    testId: "nav-assistant",
  },
  {
    title: "Coping Strategies",
    url: "/strategies",
    icon: Heart,
    testId: "nav-strategies",
  },
  {
    title: "Connect",
    url: "/connect",
    icon: UserPlus,
    testId: "nav-connect",
  },
];

export function AppSidebar() {
  const currentPath = window.location.pathname;

  const handleNavigation = (url: string) => {
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Aceso</h2>
          <p className="text-sm text-muted-foreground">by origin8</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.url);
                      }}
                      data-testid={item.testId}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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
