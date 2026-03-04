import { Link } from "@inertiajs/react";
import { BookOpen, CircuitBoard, Computer, Folder, Github, LayoutGrid } from "lucide-react";
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
import hardwares from "@/routes/hardwares";
import machines from "@/routes/machines";

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: dashboard(),
    icon: LayoutGrid,
  },
  {
    title: "Maquinas",
    href: machines.index(),
    icon: Computer,
  },
  {
    title: "Hardwares",
    href: hardwares.index(),
    icon: CircuitBoard,
  },
];

const footerNavItems: NavItem[] = [
  {
    title: "Repositório",
    href: "https://github.com/claytonCharles/trackio",
    icon: Github,
  }
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
