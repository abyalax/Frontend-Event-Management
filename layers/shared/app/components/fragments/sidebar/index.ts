import { HelpCircle, LayoutDashboard, Settings } from "lucide-vue-next";
import type { Component } from "vue";

export { default as Sidebar } from "./AppSidebar.vue";
export { default as SidebarGroup } from "./AppSidebarGroup.vue";
export { default as SidebarUser } from "./AppSidebarUser.vue";
export { default as SignOutDialog } from "./SignOutDialog.vue";

export interface MenuItem {
  title: string;
  url: string;
  icon: Component;
  badge?: {
    count: number;
    variant: "default" | "destructive" | "secondary" | "outline";
  };
  submenu?: MenuItem[];
  permissions: string[];
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export interface SidebarAppProps {
  user?: {
    name?: string | null;
    email?: string | null;
    avatar?: string;
  };
  appName?: string;
  appLogo?: string;
}

export const sidebarItems = (): MenuGroup[] => [
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        permissions: [],
      },
    ],
  },
];

export const bottomItems: MenuItem[] = [
  {
    title: "Help & Support",
    url: "/help",
    icon: HelpCircle,
    permissions: [],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    permissions: [],
  },
];
