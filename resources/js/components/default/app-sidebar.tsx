import { Link } from "@inertiajs/react";
import { BookOpen, Folder, LayoutGrid } from "lucide-react";
import { NavFooter } from "@/components/default/nav-footer";
import { NavMain } from "@/components/default/nav-main";
import { NavUser } from "@/components/default/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/default/sidebar";
import type { NavItem } from "@/types";
import AppLogo from "./app-logo";
import { dashboard } from "@/routes";

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: dashboard(),
    icon: LayoutGrid,
  },
];

const footerNavItems: NavItem[] = [
  {
    title: "Repository",
    href: "https://github.com/laravel/react-starter-kit",
    icon: Folder,
  },
  {
    title: "Documentation",
    href: "https://laravel.com/docs/starter-kits#react",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
